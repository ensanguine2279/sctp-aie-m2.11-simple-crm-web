Completed Simple CRM from [Lesson 2.11: Form Handling, Validation, and Deployment](https://github.com/su-ntu-sctp/ai-2.11-form-validation-deployment/blob/main/lesson.md)

Simple CRM deployed on [Netlify](https://ensanguine2279.github.io/sctp-aie-m2.11-simple-crm-web/)

Simple CRM deployed on [GitHub Pages](https://ensanguine2279.github.io/sctp-aie-m2.11-simple-crm-web/)

---

# Guide to publishing simple-crm-web to GitHub Pages

This guide outlines the steps to successfully publish the React/Vite SPA (`simple-crm-web`) to GitHub Pages using automated GitHub Actions.

### Step 1: Configure Vite Base Path

Ensure your `vite.config.js` includes the correct repository name as the `base` path so that https://[GITHUB USERNAME].github.io/[REPOSITORY NAME]/asset URLs resolve correctly on GitHub Pages:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/sctp-aie-m2.11-simple-crm-web/",
});
```

---

### Step 2: Create the GitHub Actions Workflow

Create or update the workflow file at `.github/workflows/deploy.yml` with the official GitHub Pages deployment configuration:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [challenge5]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: "./dist"

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

### Step 3: Configure Repository Settings on GitHub

1. Navigate to your repository on GitHub and click on **Settings**.
2. Select **Pages** from the left-hand sidebar.
3. Under the **Build and deployment** section, ensure the **Source** dropdown is set to **GitHub Actions**.

---

## Step 4: Push Changes and Verify

Commit your code changes and push them to your target branch (e.g. `challenge5`):

```bash
git add .
git commit -m "Configure GitHub Actions deployment for GitHub Pages"
git push origin challenge5
```

Head over to the **Actions** tab in your GitHub repository to check that both the `build` and `deploy` jobs complete successfully. Once finished, the application will be live at the GitHub Pages URL.
