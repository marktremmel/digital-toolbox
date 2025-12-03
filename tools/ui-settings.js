// ==================== UI SETTINGS & ACCESSIBILITY ====================

const uiState = {
    background: 'wave', // wave, particles, solid
    fontSize: 16, // px
    keyboardVisible: false,
    lastFocusedInput: null
};

// ==================== INITIALIZATION ====================
function initUISettings() {
    loadUISettings();
    initSettingsModal();
    initVirtualKeyboard();
    initBackgrounds();
}

function loadUISettings() {
    const savedBg = localStorage.getItem('sek_background');
    const savedSize = localStorage.getItem('sek_fontsize');

    if (savedBg) setBackground(savedBg);
    if (savedSize) setFontSize(parseInt(savedSize));
}

// ==================== SETTINGS MODAL ====================
function initSettingsModal() {
    // This will be called when the settings button is clicked
    // The HTML for the modal will be injected or pre-existing
}

function getSettingsInterface() {
    return `
        <h2>⚙️ Settings & Accessibility</h2>
        
        <div class="settings-section">
            <h3>🎨 Background</h3>
            <div class="bg-options">
                <button onclick="setBackground('wave')" class="bg-btn ${uiState.background === 'wave' ? 'active' : ''}">
                    🌊 Wave
                </button>
                <button onclick="setBackground('particles')" class="bg-btn ${uiState.background === 'particles' ? 'active' : ''}">
                    ✨ Particles
                </button>
                <button onclick="setBackground('solid')" class="bg-btn ${uiState.background === 'solid' ? 'active' : ''}">
                    🎨 Solid
                </button>
            </div>
        </div>

        <div class="settings-section">
            <h3>🔠 Font Size</h3>
            <div class="font-control">
                <span>A-</span>
                <input type="range" min="12" max="24" value="${uiState.fontSize}" 
                    oninput="setFontSize(this.value)" class="font-slider">
                <span>A+</span>
            </div>
            <div style="text-align: center; margin-top: 0.5rem; opacity: 0.7;">
                Current: ${uiState.fontSize}px
            </div>
        </div>

        <div class="settings-section">
            <h3>⌨️ Virtual Keyboard</h3>
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span>Show Hungarian Helper</span>
                <label class="switch">
                    <input type="checkbox" id="vk-toggle" ${uiState.keyboardVisible ? 'checked' : ''} onchange="toggleVirtualKeyboard(this.checked)">
                    <span class="slider round"></span>
                </label>
            </div>
        </div>
    `;
}

// ==================== BACKGROUNDS ====================
// ==================== BACKGROUNDS ====================
let currentResizeHandler = null;

function initBackgrounds() {
    // Ensure the container exists
    let bgContainer = document.querySelector('.wave-background');
    if (!bgContainer) {
        bgContainer = document.createElement('div');
        bgContainer.className = 'wave-background';
        document.body.prepend(bgContainer);
    }
}

function cleanupBackground() {
    if (currentResizeHandler) {
        window.removeEventListener('resize', currentResizeHandler);
        currentResizeHandler = null;
    }
}

function setBackground(type) {
    cleanupBackground();

    uiState.background = type;
    localStorage.setItem('sek_background', type);

    const container = document.querySelector('.wave-background');
    container.innerHTML = ''; // Clear current
    container.className = 'wave-background'; // Reset classes

    // Update active state in settings if open
    document.querySelectorAll('.bg-btn').forEach(btn => {
        if (btn.getAttribute('onclick').includes(type)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    switch (type) {
        case 'wave':
            container.innerHTML = `
                <div class="wave wave1"></div>
                <div class="wave wave2"></div>
                <div class="wave wave3"></div>
            `;
            break;

        case 'particles':
            container.classList.add('bg-particles');
            initParticles(container);
            break;

        case 'solid':
            container.classList.add('bg-solid');
            break;
    }
}

function initParticles(container) {
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    currentResizeHandler = resize;
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Reduced particle count for better performance
    for (let i = 0; i < 35; i++) particles.push(new Particle());

    function animate() {
        if (uiState.background !== 'particles') return; // Stop if changed
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// ==================== FONT SIZE ====================
function setFontSize(size) {
    uiState.fontSize = size;
    localStorage.setItem('sek_fontsize', size);
    document.documentElement.style.fontSize = `${size}px`;
}

// ==================== VIRTUAL KEYBOARD ====================
function initVirtualKeyboard() {
    // Track focused inputs
    document.addEventListener('focusin', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            uiState.lastFocusedInput = e.target;
        }
    });

    // Create keyboard element
    const kb = document.createElement('div');
    kb.id = 'virtual-keyboard';
    kb.className = 'virtual-keyboard glass-card';
    kb.style.display = 'none';

    const chars = ['á', 'é', 'í', 'ó', 'ö', 'ő', 'ú', 'ü', 'ű', '€', '$', '@', '&'];

    let html = '<div class="vk-row">';
    chars.forEach(char => {
        html += `<button onclick="insertChar('${char}')">${char}</button>`;
    });
    html += '</div>';

    // Add caps lock row/toggle if needed, for now just simple chars

    kb.innerHTML = html;
    document.body.appendChild(kb);
}

function toggleVirtualKeyboard(show) {
    uiState.keyboardVisible = show;
    const kb = document.getElementById('virtual-keyboard');
    if (kb) {
        kb.style.display = show ? 'flex' : 'none';
    }
}

function insertChar(char) {
    if (uiState.lastFocusedInput) {
        const input = uiState.lastFocusedInput;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const text = input.value;

        input.value = text.substring(0, start) + char + text.substring(end);
        input.selectionStart = input.selectionEnd = start + 1;
        input.focus();
    }
}
