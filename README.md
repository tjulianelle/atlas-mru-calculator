# Atlas MRU v2 Calculator

Browser-based revenue prediction tool for Atlas Real Estate's 3rd Party Property Management business. Predicts Atlas-keep MRU per door, contribution per unit, breakeven management fee, and lifetime contribution adjusted for retention probability.

Built off the trailing twelve months of Snowflake bill data, validated against 967 active 3rd Party residential properties. Mean absolute prediction error of 11.8 percent on a 40-property random back-test, with no systematic bias.

## What's New

- **MF Management Style toggle**: Standard (offsite, full revenue, full cost) or Onsite (lower fee, no leasing/renewal income, salary passthrough to owner)
- **RBP toggle**: Opt-in or Opt-out at the property level
- **Per-fee Atlas/Owner allocation matrix**: every resident-paid fee is individually toggleable to Atlas or Owner
- **Resident terminology**: replaces "tenant" throughout
- **Cost to Manage per Door**: a flat user-controlled input. Segmented cost-to-serve modeling is a separate workstream

## What's in the Repo

- `public/index.html` is the calculator. Single-file, self-contained HTML with embedded lookup tables. Can be opened directly in any browser without a server.
- `server.js` is a tiny Express server that adds basic auth password protection and serves the HTML.
- `package.json`, `railway.toml`, `.gitignore` are standard project plumbing.

## Local Development

```bash
npm install
cp .env.example .env
# Edit .env to set ATLAS_PASSWORD
npm start
```

Then open http://localhost:3000 in your browser. You will be prompted for the username and password set in your `.env` file.

## Deploying to Railway

1. Push this repo to GitHub.
2. Create a new Railway project and connect it to the GitHub repo.
3. In the Railway service settings, add an environment variable: `ATLAS_PASSWORD` set to whatever password you want the team to use. Optionally set `ATLAS_USERNAME` (defaults to `atlas`).
4. Railway will detect Node, install dependencies, and start the server automatically. The `railway.toml` file in this repo configures the start command and health checks.
5. Generate a public domain in Railway's networking settings and share the URL.

## Updating the Calculator

The lookup tables are embedded in `public/index.html`. To refresh them with the latest Snowflake data, re-run the queries in the parent project's `mru_v2/queries.sql`, regenerate the `TENANT_FEE_LOOKUP`, `LEASING_EVENTS_LOOKUP`, and other tables, and replace the corresponding sections in `public/index.html`. Commit and push, and Railway will redeploy automatically.

## Security Notes

The basic auth setup is intentionally simple. It is suitable for an internal tool with shared credentials for the team. It is not suitable for handling sensitive customer data. Do not put deal-by-deal property names, owner names, or any PII into the calculator.

## Stack

- Node 18+
- Express 4
- express-basic-auth
- Static HTML with embedded JavaScript and CSS
- Chart.js loaded from CDN

## Cost

Railway's free tier covers this app comfortably (a few hundred MB of memory, near-zero CPU). Hobby plan at five dollars per month gives you a custom domain and longer-running services.
