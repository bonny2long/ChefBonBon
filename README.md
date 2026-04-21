# ChefBot - AI-Powered Recipe Generator

A full-stack web application that leverages artificial intelligence to generate personalized recipes based on user-provided ingredients.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/ChefBot.git
cd ChefBot

# Install frontend dependencies
cd client && npm install

# Install backend dependencies
cd ../server && npm install

# Set up environment variables
# See docs/SUPABASE_SETUP.md for Supabase configuration
# See docs/RAILWAY_DEPLOYMENT.md for backend deployment

# Run locally
cd ../client && npm run dev    # Frontend: http://localhost:5173
# In another terminal:
cd ../server && npm run start # Backend: http://localhost:3000
```

## Features

- AI-powered recipe generation using Anthropic Claude
- User authentication with Supabase
- Save and share recipes
- Like and comment on community recipes
- Real-time updates

## Documentation

- [Setup Guide](docs/SUPABASE_SETUP.md) - Database configuration
- [Migration Summary](docs/MIGRATION_SUMMARY.md) - Firebase to Supabase migration
- [Deployment](docs/RAILWAY_DEPLOYMENT.md) - Deploy backend to Railway

## Tech Stack

- React 19 + Vite
- Node.js + Express
- Supabase (PostgreSQL)
- Anthropic Claude API (`ANTHROPIC_MODEL` defaults to `claude-3-5-haiku-20241022`)
- Tailwind CSS
