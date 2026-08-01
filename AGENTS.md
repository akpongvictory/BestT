# BestT AI Development Guidelines

## Project Name

BestT

## Project Description

BestT is an AI-powered personalized learning companion.

The platform allows students to upload learning materials, interact with an AI tutor, generate quizzes, and track learning progress.

---

# Development Philosophy

Build a production-quality application.

Prioritize:

- Clean architecture
- Maintainability
- Security
- Scalability
- Clear separation of concerns

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query


## Backend

- Node.js
- Express
- TypeScript
- Prisma ORM


## Database

- PostgreSQL


## AI

- OpenAI API
- Embeddings
- Retrieval-Augmented Generation (RAG)

---

# Coding Rules

- Use TypeScript.
- Write clean reusable components.
- Keep business logic away from controllers.
- Use services for application logic.
- Validate user input.
- Never expose API keys.
- Use environment variables.
- Follow existing architecture.
- Do not introduce unnecessary dependencies.

---

# AI Development Rules

AI features must be designed as modules.

Separate:

- prompts
- AI services
- tools
- retrieval logic
- database operations

Do not put AI logic directly inside controllers.

---

# Before Making Major Changes

Review:

/docs

Ask for clarification if requirements conflict.