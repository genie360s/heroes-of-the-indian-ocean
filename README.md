# Heroes of Indian Ocean

A premium documentary website for the **Heroes of Indian Ocean** film by Alex G. Mkwizu / SEEDE XR — showcasing the untold story of Tanzania's marine ecosystem defenders through immersive VR 360° and Augmented Reality storytelling.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API) |
| Build tool | Vite 7 |
| Animations | GSAP 3 + ScrollTrigger |
| Email | Nodemailer (Gmail SMTP) |
| Deployment | Vercel (static + serverless) |

---

## Project Structure

```
heroes-of-indian-ocean/
├── api/
│   └── send-email.js        # Vercel serverless function (email handler)
├── src/
│   ├── assets/
│   │   └── images/          # Hero images, partner logos
│   ├── components/
│   │   ├── HeroSection.vue    # Full-screen hero with particle canvas
│   │   ├── StorySection.vue   # Scroll-animated story with particle images
│   │   ├── PartnersSection.vue
│   │   ├── ActionSection.vue  # CTA with modal triggers
│   │   ├── ContactModal.vue   # Pop-up forms (documentary / series)
│   │   └── ParticleImage.vue  # Canvas particle image renderer
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── public/
├── .env                     # Local secrets (never commit)
├── .env.example             # Template for env vars
├── index.html
├── vite.config.js
└── package.json
```

---

## Features

- **Scroll animations** — GSAP ScrollTrigger parallax, word-by-word text reveals, staggered partner logos, animated stat counter (0 → 54%), and scrub-based parallax on the hero
- **Particle canvas backgrounds** — interactive particle images for coral reef and diver scenes with mouse repulsion
- **Ocean wave canvas** — animated layered waves in the story section
- **Contact modals** — two fully validated pop-up forms triggered from the action section:
  - *Request Documentary* — captures screening requests
  - *Contribute to Next Series* — captures contribution interest
  - Both send formatted HTML emails to `a.mkwizu@seedexr.com`
- **Email notifications** — Nodemailer + Gmail SMTP via Vercel serverless function
- **Mobile-first** — responsive at all breakpoints, reduced particle count on mobile, touch-friendly modal overlay

---

## Local Development

### 1. Clone and install

```bash
git clone <repo-url>
cd heroes-of-indian-ocean
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
GMAIL_USER=a.mkwizu@seedexr.com
GMAIL_APP_PASSWORD=your_gmail_app_password_here
RECIPIENT_EMAIL=a.mkwizu@seedexr.com
```

> **Note:** The email API only works when deployed to Vercel (no local Node server). The full UI and animations run locally — only form submissions will fail until deployed.

### 3. Run the dev server

```bash
npm run dev
```

Open `http://localhost:5173`.

---

## Gmail App Password Setup

`a.mkwizu@seedexr.com` is a **Google Workspace** (business Gmail) account. Use an **App Password** — not your regular account password.

1. Sign in at [myaccount.google.com](https://myaccount.google.com)
2. Go to **Security → 2-Step Verification** — enable if not already on
3. Search for **App passwords** (`myaccount.google.com/apppasswords`)
4. Select app: **Mail** — device: **Other** → name it `Heroes of Indian Ocean Website`
5. Click **Generate** — copy the 16-character password
6. Use it as `GMAIL_APP_PASSWORD` in `.env` and in Vercel environment variables

> For Google Workspace accounts, App Passwords must be enabled by the Workspace admin: **Admin Console → Security → Less Secure App Access / App Passwords**.

---

## Vercel Deployment

### First deploy

1. **Push to GitHub** (`.env` is gitignored — never push it):

```bash
git add .
git commit -m "feat: scroll animations, modals, email API"
git push origin main
```

2. **Import in Vercel**
   - Visit [vercel.com/new](https://vercel.com/new) → Import your GitHub repo
   - Framework preset auto-detects as **Vite**
   - Leave defaults:
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Add environment variables** in **Vercel → Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `GMAIL_USER` | `a.mkwizu@seedexr.com` |
| `GMAIL_APP_PASSWORD` | *(16-char app password)* |
| `RECIPIENT_EMAIL` | `a.mkwizu@seedexr.com` |

   Set each for **Production**, **Preview**, and **Development** environments.

4. Click **Deploy**. Vercel builds Vite assets and deploys `api/send-email.js` as a Node.js serverless function automatically.

### Subsequent deployments

Every push to `main` triggers a redeployment. PRs get preview deployments automatically.

### Custom domain

**Vercel → Settings → Domains** → add your domain and follow the DNS records shown.

---

## Serverless Email Function

`api/send-email.js` becomes the endpoint **`POST /api/send-email`** on Vercel.

**Documentary request body:**
```json
{
  "formType": "documentary",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "organization": "Blue Ocean NGO",
  "country": "Tanzania",
  "purpose": "Community screening in Dar es Salaam"
}
```

**Series contribution body:**
```json
{
  "formType": "series",
  "name": "John Doe",
  "email": "john@example.com",
  "contributionType": "Financial Support",
  "amount": "500",
  "message": "Happy to sponsor episode 2"
}
```

Responses: `200 OK` on success · `400` for missing fields · `500` for mail errors.

---

## Adding Partner Logos

Drop images into `src/assets/images/partners/` (`.png`, `.jpg`, `.jpeg`, or `.svg`). They load automatically via Vite's `import.meta.glob`.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server (port 5173) |
| `npm run build` | Production build → `/dist` |
| `npm run preview` | Preview production build locally |

---

## Credits

**Producer / Director:** Alex G. Mkwizu  
**Production Company:** SEEDE XR  
**Contact:** a.mkwizu@seedexr.com
