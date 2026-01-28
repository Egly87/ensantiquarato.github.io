# GitHub Actions Configuration

## Deploy Workflow (deploy.yml)

### What It Does
Automatically deploys your site to Cloudflare Pages on every push to `main` branch.

### Prerequisites
1. **GitHub repository created** (your fork/repo on github.com)
2. **Cloudflare account** with Pages enabled
3. **Secrets configured** in your GitHub repo settings

### Setup Steps

#### 1. Create Cloudflare API Token
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use template: **Cloudflare Pages - Deploy**
4. Grant permissions:
   - `Account.Cloudflare Pages` (Edit)
   - `Zone.Deployment` (Edit) [if needed]
5. Copy the token

#### 2. Create Cloudflare Account ID
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile)
2. Look for "Account ID" (32 character string)
3. Copy it

#### 3. Add Secrets to GitHub Repo
1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add two secrets:
   - **Name**: `CLOUDFLARE_API_TOKEN` | **Value**: Your API token from step 1
   - **Name**: `CLOUDFLARE_ACCOUNT_ID` | **Value**: Your Account ID from step 2

#### 4. Create Cloudflare Pages Project
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select **Workers & Pages** → **Pages** → **Create a project**
3. Choose **Deploy with direct upload**
4. Name: `antiquariato-shop`
5. Click **Create project**

### Workflow Features
- ✅ Runs on every push to `main`
- ✅ Validates `data/products.json` JSON syntax
- ✅ Generates product images (if originals uploaded)
- ✅ Converts SVG templates (if needed)
- ✅ Deploys to Cloudflare Pages
- ✅ Comments on PRs with status
- ✅ Shows deployment summary

### Manual Deployment (if needed)
```bash
# Install Wrangler
npm install -g wrangler

# Deploy manually
wrangler pages deploy . --project-name=antiquariato-shop
```

### Troubleshooting

**Workflow fails with "API token invalid"**
- Verify `CLOUDFLARE_API_TOKEN` secret is set correctly
- Check token hasn't expired on Cloudflare dashboard

**Deployment doesn't appear**
- Check GitHub Actions tab for error logs
- Verify Cloudflare Pages project exists with name `antiquariato-shop`

**Image conversion fails**
- Ensure `assets/products/originals/` contains valid images
- Check Node.js version is 18+ (set in workflow)

---

## Image Conversion Workflow (image-conversion.yml)

### What It Does
Automatically converts product/brand images to WebP on every push.

### Setup
1. Place original images in `assets/products/originals/`
2. Push to GitHub
3. Workflow automatically generates WebP + thumbnails
4. Commits results back to repo (requires push permissions)

### Configuration
To enable auto-commit of generated assets:
1. GitHub repo → **Settings** → **Actions** → **General**
2. Enable: "Allow GitHub Actions to create and approve pull requests"

---

## Manual GitHub Actions Commands

### View workflow logs
```bash
# List recent workflow runs
gh run list

# View specific run logs
gh run view <run-id>

# Watch live (requires GitHub CLI)
gh run watch
```

### Trigger manual run
```bash
# Trigger deployment manually
gh workflow run deploy.yml
```

---

**See [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for complete deployment instructions.**
