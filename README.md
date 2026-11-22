# PollyGlot 🦜

**Perfect Translation Every Time:** a small AI-powered translation app. Enter a text, pick a language, and PollyGlot translates it for you.

This is a solo project from the [AI Engineer Path](https://scrimba.com/ai-engineer-path-c02v) at [Scrimba](https://scrimba.com).

<p align="center">
  <img src="assets/screenshot.png" alt="PollyGlot: input view on the left, result view on the right" width="600">
</p>

## How it works

1. Type the text you want to translate.
2. Choose a target language: **French 🇫🇷**, **Spanish 🇪🇸** or **Japanese 🇯🇵**.
3. Click **Translate**. PollyGlot shows the original text and the translation.
4. Click **Start Over** to translate something new.

## Architecture

The OpenAI API key never reaches the browser. The frontend only sends the text and the target language to a small Express server, which builds the prompt and calls OpenAI:

```
Browser ──POST /api/translate──► Vite dev server ──proxy──► Express server ──► OpenAI
        ◄─────────── { translation } or { error } ───────────┘   (holds the API key)
```

## Features

- **AI translation** with the OpenAI Responses API
- **Backend for the API key:** the key stays on the Express server; the frontend uses plain `fetch`
- **Prompt injection protection:** the text is wrapped in `<text>` tags, so input like *"Ignore all previous instructions…"* gets translated instead of followed. The prompt is built on the server, so the API can only be used for translations.
- **Validation on both sides:** the browser catches empty input, and the server checks every request (text present, a non-empty string, one of the three supported languages)
- **Consistent error handling:** every error response has the same `{ error }` format. The frontend shows the server's message and falls back to a generic message for network problems.
- **Three views** (input, result, error) that switch without a page reload
- **Loading state:** while the request runs, the button shows "Translating..." and is disabled
- **Try again** keeps your text after an error
- **Responsive layout:** full screen on mobile, centered card on desktop

## Tech stack

- **Frontend:** HTML, CSS and vanilla JavaScript (ES modules), [Vite](https://vite.dev/) as dev server, proxy and build tool
- **Backend:** [Node.js](https://nodejs.org/) with [Express 5](https://expressjs.com/)
- **AI:** [OpenAI](https://platform.openai.com/) API via the official `openai` npm package
- **Fonts:** [Poppins](https://fonts.google.com/specimen/Poppins) and [Saira Condensed](https://fonts.google.com/specimen/Saira+Condensed) from Google Fonts

## Getting started

You need a recent Node.js version (developed with Node.js 24), because the server uses Node's built-in `--env-file` and `--watch` flags.

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with your OpenAI API key and the model you want to use:

   ```bash
   OPENAI_API_KEY=your-openai-api-key
   AI_MODEL=your-model-name
   ```

3. Start the API server in one terminal:

   ```bash
   npm run api
   ```

4. Start the frontend in a second terminal and open the URL that Vite prints (by default http://localhost:5173):

   ```bash
   npm start
   ```

| Command           | What it does                                                         |
| ----------------- | -------------------------------------------------------------------- |
| `npm run api`     | Starts the Express server on port 3000 and restarts it on changes   |
| `npm start`       | Starts the Vite dev server and forwards `/api` requests to port 3000 |
| `npm run build`   | Builds the frontend into `dist/`                                     |
| `npm run preview` | Serves the frontend build locally                                    |

> [!NOTE]
> The `/api` proxy only exists in the Vite dev server. The project is set up for local development. Deploying it would need the built frontend and the API to be served together, for example by having Express serve `dist/`.

### Troubleshooting

**`invalid_api_key` even though the key in `.env` is correct:** check whether `OPENAI_API_KEY` is also set in your shell (for example in `~/.zshrc`). Node's `--env-file` does not override variables that already exist in the environment, so an old key in the shell wins over the one in `.env`.

## API

### `POST /api/translate`

**Request**

```json
{ "text": "How are you?", "language": "French" }
```

`language` must be `French`, `Spanish` or `Japanese`.

**Response `200`**

```json
{ "translation": "Comment allez-vous ?" }
```

**Errors**

| Status | When                                                                   | Example body                                          |
| ------ | ---------------------------------------------------------------------- | ----------------------------------------------------- |
| `400`  | Missing or invalid JSON, missing/empty `text`, unsupported `language`  | `{ "error": "Unknown language!" }`                    |
| `500`  | Anything else, for example the OpenAI request fails                   | `{ "error": "Something went wrong on the server." }`  |

You can test the API without the frontend:

```bash
curl -i -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","language":"French"}'
```

## Project structure

```
PollyGlot/
├── assets/          # parrot logo, world map, flags, screenshot
├── server/
│   └── api.js       # Express server: validation, prompt, OpenAI request, error handling
├── index.html       # markup for the input, result and error views
├── index.css        # styles
├── index.js         # frontend logic: form, fetch to /api/translate, view switching
├── vite.config.js   # dev server proxy for /api
├── .env             # your API key and model (not committed)
└── package.json
```

## Credits

Scrimba provided the project brief, the design and the assets (parrot, world map, flags) as part of the AI Engineer Path.
