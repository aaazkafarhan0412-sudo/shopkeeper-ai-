# SHOPKEEPER AI

**Smarter khata. Simpler business.**

Marketing website for **Shopkeeper AI**, a simple digital khata and shop-management app for Pakistani shopkeepers. It replaces the paper notebook for customer credit (udhaar), payments, balances and WhatsApp reminders.

Built with **React 19 · Vite 7 · Tailwind CSS 4 · TypeScript**.

---

## ⚡ "Which `index.html` do I deploy?"

| File | What it is | Upload it on its own? |
| --- | --- | --- |
| `index.html` (project root) | Source template. It loads `/src/main.tsx` and needs a build step. | ❌ No, you'd get a blank white page |
| `dist/index.html` (created by `npm run build`) | **The finished website in one file.** All CSS and JavaScript are inlined (~435 KB, ~115 KB gzipped). | ✅ Yes |

You normally don't handle either file yourself. **Vercel and GitHub Actions run the build for you** on every push.

---

## 1 · Put the code on GitHub

**Option A: GitHub website (no tools needed)**

1. Go to **github.com/new**, name the repo e.g. `shopkeeper-ai`, and click **Create repository**.
2. Click **"uploading an existing file"**. Drag in **every file and folder except `node_modules` and `dist`**, then click **Commit changes**.
   - Make sure the hidden `.github` folder and `.gitignore` are included. On macOS Finder, press <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>.</kbd> to show hidden files.

**Option B: Terminal**

```bash
git init
git add .
git commit -m "Shopkeeper AI website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/shopkeeper-ai.git
git push -u origin main
```

---

## 2 · Deploy on Vercel (recommended)

1. Open **vercel.com/new** and sign in with GitHub.
2. Find `shopkeeper-ai` and click **Import**.
3. Settings are read from `vercel.json` automatically. Just click **Deploy**.
   - Framework: **Vite** · Build command: `npm run build` · Output directory: `dist`
4. In about a minute the site is live at an address like `https://shopkeeper-ai.vercel.app`.

From then on, **every push to `main` redeploys automatically**, and other branches and pull requests get their own preview links.
To add a custom domain (e.g. `shopkeeperai.pk`): **Project → Settings → Domains**.

> Prefer the command line? Run `npx vercel` for a preview, then `npx vercel --prod`.

---

## 3 · Deploy on GitHub Pages (optional)

1. In your repo: **Settings → Pages → Build and deployment → Source: `GitHub Actions`**.
2. Go to the **Actions** tab, open **Build & Deploy**, and click **Run workflow** (or just push any commit).
3. The site goes live at `https://YOUR-USERNAME.github.io/shopkeeper-ai/`.

No `base` path setting is needed, because the build is a single file with no external asset paths.
Until Pages is switched on, the workflow still builds the site and simply skips the deploy, so the run stays green ✅.

---

## 4 · Just want the single `index.html` file?

- **From GitHub (no install):** **Actions → latest "Build & Deploy" run → Artifacts → `index.html`**
- **On your computer:** `npm install && npm run build`. The file appears at `dist/index.html`.

Upload that one file to any static host, for example:
- a repo root with GitHub Pages set to *"Deploy from a branch"*
- Vercel with framework preset *"Other"*
- Netlify Drop
- cPanel `public_html`

Only the fonts load from Google Fonts. Everything else is inside the file.

---

## 📸 HD screenshots for your portfolio

The site has a built-in **media kit** that exports pixel-perfect HD images of every screen. They're rendered from the real components, not redrawn mockups.

1. Open **`/?screens`**, e.g. `https://your-project.vercel.app/?screens` or `http://localhost:5173/?screens`. There's also a **Media kit · HD screens** link in the footer.
2. Choose a resolution (**Recommended** = boards and desktop at 2×, phones at 3×) and PNG or JPG.
3. Click **Download** on any card, **Download set · ZIP** for a group, or **Download all · ZIP**.

| Set | Rendered at | Recommended export |
| --- | --- | --- |
| **Showcase boards (6):** cover, mobile app, web dashboard, customer profile + WhatsApp, design system, responsive | 1600 × 1200 | 3200 × 2400 px |
| **Device mockups (4):** phones on a transparent background | 360 × 700 | 1080 × 2100 px |
| **Website, desktop (11):** every section plus the full landing page | 1440 wide | 2880 px wide |
| **Website, mobile (4)** | 390 × 844 | 1170 × 2532 px (native iPhone) |

- Use **Chrome or Edge on a desktop** for the most reliable exports.
- Any single screen can be opened at full size with `/?shot=<id>`, e.g. `/?shot=board-dashboard` or `/?shot=device-customer`. The full list is in `src/shots/registry.ts`.
- Very long images (full pages) are automatically limited to safe browser canvas sizes.

## Run locally

Requires **Node.js 20.19+ or 22.12+** (see `.nvmrc`).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # → dist/index.html
npm run preview   # serve the production build locally
```

## Project structure

```
├── index.html                  # Vite entry template: title, meta tags, favicon, fonts
├── public/404.html             # Branded "page not found" (used by Vercel and GitHub Pages)
├── src/
│   ├── App.tsx                 # Page layout + shared "selected customer" state
│   ├── index.css               # Design tokens (colours, fonts, shadows) + animations
│   ├── lib/data.ts             # All copy & sample data: customers, FAQs, testimonials, Rs. formatting
│   ├── lib/hooks.ts            # Scroll-spy, reveal-on-scroll, count-up hooks
│   └── components/             # Navbar, Hero, Problem, Features, HowItWorks, Dashboard,
│                               # CustomerProfile, WhatsAppSection, Trust, FAQ, FinalCTA, Footer
├── vercel.json                 # Vercel build settings + security headers
└── .github/workflows/deploy.yml  # GitHub Pages deploy + downloadable index.html
```

## Customising

- **Colours & fonts:** the `@theme` block at the top of `src/index.css`
- **Text, names, amounts, FAQs, testimonials:** `src/lib/data.ts`
- **Browser title & link-preview text:** `index.html`

## Before you go live ✔

- [ ] Replace the sample contact details (email, phone, address, NTN) in `src/components/Footer.tsx`.
- [ ] Point **Get Started** / **Log In** at your real sign-up or app URLs.
- [ ] Add an `og:image` (1200 × 630, absolute `https://` URL) in `index.html` for rich WhatsApp and Facebook link previews.
- [ ] Connect your custom domain in Vercel.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Blank white page after deploying | You uploaded the root `index.html` without building. Deploy through Vercel or GitHub Actions, or upload `dist/index.html`. |
| Vercel: *"No package.json found"* or the build fails instantly | Your files are inside a sub-folder. In Vercel go to **Settings → General → Root Directory** and choose the folder that contains `package.json`. |
| `git push` rejected, mentioning `.github/workflows` | Your access token lacks the `workflow` scope. Push with GitHub Desktop or `gh auth login`, or delete the `.github` folder if you don't need GitHub Pages. |
| GitHub upload says *too many files* | You included `node_modules`. Leave it out, because Vercel installs dependencies itself. |
| Actions run shows *"GitHub Pages deploy skipped"* | Set **Settings → Pages → Source** to **GitHub Actions**, then re-run the workflow. |

---

© 2026 Shopkeeper AI · Designed and built in Pakistan for Pakistani shopkeepers.
