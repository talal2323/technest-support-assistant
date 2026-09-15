# TechNest Support Assistant

A full-stack customer support assistant for an electronics retailer. It demonstrates a deliberately simple retrieval-augmented generation flow: the API ranks matching MongoDB knowledge entries, passes the top five into a constrained system prompt via Groq's API, and stores every exchange for admin review.

## Project layout

- `backend` - Express, Mongoose, Groq, JWT-protected admin API
- `frontend` - Next.js customer chat and admin panel

## Setup

1. Install Node.js 20+ and run MongoDB locally, or provide a hosted MongoDB URI.
2. In `backend`, copy `.env.example` to `.env` and fill in `MONGODB_URI`, `GROQ_API_KEY`, and `JWT_SECRET`. The backend uses Groq's OpenAI-compatible Chat Completions endpoint.
3. Install and seed the API:

   ```bash
   cd backend
   npm install
   npm run seed
   npm run dev
   ```

4. In `frontend`, install dependencies and start Next.js:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The customer experience runs at `http://localhost:3000`. The API runs at `http://localhost:4000`.

## Retrieval approach

Incoming messages are tokenized, stop words are removed, and MongoDB candidates are found by case-insensitive matching against questions, answers, and tags. Candidates are scored with extra weight for tag matches and the five strongest entries are injected into the system prompt. With no relevant context, the API returns a fixed escalation response rather than calling the model, which prevents unsupported store claims.

## Admin access

Use the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values from the backend `.env` on the admin login screen. Admins can create, edit, and delete FAQ entries and review recent conversation sessions.

## API smoke test

```bash
curl http://localhost:4000/api/health
curl -X POST http://localhost:4000/api/chat -H "Content-Type: application/json" -d "{\"message\":\"How long is standard shipping?\",\"sessionId\":\"demo-session\"}"
```
