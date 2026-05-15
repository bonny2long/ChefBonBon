import fetch from "node-fetch";

const CLAUDE_API_URL =
  process.env.CLAUDE_API_URL || "https://api.anthropic.com/v1/messages";
const ANTHROPIC_MODEL =
  process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

const CLAUDE_TIMEOUT_MS = 30000;

const intentCache = new Map();
const INTENT_CACHE_TTL = 10 * 60 * 1000;

const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";
  return input.replace(/[\x00-\x1F\x7F]/g, "").slice(0, 2000);
};

const fetchWithTimeout = async (url, options, timeoutMs) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err;
  }
};

export const generateRecipeText = async (prompt, apiKey) => {
  if (!prompt) {
    const error = new Error("Prompt is required.");
    error.statusCode = 400;
    throw error;
  }
  if (!apiKey) {
    const error = new Error("Anthropic API Key is missing.");
    error.statusCode = 500;
    throw error;
  }

  const sanitizedPrompt = sanitizeInput(prompt);

  console.log(`Using Claude API URL: ${CLAUDE_API_URL}`);
  console.log(`Using Anthropic model: ${ANTHROPIC_MODEL}`);
  console.log(`API Key length: ${apiKey.length}`);

  const response = await fetchWithTimeout(
    CLAUDE_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1100,
        temperature: 0.7,
        messages: [{ role: "user", content: sanitizedPrompt }],
      }),
    },
    CLAUDE_TIMEOUT_MS,
  );

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    console.error("Claude API error response:", JSON.stringify(data, null, 2));
    const errorType = data?.error?.type;
    const upstreamMessage =
      data?.error?.message ||
      `Claude API error: ${response.status} ${response.statusText}`;

    if (data?.error?.type === "not_found_error") {
      const error = new Error(
        `Anthropic model not found: ${ANTHROPIC_MODEL}. Set ANTHROPIC_MODEL to a model available in your workspace.`,
      );
      error.statusCode = 502;
      error.upstreamStatus = response.status;
      throw error;
    }

    const error = new Error(upstreamMessage);
    error.statusCode =
      response.status === 401 || response.status === 403 ? 500 : 502;
    error.upstreamStatus = response.status;
    error.upstreamType = errorType;
    throw error;
  }

  const text = data?.content?.[0]?.text;
  if (!text) throw new Error("Claude returned no text");

  return text;
};

export const detectRecipeIntent = async (ingredients, apiKey) => {
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    throw new Error("Ingredients are required for intent detection.");
  }

  const cacheKey = ingredients
    .map((i) => i.toLowerCase().trim())
    .sort()
    .join("|");

  if (intentCache.has(cacheKey)) {
    const cached = intentCache.get(cacheKey);

    if (Date.now() - cached.timestamp < INTENT_CACHE_TTL) {
      return cached.intent;
    }

    intentCache.delete(cacheKey);
  }

  const prompt = `
You are classifying user intent.

Ingredients:
${ingredients.join(", ")}

Respond with exactly ONE word:
food or drink
`;

  const intent = await generateRecipeText(prompt, apiKey);

  const normalizedIntent = intent.trim().toLowerCase();

  if (!["food", "drink"].includes(normalizedIntent)) {
    throw new Error(`Invalid intent response: ${intent}`);
  }

  intentCache.set(cacheKey, {
    intent: normalizedIntent,
    timestamp: Date.now(),
  });

  return normalizedIntent;
};
