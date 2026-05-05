# AdAura — AI Ad Builder

Travel advertising SaaS powered by Claude (Anthropic).

## Architecture

### AI Layer
All LLM calls route through `src/api/claudeClient.js` via the Anthropic `/v1/messages` API using `claude-sonnet-4-20250514`.

| Function | Description |
|---|---|
| `generateAdVariants` | Generates 4 creative ad variants from brand + brief context |
| `analyzeAsset` | Vision analysis of uploaded images (tags, mood, quality flags) |
| `scrapeWebsite` | Extracts brand metadata and images from a URL |
| `invokeClaude` | Base API call — handles both remote URLs and `data:` base64 images |

Gemini is preserved for any future vision model routing but currently falls through to Claude.

### Data Persistence
No backend required. All entity data (`AdCampaign`, `AdVariant`, `Asset`, `BrandKit`, `ShareLink`) is stored in `localStorage` via a lightweight entity API in `claudeClient.js`.

### Compatibility Shim
`src/api/base44Client.js` re-exports `adaura as base44` — all 20+ existing component imports work unchanged.

## Setup

```bash
npm install
npm run dev
```

No environment variables needed. The Anthropic API key is handled by the Claude.ai runtime.

## Key Files

```
src/
  api/
    claudeClient.js   ← All AI + data logic (replaces base44 SDK)
    base44Client.js   ← Shim: export { adaura as base44 }
  lib/
    AuthContext.jsx   ← Stub auth (no login wall)
    app-params.js     ← Stub (no base44 app ID needed)
  pages/
    Create.jsx        ← Wizard flow calling generateAdVariants directly
```
