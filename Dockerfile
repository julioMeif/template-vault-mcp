# Template Vault MCP — Glama-compatible Docker image.
#
# The image runs the thin stdio→HTTP adapter that connects an MCP client
# (Claude Desktop / Cursor / Windsurf / etc.) to Template Vault's hosted
# OAuth-authenticated MCP server at https://www.the-template-vault.com/api/mcp.
#
# Glama validates by spinning this container and confirming the server
# responds to introspection — which it does because the adapter forwards
# every request through to the hosted endpoint.
#
# No credentials are baked into the image. OAuth happens on first run
# inside the user's browser via mcp-remote's standard flow.

FROM node:20-alpine

WORKDIR /app

# Use lockfile-free install — the only runtime dep is mcp-remote.
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY bin ./bin
RUN chmod +x ./bin/template-vault-mcp.js

# stdio transport, no exposed ports.
ENTRYPOINT ["node", "/app/bin/template-vault-mcp.js"]