# cardparty

A minimal, animated, mobile-first web app for card-based drinking games. Plain HTML/CSS/JS — no build step, no dependencies.

**Games included:** King's Cup, Ride the Bus (3 phases: questions, pyramid, the bus), Higher/Lower, Red or Black, Fuck the Dealer, Ace/King/Queen/Jack, Most Likely To, Party Prompts (categories, rhymes, question master, thumb master), Mix Mode, plus a full bilingual (DE/EN) rules reference.

## Run locally

No build tools needed — just serve the folder:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:8080` (or the printed URL) on your phone or desktop.

## Deploy your own copy to Vercel via GitHub

1. **Create a GitHub repo**
   ```bash
   cd cardparty
   git init
   git add .
   git commit -m "Initial commit"
   ```
   Create a new empty repo on [github.com/new](https://github.com/new) (no README/license), then:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```

2. **Import into Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your GitHub repo
   - Framework preset: **Other** (it's a static site — no build command, no output directory needed)
   - Click **Deploy**

3. Every future `git push` to `main` will automatically redeploy.

## Install as an app on iPhone (PWA)

1. Open the deployed URL in **Safari** (must be Safari, not Chrome, for the install step).
2. Tap the **Share** icon → **Add to Home Screen** → **Add**.
3. It now launches full-screen from the home screen, no browser bar, and the core app shell is cached for offline use.

The app already ships with `manifest.webmanifest`, `service-worker.js`, and the required Apple meta tags — nothing else to configure.

**Icon note:** the current home-screen icon (`icon.svg`) is an SVG. iOS technically wants a PNG for `apple-touch-icon` — Safari usually still installs fine and falls back to a page screenshot if it can't rasterize it, but for a crisp icon, convert `icon.svg` to a 180×180 (or 512×512) PNG (e.g. with [cloudconvert.com](https://cloudconvert.com) or any image editor), name it `apple-touch-icon.png`, drop it in the project root, and add:
```html
<link rel="apple-touch-icon" href="apple-touch-icon.png">
```
above the existing SVG icon line in `index.html`. Happy to generate that PNG for you directly next time my sandbox environment is available.

## Project structure

```
index.html            entry point, screen markup
style.css             all styling & animations
data.js               rules text, prompts, translations (DE/EN)
app.js                game logic & UI rendering
manifest.webmanifest  PWA manifest (name, icons, colors)
service-worker.js     offline caching of the app shell
icon.svg              app icon / home-screen icon
```

## Notes

- Player names and drink counts are stored in the browser via `localStorage` — private to each device.
- Play responsibly — every mode works fine with non-alcoholic drinks too.
