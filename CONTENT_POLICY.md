# Content Policy

Template Vault generates real, deployable websites. To keep the platform safe and useful for small-business owners, the `generate_site` tool **declines** requests in the categories below. Both the MCP server's pre-filter and the underlying Anthropic Sonnet model apply this policy.

## Prohibited categories

Requests obviously matching any of the following are rejected at the `generate_site` boundary with an `invalid_request` error pointing to this policy:

- **Adult / sexual content** — pornography, escort services, sexual webcam services, fetish marketplaces. Mainstream adult-adjacent businesses (dating apps, swimwear retailers, fertility clinics) are fine.
- **Hate speech & extremism** — white supremacist sites, neo-Nazi material, Holocaust denial, content advocating violence against protected groups.
- **Scams & financial fraud** — Ponzi / pyramid schemes, "get rich quick" sites with no real product, advance-fee fraud, fake-invoice / phishing landing pages.
- **Illegal goods & services** — sites selling controlled substances without authorization, unlicensed firearms, stolen goods, sites offering hacking-for-hire.
- **Child safety** — any content sexualizing minors (CSAM), grooming materials, sites designed to harm children.
- **Impersonation / phishing** — sites pretending to be a different brand, government, bank, or person without authorization.
- **Targeted harassment** — sites built to harass a named individual or organization.

## How rejections work

When the pre-filter matches a prohibited category, the tool returns:

```
Template Vault declines to generate websites for businesses in this category.
The request matched: <category>
See https://www.the-template-vault.com/docs/mcp/content-policy
```

The calling agent (Claude / ChatGPT) should surface this message verbatim to the user.

## Defense in depth

Even when the pre-filter misses something (rare wording, euphemisms), the underlying Anthropic Sonnet model applies its own content safety. A request that passes the keyword filter but is still harmful will typically be refused by the model before any site is created.

## Reporting policy violations

If you've encountered a site generated through Template Vault that you believe violates this policy, please email [contact@the-template-vault.com](mailto:contact@the-template-vault.com) with the site URL. We act on reports within 1 business day.

## Appeals (false positives)

The keyword pre-filter can occasionally false-positive (e.g. a Holocaust memorial nonprofit, an addiction-recovery clinic, a sex-education educator). If you believe your legitimate business was incorrectly declined, contact us at the address above with a short description and we'll review manually.