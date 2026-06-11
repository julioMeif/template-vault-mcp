#!/usr/bin/env node
/**
 * Template Vault MCP adapter.
 *
 * Thin wrapper around mcp-remote that connects Claude Desktop, Cursor,
 * Windsurf, or any other stdio-MCP-speaking client to the hosted
 * Template Vault MCP server at https://www.the-template-vault.com/api/mcp.
 *
 * Auth is OAuth 2.1 + PKCE — mcp-remote handles the browser-based
 * authorize flow and stores the refresh token locally per the
 * MCP spec.
 *
 * No credentials live in this repo. The OAuth secret lives only in
 * mcp-remote's per-user token cache (see its docs for the location).
 *
 * Usage in claude_desktop_config.json:
 *
 *   "template-vault": {
 *     "command": "npx",
 *     "args": ["-y", "template-vault-mcp"]
 *   }
 *
 * Or directly without this wrapper (equivalent):
 *
 *   "template-vault": {
 *     "command": "npx",
 *     "args": ["-y", "mcp-remote", "https://www.the-template-vault.com/api/mcp"]
 *   }
 */

import { spawn } from "node:child_process";

const ENDPOINT =
  process.env.TEMPLATE_VAULT_MCP_URL ||
  "https://www.the-template-vault.com/api/mcp";

// Windows: `npx` is `npx.cmd`; node:child_process.spawn doesn't resolve
// `.cmd` extensions on its own and errors with ENOENT. Route through the
// system shell (cmd.exe on Windows, /bin/sh elsewhere) so the OS handles
// extension lookup + PATHEXT. Safe here because we control every arg —
// no untrusted input gets concatenated into the command string.
const child = spawn(
  "npx",
  ["-y", "mcp-remote", ENDPOINT, ...process.argv.slice(2)],
  { stdio: "inherit", shell: true }
);

child.on("exit", (code) => process.exit(code ?? 0));
child.on("error", (err) => {
  console.error("[template-vault-mcp] failed to spawn mcp-remote:", err.message);
  process.exit(1);
});
