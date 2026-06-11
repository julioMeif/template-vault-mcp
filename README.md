# Template Vault MCP

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Connect Claude Desktop, ChatGPT, Cursor, Windsurf — or any MCP-speaking AI client — to **[Template Vault](https://www.the-template-vault.com)**, an AI website builder for small businesses.

## What it does

This package is the thin client-side adapter for the [Template Vault MCP server](https://www.the-template-vault.com/api/mcp). It bridges stdio-based MCP clients (Claude Desktop, Cursor) to our hosted HTTP+OAuth server.

Once connected, your AI can:

| Tool | Purpose |
| --- | --- |
| `discover_business_needs` | Interview the user about their business with niche-tailored follow-ups (always called first). |
| `list_personalities` | List the visual styles (classic, minimal, gradient, zen, immersive, glass). |
| `generate_site` | Generate a full website from a populated business profile. Returns a job id. |
| `get_generation_status` | Poll the build status (`pending` → `processing` → `completed`). |
| `list_user_sites` | List the user's existing sites. |
| `publish_site` | Deploy a site to production at `slug.the-template-vault.com`. |

End-to-end, a one-page Spanish-and-English bilingual site for a Miami pool builder takes ~60 seconds from "build me a website" to a real running URL.

## Install

### Claude Desktop

Open your `claude_desktop_config.json` (Settings → Developer → Edit Config) and add:

```json
{
  "mcpServers": {
    "template-vault": {
      "command": "npx",
      "args": ["-y", "template-vault-mcp"]
    }
  }
}
```

Restart Claude Desktop. The first time you ask it to use a Template Vault tool, your browser will open for OAuth — log in (or sign up) at the-template-vault.com, click Allow, done.

### Claude.ai (web)

Claude.ai speaks HTTP MCP natively — you don't need this adapter. Just add a custom connector:

1. Settings → Connectors → Add custom connector
2. URL: `https://www.the-template-vault.com/api/mcp`
3. Click Connect → OAuth flow → Allow

### Cursor

In `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "template-vault": {
      "command": "npx",
      "args": ["-y", "template-vault-mcp"]
    }
  }
}
```

### ChatGPT (Developer Mode)

OpenAI's MCP support uses an HTTP endpoint directly. Add the connector URL `https://www.the-template-vault.com/api/mcp` in ChatGPT's developer settings.

## Auth & data

- **OAuth 2.1 + PKCE** with refresh tokens — authorize once, stay connected for 90 days.
- **No credentials are stored in this repo.** Tokens live in `mcp-remote`'s per-user cache (`~/.mcp-remote-auth/` by default).
- **Quota** — each `generate_site` call counts against your monthly Template Vault plan (5 free / month on the free tier).
- **Per-user isolation** — your AI can only see and act on YOUR sites.

## Pricing

- **Free** — 1 site, 5 generations/month
- **Pro** — $15/mo, 5 sites, 25 generations, custom domains
- **Business / Agency** — for multi-site / agency use

See [pricing](https://www.the-template-vault.com/pricing).

## Content policy

We decline generation requests for content categories listed in [CONTENT_POLICY.md](CONTENT_POLICY.md) — including adult content, hate speech, scams, illegal goods, CSAM, and impersonation/phishing sites. Requests that match these categories return an explicit error message rather than silently generating.

The Template Vault generator itself (Anthropic Sonnet) applies its own content safety on top — so a borderline request that gets past our pre-filter will typically be refused by the model. Multiple layers, defense in depth.

## How it works

```
┌──────────────────────┐         stdio        ┌─────────────────────────┐
│  Claude Desktop /    │ ─────────────────▶  │ template-vault-mcp     │
│  Cursor / Windsurf   │ ◀───────────────── │ (this package)          │
└──────────────────────┘                     └────────────┬────────────┘
                                                          │ HTTPS + OAuth
                                                          ▼
                                             ┌─────────────────────────┐
                                             │  Template Vault         │
                                             │  api/mcp (hosted)       │
                                             └────────────┬────────────┘
                                                          │
                                                          ▼
                                                Site generation
                                                + Vercel deploy
```

The adapter has no business logic — it forwards stdio messages to the hosted MCP server and forwards responses back. All tool descriptions, schemas, and workflows live server-side; you always get the latest version without updating the package.

## Open source

MIT licensed. The platform itself (the generator, the editor, the deployer) is closed source; this adapter is the open-source layer customers and contributors can inspect, fork, and build on.

PRs welcome for the adapter — bug fixes, additional client integrations, Docker improvements. Tool changes happen server-side; for those, [open an issue](https://github.com/julioMeif/template-vault-mcp/issues) or contact us at [contact@the-template-vault.com](mailto:contact@the-template-vault.com).

## Links

- 🌐 [Homepage](https://www.the-template-vault.com)
- 📚 [MCP docs](https://www.the-template-vault.com/docs/mcp)
- 🔍 [vs Wix / Squarespace / Framer / Webflow](https://www.the-template-vault.com/vs/wix)
- 🛡️ [Content policy](CONTENT_POLICY.md)
- 📜 [License](LICENSE)