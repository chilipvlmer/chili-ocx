# Setup Guide

Complete setup instructions for deploying the chili-ocx registry.

## 📋 Prerequisites

- GitHub account
- Cloudflare account (free tier)
- Git installed locally

## 🚀 Initial Setup

### 1. Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name:** `chili-ocx`
3. **Visibility:** Public ✅
4. **DON'T** initialize with README (we already have one)
5. Click "Create repository"

### 2. Push Code to GitHub

```bash
cd /Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: chili-ocx open source registry"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/chili-ocx.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Get Cloudflare Credentials

You need two values for GitHub Actions to deploy to Cloudflare:

#### A. Get Account ID

1. Go to https://dash.cloudflare.com/
2. In the right sidebar, look for **Account ID**
3. Copy it (looks like: `a40e7d68aa1b7d46ca7c68859aadeb7f`)

#### B. Create API Token

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Click **"Use template"** next to **"Edit Cloudflare Workers"**
4. Or click **"Create Custom Token"** and set:
   - **Token name:** `GitHub Actions - chili-ocx`
   - **Permissions:**
     - Account → Cloudflare Pages → Edit
   - **Account Resources:**
     - Include → Your account
5. Click **"Continue to summary"** → **"Create Token"**
6. **Copy the token** (you won't see it again!)

### 4. Add Secrets to GitHub

1. Go to your GitHub repo: `https://github.com/YOUR_USERNAME/chili-ocx`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add two secrets:

**Secret 1:**
- **Name:** `CLOUDFLARE_API_TOKEN`
- **Value:** (paste the API token from step 3B)
- Click "Add secret"

**Secret 2:**
- **Name:** `CLOUDFLARE_ACCOUNT_ID`
- **Value:** (paste the Account ID from step 3A)
- Click "Add secret"

### 5. Verify Deployment

The GitHub Action should automatically trigger on your first push to `main`.

To check:
1. Go to **Actions** tab in your GitHub repo
2. Look for "Deploy to Cloudflare Pages" workflow
3. Click on the latest run to see status

If it succeeds, your registry will be live at:
**https://chili-ocx.pages.dev** 🎉

### 6. Test Installation

```bash
# Add the registry
ocx registry add chili-ocx https://chili-ocx.pages.dev

# Install a component
ocx add chili-ocx/hello-world
```

## 🔄 Ongoing Workflow

### For Regular Updates

```bash
# Make changes to components
vim files/skill/my-skill/SKILL.md

# Update registry
vim registry.jsonc

# Commit and push
git add .
git commit -m "Add my-skill component"
git push

# GitHub Actions automatically deploys to Cloudflare! ✨
```

### For Experimental Work

Use branches for work-in-progress:

```bash
# Create a feature branch
git checkout -b experimental-feature

# Make changes
# ...

# Push (won't trigger deployment)
git push origin experimental-feature

# When ready, merge to main
git checkout main
git merge experimental-feature
git push  # Now it deploys!
```

### Manual Deployment Trigger

You can also manually trigger deployment:

1. Go to **Actions** tab
2. Click **"Deploy to Cloudflare Pages"**
3. Click **"Run workflow"**
4. Select branch and click **"Run workflow"**

## 🐛 Troubleshooting

### GitHub Action Fails

**Check the logs:**
1. Go to Actions tab
2. Click on the failed run
3. Expand the failed step to see error

**Common issues:**
- ❌ Secrets not set correctly → Verify in Settings → Secrets
- ❌ Account ID wrong → Double-check from Cloudflare dashboard
- ❌ API token expired → Create a new one
- ❌ Build fails → Test locally with `bun run build`

### Cloudflare Page Not Found

If `https://chili-ocx.pages.dev` returns 404:

1. Make sure the GitHub Action completed successfully
2. Go to https://dash.cloudflare.com/ → Workers & Pages
3. Click on "chili-ocx" project
4. Check deployment status

### Registry Not Updating

1. Check GitHub Actions ran successfully
2. Wait 1-2 minutes for CDN propagation
3. Try hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
4. Check `https://chili-ocx.pages.dev/index.json` directly

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [OCX Registry Protocol](https://raw.githubusercontent.com/kdcokenny/ocx/main/docs/REGISTRY_PROTOCOL.md)

## ✅ Checklist

- [ ] Created public GitHub repository
- [ ] Pushed code to GitHub
- [ ] Got Cloudflare Account ID
- [ ] Created Cloudflare API Token
- [ ] Added `CLOUDFLARE_API_TOKEN` secret to GitHub
- [ ] Added `CLOUDFLARE_ACCOUNT_ID` secret to GitHub
- [ ] Verified GitHub Action runs successfully
- [ ] Tested registry at `https://chili-ocx.pages.dev`
- [ ] Installed a component with OCX CLI

---

**Need help?** Open an issue on GitHub!
