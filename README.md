# Senafiy — Landing Page (Coming Soon)

A professional "Coming Soon" landing page for **senafiy.com**, designed for
deployment on **Google Sites** via Google Workspace.

---

## Contents

```
landing-page/
├── index.html              ← The main landing page (single-file, self-contained)
├── server.js               ← Optional backend server (node server.js) auto-saves to Excel
├── subscribers.csv         ← Excel/CSV file holding all subscribers (UTF-8 BOM)
├── google-sheets-sync.gs   ← Google Apps Script to auto-sync with Google Sheets/Drive
├── assets/
│   ├── favicon.svg         ← Senafiy mark with dark rounded background (for browser tab)
│   └── senafiy-wordmark.svg
├── robots.txt              ← SEO: crawler instructions
├── sitemap.xml             ← SEO: sitemap for search engines
└── README.md               ← This file
```

---

## Features

| Feature | Details |
|---|---|
| **SEO-optimised** | Title ("Senafiy - coming soon \| سنافي - قريباً"), meta description, keywords, Open Graph, Twitter Card, JSON-LD structured data, canonical URL, robots.txt, sitemap.xml |
| **Favicon** | SVG favicon with Senafiy mark on dark rounded-rect background; references for PNG fallbacks |
| **Countdown timer** | Live countdown to the launch date (1 January 2027) |
| **Visitor counter** | Animated counter displayed on the page; localStorage-based for the demo, replaceable with a server-side API |
| **Bilingual** | English default with one-click toggle to Arabic (RTL layout included) |
| **Notification form** | Email capture "Notify Me" form; stores in localStorage for demo; connect to Mailchimp/ConvertKit/Google Sheets in production |
| **Social links** | WhatsApp Business, LinkedIn, X, YouTube, TikTok, Snapchat — all with branded icons |
| **Responsive** | Mobile-first design, works on all screen sizes |
| **Animated** | Subtle grid background, floating particles, fade-in animations |
| **Brand-consistent** | Uses Senafiy's official colours (#144976, #8FB8DE, #5A707D, #B8C6CF) |

---

## Configuration

Open `index.html` and adjust:

1. **Launch date** — line with `const LAUNCH_DATE`:
   ```js
   const LAUNCH_DATE = new Date('2027-01-01T00:00:00+03:00');
   ```

2. **Social media URLs** — update the `href` values in the social links section
   if your handles differ from `senafiy`.

3. **OG Image** — create a 1200×630 image and update:
   ```html
   <meta property="og:image" content="https://senafiy.com/og-image.png">
   ```

---

## Deployment on Google Sites — Step by Step

### Prerequisites
- Google Workspace account with Google Sites access
- Domain `senafiy.com` configured in Google Workspace

### Method A: Embed as Full-Page HTML (Recommended)

Google Sites does not allow uploading raw HTML files directly, but you can
embed your page using an **Embed** block:

#### Step 1: Host the HTML file

Since Google Sites needs a URL to embed, first host `index.html` on one of
these free options:

| Option | How |
|---|---|
| **GitHub Pages** (recommended) | Push the `landing-page/` folder to a public GitHub repo → Settings → Pages → deploy from `main` branch. You get `https://<user>.github.io/<repo>/` |
| **Google Drive** | Upload `index.html` to Drive → Share as "Anyone with the link" → use [DriveToWeb](https://drv.tw/) to get a direct URL |
| **Firebase Hosting** (free tier) | `firebase init hosting` → deploy → get a `*.web.app` URL |
| **Cloudflare Pages** | Connect your repo → automatic deploys |

**Recommended: GitHub Pages**

```bash
# From c:\dev
cd landing-page
git init
git add .
git commit -m "Senafiy landing page — coming soon"
git remote add origin https://github.com/Senafiy/senafiy-landing.git
git push -u origin main
```

Then in the GitHub repo:
1. Go to **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main`, folder: `/ (root)`
4. Save — your page will be at `https://Senafiy.github.io/senafiy-landing/`

#### Step 2: Create the Google Site

1. Go to [sites.google.com](https://sites.google.com)
2. Click **+ Blank site** (or choose a template)
3. Name it **Senafiy — Coming Soon**

#### Step 3: Add the Embed

1. In the Google Sites editor, click **Insert → Embed**
2. Choose **By URL**
3. Paste your hosted URL (e.g., `https://Senafiy.github.io/senafiy-landing/`)
4. Click **Insert**
5. **Resize the embed** to fill the entire page:
   - Drag the corners to make it as large as possible
   - Click the embed → three dots → **Full width**

#### Step 4: Clean up the Google Site

1. **Remove the header**: Right-click the site header → **Header type → None**
2. **Remove the title**: Click the title and delete it, or set to invisible
3. **Remove the footer**: Go to site settings → toggle off footer
4. **Background**: Set to a dark colour (#0F172A) to match the embed background

#### Step 5: Connect your domain

1. In Google Sites, click **⚙ Settings → Custom domains**
2. Click **Start setup**
3. Enter `senafiy.com` (or `www.senafiy.com`)
4. Google will provide DNS records (CNAME)
5. In your domain registrar (where you bought senafiy.com):
   - Add a **CNAME** record: `www` → `ghs.googlehosted.com`
   - For root domain (`senafiy.com`), add the A records Google provides,
     or set up a redirect from root to `www.senafiy.com`
6. Wait for DNS propagation (up to 48 hours, usually faster)

#### Step 6: Publish

1. Click **Publish** (top right)
2. Set the web address
3. Under **Custom domain**, select `senafiy.com`
4. Click **Publish**

---

### Method B: Direct Google Sites (No Code)

If you prefer building natively in Google Sites without code:

1. **Create a new Google Site**
2. **Set the background** to dark (#0F172A)
3. **Add a logo**: Insert → Image → upload `assets/favicon.svg`
4. **Add heading**: "Operations, Without the Main Contractor"
   - Set the font to a clean sans-serif, colour #8FB8DE
5. **Add body text**: The subtitle from our page
6. **Add social links**: Insert → Button → link to each social profile
7. **Add sections**: Create cards for each feature

However, this method lacks the countdown timer, visitor counter, animations,
and the bilingual toggle. **Method A is strongly recommended.**

---

### Method C: Redirect senafiy.com to GitHub Pages

If Google Sites embedding is too restrictive:

1. Deploy to GitHub Pages (see Step 1 above)
2. In your domain registrar, set:
   - CNAME: `www` → `Senafiy.github.io`
   - A records for root domain:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
3. In the GitHub repo, create a file `CNAME` containing:
   ```
   senafiy.com
   ```
4. GitHub will issue a free SSL certificate automatically

---

## Favicon Setup

The SVG favicon works in modern browsers. For full compatibility:

1. Use a tool like [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Upload `assets/favicon.svg`
3. Download the generated package (includes PNG sizes, apple-touch-icon, etc.)
4. Place the files in `assets/` and update the `<link>` tags in `index.html`

---

## Visitor Counter — Production Options

The current counter uses `localStorage` (client-side only, per-browser).
For a real visitor counter visible to all:

| Service | How |
|---|---|
| **CountAPI** | Free, no signup: `https://api.countapi.xyz/hit/senafiy.com/visits` |
| **Google Analytics** | Add GA4 tag and display from the dashboard |
| **Umami** (your own) | You already have Umami in the stack — query its API |
| **Simple backend** | A tiny API on your server that increments a counter in PostgreSQL |

---

## SEO Checklist

- [x] `<title>` tag with brand + keywords
- [x] `<meta name="description">` — compelling summary under 160 chars
- [x] `<meta name="keywords">` — English and Arabic terms
- [x] Open Graph tags (og:title, og:description, og:image, og:url)
- [x] Twitter Card tags
- [x] JSON-LD structured data (Organization)
- [x] `<link rel="canonical">`
- [x] `robots.txt` — Allow all
- [x] `sitemap.xml`
- [x] Semantic HTML (`<nav>`, `<main>`, `<section>`, `<footer>`)
- [x] `aria-label` attributes for accessibility
- [x] `alt` text on images
- [x] Mobile responsive (viewport meta + CSS)
- [x] Fast loading (single file, no external JS, minimal CSS)
- [ ] Create and upload OG image (1200×630)
- [ ] Generate PNG favicons for older browsers
- [ ] Submit sitemap to Google Search Console

---

## Email Collection — Production Setup

To actually collect emails from the "Notify Me" form:

### Option 1: Google Sheets (free, simple)

1. Create a Google Sheet
2. Go to Extensions → Apps Script
3. Add this script:
   ```js
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const data = JSON.parse(e.postData.contents);
     sheet.appendRow([new Date(), data.email]);
     return ContentService.createTextOutput(
       JSON.stringify({ result: 'ok' })
     ).setMimeType(ContentService.MimeType.JSON);
   }
   ```
4. Deploy as Web App (Execute as: Me, Access: Anyone)
5. Update the `handleNotify()` function in `index.html`:
   ```js
   fetch('YOUR_APPS_SCRIPT_URL', {
     method: 'POST',
     body: JSON.stringify({ email }),
   });
   ```

### Option 2: Mailchimp / ConvertKit
Use their embedded form or API endpoint.

---

## License

Private — Senafiy internal use only.
