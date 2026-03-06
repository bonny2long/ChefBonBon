# ChefBot - AI-Powered Recipe Generator

A full-stack web application that leverages artificial intelligence to generate personalized recipes based on user-provided ingredients.

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Technical Stack](#technical-stack)
- [Architecture and Database Migration](#architecture-and-database-migration)
- [Installation and Setup](#installation-and-setup)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Security and Authentication](#security-and-authentication)
- [Developer](#developer)

## Overview

ChefBot is a full-stack web application that leverages artificial intelligence to generate personalized recipes based on user-provided ingredients. Built with modern web technologies, ChefBot features user authentication, real-time database operations, social features, and AI-powered content generation through Claude AI integration.

### Problem Solved
ChefBot addresses the challenge of deciding what to cook with available ingredients by providing AI-generated, creative recipe suggestions tailored to user inputs.

## Key Features

### Core Functionality
- **AI Recipe Generation**: Integration with Anthropic's Claude 3 Haiku API for intelligent, context-aware recipe creation
- **Recipe Types**: Support for both food and drink recipes with specialized prompts
- **Cooking Methods**: Dynamic cooking method selection (bake, fry, grill, etc.)
- **Ingredient Management**: Dynamic ingredient input system with validation (minimum 4 ingredients)
- **User Authentication**: Secure email/password authentication with custom username support
- **Recipe Management**: Save, edit, delete, and organize personal recipe collections
- **Social Features**: Public recipe feed with like/unlike functionality and community engagement
- **Responsive Design**: Mobile-first approach with Tailwind CSS for cross-device compatibility

### User Experience
- Guest access for immediate functionality without registration
- Persistent user sessions with secure authentication
- Real-time updates for likes and social interactions
- Optimistic UI updates for instant feedback
- Loading states and error handling for robust user experience
- Rate limiting on API endpoints to prevent abuse

### Technical Stack

### Frontend
- React 19.1 - Component-based UI architecture with hooks
- Vite - Fast build tool and development server
- Tailwind CSS - Utility-first CSS framework for responsive design
- JavaScript ES6+ - Modern JavaScript features and async/await patterns

### Backend
- Node.js - Server-side JavaScript runtime
- Express 5.1 - RESTful API framework
- CORS - Cross-Origin Resource Sharing middleware
- dotenv - Environment variable management

### Database and Authentication
- Supabase - PostgreSQL database with built-in authentication
- Row Level Security (RLS) - Database-level security policies
- Real-time subscriptions - Live data updates across clients

### AI Integration
- Anthropic Claude 3 Haiku - Language model for recipe generation
- Custom API proxy - Secure backend integration for API key management

### Development Tools
- ESLint - Code quality and consistency
- Git - Version control
- npm - Package management

## Architecture and Database Migration

### Database Migration Achievement
Successfully migrated the entire application from Firebase/Firestore (NoSQL) to Supabase (PostgreSQL), including:

#### Migration Highlights
- **Schema Design**: Architected relational database schema from scratch based on Firebase's NoSQL document structure
- **Data Modeling**: Converted hierarchical Firebase collections to normalized PostgreSQL tables
- **Authentication Migration**: Transitioned from Firebase Auth to Supabase Auth
- **Security Implementation**: Implemented Row Level Security (RLS) policies for data protection

#### Database Schema
```
user_profiles
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key → auth.users)
├── username (TEXT)
├── email (TEXT)
└── timestamps

private_recipes
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key → auth.users)
├── title, ingredients, instructions
├── cuisine_type, cooking_time, difficulty
└── timestamps

public_recipes
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key → auth.users)
├── username, title, ingredients, instructions
├── likes_count (INTEGER)
└── timestamps

recipe_likes
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key → auth.users)
├── recipe_id (UUID, Foreign Key → public_recipes)
└── UNIQUE constraint on (user_id, recipe_id)

recipe_comments
├── id (UUID, Primary Key)
├── recipe_id (UUID, Foreign Key → public_recipes)
├── user_id (UUID, Foreign Key → auth.users)
├── username, comment
└── timestamp
```

#### Technical Improvements from Migration
- **Performance**: Faster queries with PostgreSQL indexing
- **Scalability**: Relational data model supports complex queries and joins
- **Security**: Database-level RLS policies versus application-level security
- **Real-time**: Built-in WebSocket support for live updates
- **Cost Efficiency**: Optimized database structure reduces redundant data

### Architecture Pattern
```
Frontend (React + Vite)
    |
    +-> Supabase Client (Direct Database Access)
    |   +-> Authentication
    |   +-> Database Queries (RLS Protected)
    |   +-> Real-time Subscriptions
    |
    +-> Express Backend (API Proxy)
        +-> Claude AI API (Secure Key Management)
```

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Anthropic API key

### Environment Variables
Create a `.env` file in the root directory:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-your-api-key-here

# Backend API URL (optional, defaults to http://localhost:3000/api)
VITE_API_URL=http://localhost:3000/api
```

### Installation Steps

```bash
# Clone the repository
git clone https://github.com/yourusername/ChefBot.git
cd ChefBot

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Set up environment variables
# For client: create client/.env with Supabase credentials
# For server: create server/.env with ANTHROPIC_API_KEY

# Run database migrations
# Execute SQL commands from docs/SUPABASE_SETUP.md in Supabase SQL Editor

# Start development server (frontend)
cd ../client
npm run dev          # Frontend (http://localhost:5173)

# In a separate terminal, start backend
cd ../server
npm run start        # Backend API (http://localhost:3000)
```

### Database Setup
1. Create a Supabase project at supabase.com
2. Navigate to SQL Editor in your Supabase dashboard
3. Execute all SQL commands from docs/SUPABASE_SETUP.md to create:
   - Tables with proper relationships
   - Row Level Security policies
   - Database triggers and functions
   - Indexes for optimized queries

## Project Structure

```
ChefBot/
|- .github/                  # GitHub workflows
|- client/                  # React frontend (Vite)
|  |- src/
|  |  |- components/       # React components
|  |  |- lib/              # Supabase client
|  |  |- utils/            # API utilities
|  |- package.json
|- server/                  # Express backend
|  |- routes/              # API routes
|  |- services/            # Claude API service
|  |- server.js           # Express server
|  |- package.json
|- docs/                   # Documentation
|- netlify.toml            # Netlify configuration
|- nixpacks.toml           # Nixpacks configuration
|- railway.json            # Railway configuration
```



## API Integration

### Claude AI Integration
- **Endpoint**: `/api/recipes` (POST)
- **Functionality**: Proxies requests to Anthropic's Claude API
- **Model**: Claude 3 Haiku (claude-3-haiku-20240307)
- **Security**: API keys stored server-side, never exposed to client
- **Error Handling**: Comprehensive error responses with fallback mechanisms

### Supabase Integration
- **Direct Client Access**: Frontend communicates directly with Supabase
- **Real-time Features**: WebSocket connections for live updates
- **Optimistic Updates**: Immediate UI feedback with automatic rollback on errors
- **Query Optimization**: Efficient joins and indexed queries

## Security and Authentication

### Authentication Features
- Email/password authentication via Supabase Auth
- Secure session management with JWT tokens
- Custom username support with profile creation
- Guest access for non-authenticated users

### Security Measures
- **Row Level Security (RLS)**: Database-level access control
- **API Key Protection**: Backend proxy prevents client-side API key exposure
- **CORS Configuration**: Controlled cross-origin access with regex validation
- **Input Validation**: Client and server-side validation with sanitization
- **SQL Injection Prevention**: Parameterized queries via Supabase client
- **Rate Limiting**: 20 requests per 15 minutes to prevent API abuse
- **Request Timeout**: 30-second timeout on AI API calls

### RLS Policies
- Users can only read/write their own private recipes
- Public recipes readable by all, modifiable only by owners
- Likes and comments protected by user authentication
- Profile data accessible only to the owner

## Developer

**Bonny Makaniankhondo**

LinkedIn: https://www.linkedin.com/in/bonny-makaniankhondo-bb95a3321/

### Technical Achievements
- Architected and executed complete database migration from Firebase NoSQL to Supabase PostgreSQL
- Designed relational database schema with proper normalization and indexing
- Implemented Row Level Security policies for multi-tenant data isolation
- Integrated AI API with secure backend proxy architecture
- Built responsive, mobile-first UI with modern React patterns
- Developed real-time features with optimistic UI updates

### Skills Demonstrated
- **Frontend**: React, JavaScript ES6+, Tailwind CSS, Vite
- **Backend**: Node.js, Express, RESTful API design
- **Database**: PostgreSQL, SQL, Database schema design, Data migration
- **Cloud Services**: Supabase, Firebase (migration experience)
- **AI Integration**: Anthropic Claude API, API proxy patterns
- **Security**: Authentication, Authorization, RLS, API key management
- **DevOps**: Environment configuration, Git version control

---

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Anthropic for Claude AI API
- Supabase for database and authentication infrastructure
- React and Vite communities for excellent documentation

---

**Built by Bonny Makaniankhondo**
