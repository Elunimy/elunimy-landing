# elunimy-landing

Pre-launch landing page + email waitlist for **Elunimy**, served at
`https://join.elunimy.com` via GitHub Pages (same setup as `elunimy-legal`).

Static, no build step. Emails are stored in the project's own Supabase
(`waitlist` table) — no third-party form service.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The page (structure + all styles inline). |
| `config.js` | Public Supabase URL + publishable key. Safe to commit (insert-only key). |
| `app.js` | Form validation + submit to Supabase. |
| `favicon.svg` | Placeholder "E" mark — replace with the real logo later. |
| `CNAME` | `join.elunimy.com` (GitHub Pages custom domain). |
| `robots.txt`, `sitemap.xml` | SEO basics. |

## One-time setup

### 1. Create the database table (once)

The `waitlist` table must exist in Supabase before the form can store emails.
The migration lives in the app repo: `supabase/migrations_manual/2026-06-20_waitlist.sql`.

Run it either way:

- **Supabase Dashboard** → SQL Editor → paste the file's contents → Run. **(easiest)**
- **CLI:** `supabase db query --linked < supabase/migrations_manual/2026-06-20_waitlist.sql`

### 2. Publish to GitHub Pages

```bash
cd elunimy-landing
git init
git add .
git commit -m "Elunimy waitlist landing page"
git branch -M main
git remote add origin https://github.com/Elunimy/elunimy-landing.git   # create this repo on GitHub first
git push -u origin main
```

Then on GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / root**.
GitHub reads the `CNAME` file and serves the site at `join.elunimy.com`.

### 3. Point the subdomain at GitHub Pages (DNS)

At your domain registrar for `elunimy.com`, add a **CNAME record**:

```
Host/Name:  join
Type:       CNAME
Value:      elunimy.github.io
```

(Same pattern as `legal` → GitHub Pages.) DNS + HTTPS cert can take up to ~1h.
In GitHub Pages settings, tick **Enforce HTTPS** once the cert is issued.

## Reading the collected emails

Supabase Dashboard → Table Editor → `waitlist`, or export to CSV.
(The public key cannot read the table — only the dashboard / service role can.)

## To finish later (provisional bits)

- **Copy:** the eyebrow ("Private beta — coming soon"), button label, microcopy,
  and success text are placeholders — swap for final wording.
- **Screenshot:** replace the dark `.window` mock in `index.html` with a real
  product screenshot.
- **og-image.png:** add a 1200×630 PNG at the repo root for a rich link preview
  when shared on X.
- **Logo:** replace `favicon.svg` and the `Elunimy` wordmark once the logo exists.
