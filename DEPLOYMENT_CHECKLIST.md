# 🚀 Deployment Checklist

## One-Time Setup (Already Done ✅)
- [x] TinaCMS configured with Cloud credentials
- [x] GitHub repository connected
- [x] Build script includes `tinacms build`

---

## Every Time You Deploy

1. **Build the site**
   ```bash
   npm run build
   ```
   This will:
   - Generate the Tina admin interface in `/dist/admin/`
   - Build the Astro site

2. **Deploy the `dist` folder** to your hosting provider

3. **Verify the admin works**
   - Go to: https://jeanmarcfavre.com/admin/index.html
   - Make sure you can log in

4. **Tell your dad**
   - He can now go to: https://jeanmarcfavre.com/admin/index.html
   - No installation needed
   - Just login with GitHub and start posting!

---

## What Your Dad Sees

1. Opens browser → goes to `https://jeanmarcfavre.com/admin/index.html`
2. Clicks "Login" → authenticates with GitHub
3. Creates/edits blog posts
4. Clicks "Save" → automatically committed to GitHub
5. Site rebuilds automatically (if you have CI/CD set up)

**That's it!** No command line, no npm, no dev servers for him. 🎉

---

## Important Notes

- The admin interface is **static HTML/JS** deployed with your site
- Tina Cloud handles the API/backend (authentication, file operations)
- All changes are saved directly to GitHub
- Your dad never needs to run any commands locally

