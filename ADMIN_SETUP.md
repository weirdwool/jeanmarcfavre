# Custom Admin UI Setup Guide

## 🎯 Overview

This custom admin UI replaces TinaCMS with a simpler, more user-friendly interface. It works the same way as TinaCMS for automatic deployment:

1. **Your dad creates/edits posts** in the admin UI
2. **Changes are committed to GitHub** automatically
3. **CI/CD triggers** and rebuilds/deploys the site
4. **Site updates automatically** - no manual steps needed!

## 🚀 Setup Steps

### 1. Enable Hybrid Mode (Already Done ✅)

The site is now configured with `output: 'hybrid'` in `astro.config.mjs`. This allows:
- Static pages to be pre-rendered (fast!)
- API routes to run server-side (for GitHub commits)

### 2. Set Up GitHub Token

For automatic commits to work, you need a GitHub Personal Access Token:

**Step-by-step:**

1. Go to GitHub.com and click your **profile picture** (top right)
2. Click **Settings** (bottom of the dropdown menu)
3. Scroll down in the left sidebar and click **Developer settings** (at the very bottom)
4. Click **Personal access tokens** → **Tokens (classic)**
5. Click **Generate new token** → **Generate new token (classic)**
6. Give it a name like "Blog Admin"
7. Set expiration (recommend "90 days" or "No expiration" if you prefer)
8. Select scopes:
   - ✅ **repo** (Full control of private repositories) - check this box
9. Scroll down and click **Generate token** (green button at bottom)
10. **IMPORTANT:** Copy the token immediately - you won't see it again! It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**Alternative path if you can't find Developer settings:**
- Direct link: https://github.com/settings/tokens
- Or: GitHub.com → Your Profile → Settings → Scroll to bottom → Developer settings

### 3. Add Tokens to Environment

**For local development:**
Create a `.env` file in the project root:
```
GITHUB_TOKEN=your_github_token_here
ADMIN_PASSWORD=your_secure_password_here
```

**Important:** Choose a strong password for `ADMIN_PASSWORD` - this protects your admin panel!

**For production deployment:**
Add `GITHUB_TOKEN` as an environment variable in your hosting provider:
- **Vercel**: Settings → Environment Variables
- **Netlify**: Site settings → Environment variables
- **Other**: Check your provider's docs

### 4. Access the Admin

- **Development**: http://localhost:4321/admin-blog
- **Production**: https://jeanmarcfavre.com/admin-blog

## 📝 How It Works

### Automatic Deployment Flow:

```
User saves post in admin UI
    ↓
API endpoint receives request
    ↓
Commits file to GitHub via API
    ↓
GitHub webhook triggers CI/CD
    ↓
Site rebuilds and deploys automatically
    ↓
New post appears on live site!
```

### Fallback Options:

If GitHub token isn't configured:
- **Dev mode**: Files are saved locally
- **Production**: Markdown file is downloaded for manual commit

## 🔒 Security Notes

- **Never commit the `.env` file** to git (it's already in `.gitignore`)
- The GitHub token should have minimal permissions (just `repo` scope)
- Consider using a GitHub App instead of personal token for better security (optional)

## 🆚 Comparison with TinaCMS

| Feature | TinaCMS | Custom Admin |
|---------|---------|--------------|
| Automatic deployment | ✅ | ✅ |
| GitHub commits | ✅ | ✅ |
| User-friendly UI | ⚠️ Complex | ✅ Simple |
| Customization | ⚠️ Limited | ✅ Full control |
| Setup complexity | ⚠️ Medium | ✅ Easy |

## 🐛 Troubleshooting

### "File write not available" message
- Make sure `GITHUB_TOKEN` is set in your environment
- Check that the token has `repo` permissions
- Verify the token hasn't expired

### Posts not appearing after save
- Check GitHub repository for the commit
- Verify CI/CD is set up and running
- Check CI/CD logs for errors

### API routes not working
- Ensure `output: 'hybrid'` in `astro.config.mjs`
- Make sure your hosting provider supports server-side rendering
- Check that API routes are not being pre-rendered

## 📚 Next Steps

1. Test the admin UI locally: `npm run dev`
2. Set up GitHub token
3. Test creating a post
4. Verify automatic deployment works
5. Show your dad the new interface!

---

**Questions?** Check the code in:
- Admin UI: `src/components/Admin.tsx`
- API endpoint: `src/pages/api/blog-posts.ts`
- Admin page: `src/pages/admin-blog.astro`

