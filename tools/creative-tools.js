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

// ==================== PATTERN GENERATOR ====================
const patternStyles = {
    stripes: (c1, c2, size) => `repeating-linear-gradient(45deg, ${c1}, ${c1} ${size}px, ${c2} ${size}px, ${c2} ${size * 2}px)`,
    dots: (c1, c2, size) => `radial-gradient(${c1} ${size}px, ${c2} ${size}px)`,
    checkers: (c1, c2, size) => `repeating-conic-gradient(${c1} 0% 25%, ${c2} 0% 50%)`,
    grid: (c1, c2, size) => `linear-gradient(${c2} 2px, transparent 2px), linear-gradient(90deg, ${c2} 2px, ${c1} 2px)`,
    zigzag: (c1, c2, size) => `linear-gradient(135deg, ${c1} 25%, transparent 25%), linear-gradient(225deg, ${c1} 25%, transparent 25%), linear-gradient(45deg, ${c1} 25%, transparent 25%), linear-gradient(315deg, ${c1} 25%, ${c2} 25%)`,
    waves: (c1, c2, size) => `radial-gradient(circle at 100% 50%, transparent 20%, ${c1} 21%, ${c1} 34%, transparent 35%, transparent), radial-gradient(circle at 0% 50%, transparent 20%, ${c1} 21%, ${c1} 34%, transparent 35%, transparent) 0 ${size}px`
};

function initPatternGenerator() {
    generatePattern();
}

window.generatePattern = function () {
    const style = document.getElementById('pattern-style').value;
    const color1 = document.getElementById('pattern-color1').value;
    const color2 = document.getElementById('pattern-color2').value;
    const size = parseInt(document.getElementById('pattern-size').value);

    const preview = document.getElementById('pattern-preview');
    const pattern = patternStyles[style](color1, color2, size);

    preview.style.background = pattern;
    preview.style.backgroundSize = style === 'dots' ? `${size * 3}px ${size * 3}px` :
        style === 'checkers' ? `${size * 2}px ${size * 2}px` :
            style === 'grid' ? `${size}px ${size}px` :
                style === 'zigzag' ? `${size}px ${size}px` : '';

    const css = `background: ${pattern};${preview.style.backgroundSize ? `\nbackground-size: ${preview.style.backgroundSize};` : ''}`;
    document.getElementById('pattern-css').value = css;
};

window.copyPatternCSS = function () {
    const css = document.getElementById('pattern-css').value;
    navigator.clipboard.writeText(css);
    if (window.haptics) window.haptics.success();
    alert('CSS copied!');
};

window.randomizePattern = function () {
    const styles = Object.keys(patternStyles);
    document.getElementById('pattern-style').value = styles[Math.floor(Math.random() * styles.length)];
    document.getElementById('pattern-color1').value = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    document.getElementById('pattern-color2').value = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    document.getElementById('pattern-size').value = Math.floor(Math.random() * 40) + 10;
    generatePattern();
};
