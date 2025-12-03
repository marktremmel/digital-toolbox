# 🎨 SEK Digital Toolbox

A beautiful, feature-rich digital hub for SEK Budapest's Digital Culture Education program. This toolbox provides students with interactive tools, educational resources, and quick access to learning platforms—all wrapped in a stunning glassy pastel aesthetic.

![SEK Digital Toolbox](https://img.shields.io/badge/Version-1.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🛠️ Interactive Tools
- **Metronome** - Adjustable BPM with visual beat indicator
- **Musical Notes** - Play A and C notes
- **Flashlight** - Screen flashlight with brightness control
- **Digital Ruler** - Measure on screen
- **Timer/Stopwatch/Alarm** - Three modes in one
- **Pomodoro Timer** - Customizable work/break intervals with notifications
- **Calculator** - Basic and scientific modes
- **Color Picker** - HEX, RGB, and HSL color conversion
- **Unit Converter** - Length, weight, temperature, volume
- **QR Code Generator** - Create and download QR codes
- **EXIF Remover** - Remove metadata from images
- **Reverse Image Search** - Search across multiple services
- **Sticky Notes** - Persistent notes with localStorage
- **Soundboard** - Sound effects generator

### 🔗 Quick Links
- AI assistants (ChatGPT, Gemini, Perplexity)
- Creative tools (Canva, Paint, AutoDraw)
- Game development (Narrat, Twine, Bitsy)
- Coding platforms (CodeHS, MakeCode, Scratch, etc.)
- Daily games (Wordle, Connections, FoodGuessr, etc.)
- Educational resources
- Map and data tools

### 📚 Cheatsheets
- **Keyboard Shortcuts** - For Photoshop, Blender, Premiere Pro, GarageBand, Canva, and Roblox Studio
- **Programming Terms** - Variables, conditionals, loops, arrays, and dictionaries with examples in Python, JavaScript, and pseudocode
- **Math & Physics** - Essential formulas including electrical calculations (villamos)

### 🌟 Special Features
- **Hungarian Nameday Widget** - Shows today's namedays
- **Live Weather** - Free weather data via Open-Meteo
- **Multi-Engine Search** - Search with Google, DuckDuckGo, Bing, or Yahoo
- **Dark/Light Mode** - Theme toggle
- **Language Switcher** - Hungarian/English support
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
├── style.css               # Main styles
├── modal-styles.css        # Modal-specific styles
├── script.js               # Core functionality
├── tools/
│   └── tools.js           # Tool implementations
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
