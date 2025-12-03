# 🎨 SEK Digital Toolbox

A beautiful, feature-rich digital hub for SEK Budapest's Digital Culture Education program. This toolbox provides students with interactive tools, educational resources, and quick access to learning platforms—all wrapped in a stunning glassy pastel aesthetic.

![SEK Digital Toolbox](https://img.shields.io/badge/Version-2.0-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen)

### 📚 Study & Productivity Tools
- **Flashcards** - Create and study flashcard sets
- **Word Counter** - Count words, characters, and reading time
- **Habit Tracker** - Track daily habits
- **Todo List** - Persistent task management

### 🎨 Creative & Design Tools
- **Gradient Generator** - CSS gradients with live preview
- **Color Palette Generator** - Beautiful color palettes
- **ASCII Art Generator** - Convert text to ASCII art
- **Color Picker** - HEX, RGB, HSL conversion
- **QR Code Generator** - Create and download QR codes
- **EXIF Remover** - Remove metadata from images
- **Reverse Image Search** - Search across multiple services

### 💻 Dev & Utility Tools
- **Markdown Preview** - Live markdown editor
- **Base64 Encoder/Decoder** - Encode and decode Base64
- **Password Generator** - Secure password creation
- **Lorem Ipsum Generator** - Placeholder text

### 🎮 Games & Fun
- **Typing Speed Test** - Test and improve typing speed
- **Quick Maths** - Mental math challenges
- **Dice Roller** - Roll various dice
- **Magic 8 Ball** - Ask questions, get answers

### 🗣️ Language & Security
- **Dictionary & Thesaurus** - Word definitions and synonyms
- **Language Translator** - Translate between languages

### 🌟 Special Features

#### Phase 3: Enhanced UX ✨ NEW!
- **🎨 Theme System** - 6 beautiful preset themes (Ocean Blue, Forest Green, Sunset Orange, Midnight Purple, High Contrast)
- **📳 Haptic Feedback** - Vibration support with adjustable strength (Light/Medium/Strong) and test controls
- **⌨️ Keyboard Shortcuts** - Global hotkeys (Cmd+K for command palette, Cmd+S for settings, etc.)
- **🔍 Command Palette** - Quick fuzzy search for all tools and actions (Cmd/Ctrl+K)
- **⚡ Quick Access Bar** - Floating action button with common shortcuts

#### Core Features
- **PWA Support** - Install as an app on any device
- **Collapsible Folders** - Organized tool and link sections
- **Global Search** - Find any tool or link instantly
- **Favorites System** - Star your most-used tools
- **Hungarian Nameday Widget** - Shows today's namedays
- **Live Weather** - Free weather data via Open-Meteo
- **Multi-Engine Search** - Search with Google, DuckDuckGo, Bing, or Yahoo
- **Dark/Light Mode** - Theme toggle with persistence
- **Language Switcher** - Hungarian/English support
- **Virtual Keyboard** - Hungarian special characters helper
- **Font Size Adjuster** - Scale entire UI (12-24px)
- **Background Options** - Wave, Particles, or Solid backgrounds
- **Glassy Pastel Design** - Beautiful wave animations and glassmorphism

## 🚀 Quick Start

### Run Locally

```bash
# Clone or navigate to the directory
cd digital-toolbox

# Start a local server
npx serve . -l 8080

# Open http://localhost:8080 in your browser
```

### Deploy to GitHub Pages

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

Quick steps:
1. Create a new GitHub repository
2. Push your code
3. Enable GitHub Pages in repository settings
4. Access at `https://yourusername.github.io/digital-toolbox/`

## 📂 Project Structure

```
digital-toolbox/
├── index.html              # Main homepage
├── cheatsheets.html        # Cheatsheets page
├── style.css               # Main styles (1000+ lines)
├── folder-styles.css       # Collapsible folder styles
├── modal-styles.css        # Modal-specific styles
├── ui-styles.css           # UI component styles
├── script.js               # Core functionality
├── manifest.json           # PWA manifest
├── service-worker.js       # PWA service worker
├── tools/
│   ├── tools.js           # Basic tool implementations
│   ├── study-tools.js     # Study & productivity tools
│   ├── creative-tools.js  # Creative & design tools
│   ├── dev-tools.js       # Developer utilities
│   ├── game-tools.js      # Games & fun tools
│   ├── security-tools.js  # Language & security tools
│   ├── ui-settings.js     # Background/font/keyboard settings
│   ├── theme-system.js    # Theme presets & switching
│   ├── haptic-feedback.js # Vibration API wrapper
│   ├── keyboard-shortcuts.js # Global keyboard shortcuts
│   ├── command-palette.js # Quick access search
│   └── quick-access.js    # Floating action button
├── data/
│   └── namedays.json      # Hungarian nameday database
└── assets/
    └── sounds/            # Sound files
```

## 🎨 Customization

### Colors
Edit CSS variables in `style.css`:
```css
:root {
    --pastel-purple: #E9D5FF;
    --pastel-pink: #FBD5E8;
    --pastel-blue: #BFDBFE;
    /* ... more colors ... */
}
```

### Adding New Tools
1. Add a button in `index.html` with `data-tool="your-tool"`
2. Add tool interface in `getToolInterface()` in `script.js`
3. Add tool logic in `tools/tools.js`

### Adding New Links
Simply add a new link card in the appropriate section in `index.html`.

## 🌐 Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Mobile browsers (some tools may have limited functionality)

## 📱 Mobile Support

The toolbox is fully responsive and works on mobile devices, though some interactive tools work best on desktop.

## 🤝 Contributing

This project is designed for SEK Budapest students. Improvements and suggestions are welcome!

## 📄 License

MIT License - feel free to use this for educational purposes.

## 🙏 Credits

- **Design**: Modern glassmorphism with pastel aesthetics
- **Weather API**: [Open-Meteo](https://open-meteo.com/) (free, no API key required)
- **QR Generator**: QR Server API
- **Fonts**: Google Fonts (Inter, Outfit)

## 📧 Support

For SEK Budapest students: Contact your Digital Culture Education teacher.

---

**Made with 💜 for SEK Budapest Digital Culture Education**
