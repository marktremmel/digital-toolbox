# SEK Digital Toolbox - Deployment Guide

Welcome to the SEK Budapest Digital Toolbox! This guide will help you deploy the application to GitHub Pages.

## 📋 Prerequisites

- Git installed on your computer
- A GitHub account
- The digital-toolbox folder ready to deploy

## 🚀 Deployment Steps

### Option 1: Deploy to GitHub Pages (Recommended)

1. **Create a new repository on GitHub**
   - Go to [github.com](https://github.com) and sign in
   - Click the "+" icon → "New repository"
   - Name it `digital-toolbox` or `sek-toolbox`
   - Make it Public
   - Don't initialize with README (we already have files)
   - Click "Create repository"

2. **Push your code to GitHub**
   
   Open terminal in the digital-toolbox folder and run:
   
   ```bash
   cd /Users/marktremmel/.gemini/antigravity/scratch/digital-toolbox
   git init
   git add .
   git commit -m "Initial commit: SEK Digital Toolbox"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/digital-toolbox.git
   git push -u origin main
   ```
   
   Replace `YOUR-USERNAME` with your GitHub username.

3. **Enable GitHub Pages**
   
   - Go to your repository on GitHub
   - Click "Settings" → "Pages" (in the left sidebar)
   - Under "Source", select "main" branch
   - Click "Save"
   - Wait 1-2 minutes for deployment
   - Your site will be available at: `https://YOUR-USERNAME.github.io/digital-toolbox/`

### Option 2: Deploy to Netlify (Alternative)

1. **Create account on Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Deploy**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select your digital-toolbox repository
   - Click "Deploy site"
   - Your site will be live at a random URL (you can customize it)

### Option 3: Deploy to Vercel (Alternative)

1. **Create account on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy**
   - Click "Add New" → "Project"
   - Import your digital-toolbox repository
   - Click "Deploy"
   - Your site will be live instantly

## 🔧 Customization After Deployment

### Update Links
If you deploy to a custom domain or subdirectory, you may need to update file paths in `index.html` and `cheatsheets.html`.

### Weather API
The weather widget uses Open-Meteo (free, no API key needed), so it should work immediately.

### Hungarian Namedays
All nameday data is stored locally in `data/namedays.json`, so it works offline.

## 📱 Testing Locally

Before deploying, test locally:

```bash
npx serve ./digital-toolbox -l 8080
```

Then open http://localhost:8080 in your browser.

## 🌐 Custom Domain (Optional)

If you want to use a custom domain:

1. **GitHub Pages:**
   - Go to Settings → Pages
   - Add your custom domain
   - Configure DNS records at your domain provider

2. **Netlify/Vercel:**
   - Go to Domain settings
   - Add custom domain
   - Follow DNS configuration instructions

## 📂 File Structure

```
digital-toolbox/
├── index.html              # Main homepage
├── cheatsheets.html        # Cheatsheets page
├── style.css               # All styles
├── script.js               # Core functionality
├── tools/
│   └── tools.js           # Interactive tool implementations
├── data/
│   └── namedays.json      # Hungarian nameday database
└── assets/
    └── sounds/            # Sound files for tools
```

## 🎨 Making Changes

After deployment, to update your site:

```bash
# Make your changes to files
git add .
git commit -m "Description of changes"
git push
```

GitHub Pages will automatically rebuild in 1-2 minutes.

## 🐛 Troubleshooting

**Issue: Site not loading**
- Check if GitHub Pages is enabled in Settings
- Ensure repository is Public
- Wait 2-3 minutes after first deployment

**Issue: Tools not working**
- Check browser console for errors (F12)
- Ensure all files are uploaded correctly
- Check file paths are correct

**Issue: Weather not showing**
- Check internet connection
- Open-Meteo API might be down (rare)
- Check browser console for errors

## 📧 Support

For SEK Budapest students: Contact your Digital Culture teacher for support.

## 🎉 You're Done!

Your digital toolbox should now be live and accessible to anyone with the link. Share it with your classmates!

---

**Note:** This is a static website (HTML/CSS/JavaScript), so it's completely free to host on GitHub Pages, Netlify, or Vercel.
