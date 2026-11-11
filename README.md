# WeddingWebsite
A wedding website for those who are cheap like me.

Plain HTML/CSS/JS, hosted free on GitHub Pages.

## Editing the site
All the content lives in **`config.js`**. Open it on GitHub, click the pencil
icon, change the text between the quotes, and commit. The site redeploys in
about a minute. Blank fields are hidden or show "Coming soon"; set any
section's `show: false` to hide it.

Photos go in the `images/` folder (`images/hero.jpg` is the hero background).

## Files
- `index.html` – page structure
- `styles.css` – look and feel
- `config.js` – **your content**
- `app.js` – fills the page from `config.js`
- `.github/workflows/pages.yml` – deploys to GitHub Pages on every push to `main`

## Hosting (one-time setup)
1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Merge to `main` (or run the "Deploy site to GitHub Pages" workflow by hand).
3. The site will be at `https://<your-username>.github.io/WeddingWebsite/`.

## Preview locally
```
python3 -m http.server 8000
```
then open http://localhost:8000.
