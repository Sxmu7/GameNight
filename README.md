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

## Project structure

```
index.html   entry point, screen markup
style.css    all styling & animations
data.js      rules text, prompts, translations (DE/EN)
app.js       game logic & UI rendering
```

## Notes

- Player names and drink counts are stored in the browser via `localStorage` — private to each device.
- Play responsibly — every mode works fine with non-alcoholic drinks too.
