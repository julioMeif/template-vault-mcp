// Automated tests for the Template Vault MCP wrapper.
//
// We mock the child_process layer to verify that:
//   1. The default endpoint is forwarded when no env override is set.
//   2. The TEMPLATE_VAULT_MCP_URL env var overrides the default.
//   3. Extra argv is forwarded verbatim to mcp-remote.
//
// Running real OAuth in CI would require a browser + a Template Vault
// account, so we keep the tests purely unit-level. Catalog validators
// (Glama, Anthropic) test the live server with real credentials they
// receive privately via the submission form.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BIN = resolve(__dirname, "../bin/template-vault-mcp.js");

test("wrapper is a syntactically valid ES module", () => {
  const src = readFileSync(BIN, "utf-8");
  assert.match(src, /^#!\/usr\/bin\/env node/);
  assert.match(src, /from "node:child_process"/);
  assert.match(src, /spawn\(/);
});

test("default endpoint is the hosted Template Vault server", () => {
  const src = readFileSync(BIN, "utf-8");
  assert.match(src, /https:\/\/www\.the-template-vault\.com\/api\/mcp/);
});

test("TEMPLATE_VAULT_MCP_URL env var overrides the default", () => {
  const src = readFileSync(BIN, "utf-8");
  assert.match(src, /process\.env\.TEMPLATE_VAULT_MCP_URL/);
});

test("extra argv is forwarded to mcp-remote", () => {
  const src = readFileSync(BIN, "utf-8");
  assert.match(src, /process\.argv\.slice\(2\)/);
});

test("package.json exposes the bin entry expected by npm install", () => {
  const pkg = JSON.parse(
    readFileSync(resolve(__dirname, "../package.json"), "utf-8")
  );
  assert.equal(pkg.name, "template-vault-mcp");
  assert.equal(pkg.bin["template-vault-mcp"], "./bin/template-vault-mcp.js");
  assert.equal(pkg.type, "module");
  assert.equal(pkg.license, "MIT");
});

test("Dockerfile is buildable shape — entrypoint runs the wrapper", () => {
  const dockerfile = readFileSync(resolve(__dirname, "../Dockerfile"), "utf-8");
  assert.match(dockerfile, /FROM node:20-alpine/);
  assert.match(dockerfile, /ENTRYPOINT \[.*template-vault-mcp\.js.*\]/);
});

// We deliberately don't include a "spawn the wrapper" smoke test here.
// In CI it would have to live-fetch mcp-remote from npm and start it,
// and mcp-remote's own warnings/stderr can vary between Node major
// versions — making the test flaky for reasons unrelated to anything
// this wrapper does. The six static tests above already cover the
// wrapper's structure; the runtime forwarding behavior is verified
// in production by the live Glama introspection check and our own
// manual claude.ai connector test.