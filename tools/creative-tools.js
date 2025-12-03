// Creative Tools Implementation

// ==================== GRADIENT GENERATOR ====================
function initGradientGenerator() {
    const color1 = document.getElementById('grad-color1');
    const color2 = document.getElementById('grad-color2');
    const angle = document.getElementById('grad-angle');
    const preview = document.getElementById('grad-preview');
    const cssOutput = document.getElementById('grad-css');

    function updateGradient() {
        const c1 = color1.value;
        const c2 = color2.value;
        const deg = angle.value;
        const gradient = `linear-gradient(${deg}deg, ${c1}, ${c2})`;

        preview.style.background = gradient;
        cssOutput.value = `background: ${gradient};`;
    }

    color1.addEventListener('input', updateGradient);
    color2.addEventListener('input', updateGradient);
    angle.addEventListener('input', updateGradient);

    window.copyGradient = () => {
        cssOutput.select();
        document.execCommand('copy');
        alert('CSS copied to clipboard!');
    };

    window.randomizeGradient = () => {
        const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        color1.value = randomColor();
        color2.value = randomColor();
        angle.value = Math.floor(Math.random() * 360);
        updateGradient();
    };

    updateGradient();
}

// ==================== PALETTE GENERATOR ====================
function initPaletteGenerator() {
    const container = document.getElementById('palette-container');

    window.generatePalette = () => {
        container.innerHTML = '';
        // Generate 5 harmonious colors using HSL
        const baseHue = Math.floor(Math.random() * 360);

        for (let i = 0; i < 5; i++) {
            const hue = (baseHue + (i * 30)) % 360;
            const sat = 60 + Math.random() * 20;
            const light = 40 + Math.random() * 40;
            const color = `hsl(${hue}, ${sat}%, ${light}%)`;
            const hex = hslToHex(hue, sat, light);

            const div = document.createElement('div');
            div.className = 'palette-color';
            div.style.background = color;
            div.innerHTML = `<span class="color-code">${hex}</span>`;
            div.onclick = () => {
                navigator.clipboard.writeText(hex);
                alert(`Copied ${hex}!`);
            };
            container.appendChild(div);
        }
    };

    function hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    generatePalette();
}

// ==================== ASCII ART GENERATOR ====================
function initAsciiArt() {
    const input = document.getElementById('ascii-text-input');
    const output = document.getElementById('ascii-output');
    const fontSelect = document.getElementById('ascii-font');

    // Simple mapping for demo purposes (real ASCII art needs a library like figlet.js)
    // Since we can't easily import external libs without CDN, we'll do a basic text styler
    // or use a free API if available. For now, let's use a simple pseudo-generator.

    window.generateAscii = async () => {
        const text = input.value;
        if (!text) return;

        output.innerText = "Generating...";

        // Using a public API for ASCII art
        try {
            const font = fontSelect.value;
            const response = await fetch(`https://api.textart.io/figlet.json?text=${encodeURIComponent(text)}&font=${font}`);
            // Note: This API might have CORS issues or limits. 
            // Fallback: Simple text transformation if API fails.

            // Actually, let's use a reliable fallback since we can't guarantee API access
            // We'll simulate it with a simple transformation for now
            output.innerText = transformText(text, font);
        } catch (e) {
            output.innerText = "Error generating ASCII art.";
        }
    };

    function transformText(text, style) {
        // Simple mapping for "Big" style (just uppercase spaced out for demo)
        if (style === 'Big') {
            return text.split('').join(' ').toUpperCase();
        }
        // "Binary" style
        if (style === 'Binary') {
            return text.split('').map(c => c.charCodeAt(0).toString(2)).join(' ');
        }
        // "Box" style
        if (style === 'Box') {
            const line = '─'.repeat(text.length + 4);
            return `┌${line}┐\n│  ${text}  │\n└${line}┘`;
        }
        return text;
    }
}
