// ==================== GLOBAL STATE ====================
let currentLang = 'hu';
let isDarkMode = false;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Load saved preferences
    loadPreferences();
    
    // Initialize components
    updateDate();
    updateNameday();
    initializeWeather();
    initializeSearch();
    initializeToolModals();
    initializeThemeToggle();
    initializeLangToggle();
    
    // Update date every minute
    setInterval(updateDate, 60000);
}

// ==================== PREFERENCES ====================
function loadPreferences() {
    const savedLang = localStorage.getItem('language');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedLang) {
        currentLang = savedLang;
        updateLanguage();
    }
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        isDarkMode = true;
        updateThemeIcon();
    }
}

function savePreferences() {
    localStorage.setItem('language', currentLang);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

// ==================== DATE & NAMEDAY ====================
function updateDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateStr = now.toLocaleDateString(currentLang === 'hu' ? 'hu-HU' : 'en-US', options);
    
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = dateStr;
    }
}

async function updateNameday() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    try {
        const response = await fetch('data/namedays.json');
        const namedays = await response.json();
        
        const names = namedays[month] && namedays[month][day];
        const namedayElement = document.getElementById('nameday-names');
        
        if (namedayElement && names) {
            namedayElement.textContent = names.join(', ');
        }
    } catch (error) {
        console.error('Error loading namedays:', error);
    }
}

// ==================== WEATHER ====================
async function initializeWeather() {
    const weatherWidget = document.getElementById('weather-widget');
    
    // Try to get user's location
    if ('geolocation' in navigator) {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            
            const { latitude, longitude } = position.coords;
            await fetchWeather(latitude, longitude);
        } catch (error) {
            // Default to Budapest if geolocation fails
            await fetchWeather(47.4979, 19.0402);
        }
    } else {
        // Default to Budapest
        await fetchWeather(47.4979, 19.0402);
    }
}

async function fetchWeather(lat, lon) {
    const weatherWidget = document.getElementById('weather-widget');
    
    try {
        // Using Open-Meteo (free, no API key required)
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`
        );
        const data = await response.json();
        
        const temp = Math.round(data.current.temperature_2m);
        const weatherCode = data.current.weather_code;
        const weatherEmoji = getWeatherEmoji(weatherCode);
        
        weatherWidget.innerHTML = `
            <span>${weatherEmoji} ${temp}°C</span>
        `;
    } catch (error) {
        console.error('Error fetching weather:', error);
        weatherWidget.innerHTML = '<span>🌤️ --°C</span>';
    }
}

function getWeatherEmoji(code) {
    // WMO Weather interpretation codes
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '🌨️';
    if (code <= 82) return '🌧️';
    if (code <= 86) return '🌨️';
    if (code <= 99) return '⛈️';
    return '🌤️';
}

// ==================== SEARCH ====================
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtns = document.querySelectorAll('.search-btn');
    
    searchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (!query) return;
            
            const engine = btn.dataset.engine;
            const urls = {
                google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
                duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
                bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
                yahoo: `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`
            };
            
            window.open(urls[engine], '_blank');
        });
    });
    
    // Allow Enter key to search with Google
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
            }
        }
    });
}

// ==================== MODAL SYSTEM ====================
function initializeToolModals() {
    const toolCards = document.querySelectorAll('[data-tool]');
    
    toolCards.forEach(card => {
        card.addEventListener('click', () => {
            const tool = card.dataset.tool;
            openToolModal(tool);
        });
    });
    
    // Close modal
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.querySelector('.modal-close');
    
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openToolModal(tool) {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    
    // Load tool interface
    modalBody.innerHTML = getToolInterface(tool);
    modalOverlay.classList.add('active');
    
    // Initialize tool functionality
    initializeTool(tool);
}

function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    modalOverlay.classList.remove('active');
    
    // Clean up any active intervals/timers
    if (window.activeInterval) {
        clearInterval(window.activeInterval);
        window.activeInterval = null;
    }
    if (window.activeAudio) {
        window.activeAudio.pause();
        window.activeAudio = null;
    }
}

function getToolInterface(tool) {
    const interfaces = {
        metronome: `
            <h2>🎵 Metronome</h2>
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;" id="metronome-bpm">120</div>
                <input type="range" min="40" max="240" value="120" id="metronome-slider" 
                    style="width: 100%; margin-bottom: 2rem;">
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="startMetronome()" style="padding: 1rem 2rem; font-size: 1.2rem; cursor: pointer; border-radius: 12px; border: none; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">Start</button>
                    <button onclick="stopMetronome()" style="padding: 1rem 2rem; font-size: 1.2rem; cursor: pointer; border-radius: 12px; border: none; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white;">Stop</button>
                </div>
                <div id="metronome-beat" style="width: 60px; height: 60px; border-radius: 50%; background: #667eea; margin: 2rem auto; opacity: 0.3; transition: all 0.1s;"></div>
            </div>
        `,
        notes: `
            <h2>🎼 Musical Notes</h2>
            <div style="text-align: center; padding: 2rem;">
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button onclick="playNote('A4', 440)" style="padding: 2rem; font-size: 2rem; cursor: pointer; border-radius: 12px; background: rgba(255,255,255,0.2);">A</button>
                    <button onclick="playNote('C4', 261.63)" style="padding: 2rem; font-size: 2rem; cursor: pointer; border-radius: 12px; background: rgba(255,255,255,0.2);">C</button>
                </div>
            </div>
        `,
        flashlight: `
            <h2>🔦 Flashlight</h2>
            <div style="text-align: center; padding: 2rem;">
                <button onclick="toggleFlashlight()" id="flashlight-btn" 
                    style="padding: 3rem; font-size: 4rem; cursor: pointer; border-radius: 50%; background: rgba(255,255,255,0.2); border: none; width: 200px; height: 200px;">
                    💡
                </button>
                <div style="margin-top: 2rem;">
                    <label>Brightness:</label>
                    <input type="range" min="50" max="100" value="100" id="brightness-slider" 
                        onchange="updateBrightness(this.value)" style="width: 100%; margin-top: 1rem;">
                </div>
            </div>
        `,
        ruler: `
            <h2>📏 Digital Ruler</h2>
            <div style="padding: 2rem;">
                <canvas id="ruler-canvas" width="800" height="400" style="border: 2px solid #667eea; border-radius: 12px; width: 100%; cursor: crosshair;"></canvas>
                <div style="margin-top: 1rem; text-align: center;">
                    <span id="ruler-measurement">Click and drag to measure</span>
                </div>
            </div>
        `,
        timer: `
            <h2>⏱️ Timer & Stopwatch</h2>
            <div style="padding: 2rem;">
                <div style="display: flex; gap: 1rem; margin-bottom: 2rem; justify-content: center;">
                    <button onclick="switchTimerMode('timer')" class="timer-mode-btn" data-mode="timer">Timer</button>
                    <button onclick="switchTimerMode('stopwatch')" class="timer-mode-btn" data-mode="stopwatch">Stopwatch</button>
                    <button onclick="switchTimerMode('alarm')" class="timer-mode-btn" data-mode="alarm">Alarm</button>
                </div>
                <div id="timer-interface"></div>
            </div>
        `,
        pomodoro: `
            <h2>🍅 Pomodoro Timer</h2>
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 2rem;" id="pomodoro-display">25:00</div>
                <div style="margin-bottom: 2rem;">
                    <label>Work (min): <input type="number" id="work-time" value="25" min="1" max="60" style="width: 60px;"></label>
                    <label style="margin-left: 1rem;">Break (min): <input type="number" id="break-time" value="5" min="1" max="30" style="width: 60px;"></label>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="startPomodoro()" style="padding: 1rem 2rem;">Start</button>
                    <button onclick="pausePomodoro()" style="padding: 1rem 2rem;">Pause</button>
                    <button onclick="resetPomodoro()" style="padding: 1rem 2rem;">Reset</button>
                </div>
                <div id="pomodoro-session" style="margin-top: 2rem; font-size: 1.5rem;"></div>
            </div>
        `,
        calculator: `
            <h2>🧮 Calculator</h2>
            <div style="padding: 2rem;">
                <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                    <button onclick="switchCalcMode('basic')" class="calc-mode-btn">Basic</button>
                    <button onclick="switchCalcMode('scientific')" class="calc-mode-btn">Scientific</button>
                </div>
                <input type="text" id="calc-display" readonly style="width: 100%; padding: 1.5rem; font-size: 2rem; text-align: right; margin-bottom: 1rem; border-radius: 12px;">
                <div id="calc-buttons"></div>
            </div>
        `,
        'color-picker': `
            <h2>🎨 Color Picker</h2>
            <div style="padding: 2rem; text-align: center;">
                <input type="color" id="color-input" style="width: 200px; height: 200px; border: none; cursor: pointer;" value="#667eea">
                <div style="margin-top: 2rem;">
                    <div><strong>HEX:</strong> <span id="color-hex">#667eea</span></div>
                    <div><strong>RGB:</strong> <span id="color-rgb">rgb(102, 126, 234)</span></div>
                    <div><strong>HSL:</strong> <span id="color-hsl">hsl(228, 75%, 66%)</span></div>
                </div>
                <button onclick="copyColor()" style="margin-top: 2rem; padding: 1rem 2rem;">Copy HEX</button>
            </div>
        `,
        'unit-converter': `
            <h2>🔄 Unit Converter</h2>
            <div style="padding: 2rem;">
                <select id="unit-category" onchange="updateUnitOptions()" style="width: 100%; padding: 0.5rem; margin-bottom: 1rem;">
                    <option value="length">Length</option>
                    <option value="weight">Weight</option>
                    <option value="temperature">Temperature</option>
                    <option value="volume">Volume</option>
                </select>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div>
                        <input type="number" id="from-value" oninput="convertUnits()" style="width: 100%; padding: 0.5rem;" value="1">
                        <select id="from-unit" onchange="convertUnits()" style="width: 100%; padding: 0.5rem; margin-top: 0.5rem;"></select>
                    </div>
                    <div>
                        <input type="number" id="to-value" readonly style="width: 100%; padding: 0.5rem;">
                        <select id="to-unit" onchange="convertUnits()" style="width: 100%; padding: 0.5rem; margin-top: 0.5rem;"></select>
                    </div>
                </div>
            </div>
        `,
        'qr-generator': `
            <h2>📱 QR Code Generator</h2>
            <div style="padding: 2rem; text-align: center;">
                <input type="text" id="qr-input" placeholder="Enter text or URL" style="width: 100%; padding: 1rem; margin-bottom: 1rem; border-radius: 12px;">
                <button onclick="generateQR()" style="padding: 1rem 2rem; margin-bottom: 2rem;">Generate QR Code</button>
                <div id="qr-output"></div>
            </div>
        `,
        'exif-remover': `
            <h2>🖼️ EXIF Data Remover</h2>
            <div style="padding: 2rem; text-align: center;">
                <div id="drop-zone" style="border: 3px dashed #667eea; border-radius: 12px; padding: 3rem; margin-bottom: 1rem; cursor: pointer;">
                    <p>📁 Drag & drop image here or click to select</p>
                    <input type="file" id="exif-input" accept="image/*" style="display: none;">
                </div>
                <div id="exif-output"></div>
            </div>
        `,
        'reverse-search': `
            <h2>🔍 Reverse Image Search</h2>
            <div style="padding: 2rem; text-align: center;">
                <div id="reverse-drop-zone" style="border: 3px dashed #667eea; border-radius: 12px; padding: 3rem; margin-bottom: 1rem; cursor: pointer;">
                    <p>📁 Drag & drop image here or click to select</p>
                    <input type="file" id="reverse-input" accept="image/*" style="display: none;">
                </div>
                <div id="reverse-preview"></div>
                <div id="reverse-services" style="display: none; margin-top: 2rem;">
                    <p>Search with:</p>
                    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 1rem;">
                        <button onclick="reverseSearch('google')">Google Images</button>
                        <button onclick="reverseSearch('tineye')">TinEye</button>
                        <button onclick="reverseSearch('yandex')">Yandex</button>
                        <button onclick="reverseSearch('bing')">Bing</button>
                    </div>
                </div>
            </div>
        `,
        'notes-app': `
            <h2>📝 Sticky Notes</h2>
            <div style="padding: 2rem;">
                <div style="margin-bottom: 1rem;">
                    <button onclick="addStickyNote()" style="padding: 1rem 2rem;">+ Add Note</button>
                </div>
                <div id="notes-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;"></div>
            </div>
        `,
        soundboard: `
            <h2>🔊 Soundboard</h2>
            <div style="padding: 2rem;">
                <div id="soundboard-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1rem;">
                    <button onclick="playSound('applause')" style="padding: 2rem;">👏<br>Applause</button>
                    <button onclick="playSound('crickets')" style="padding: 2rem;">🦗<br>Crickets</button>
                    <button onclick="playSound('drumroll')" style="padding: 2rem;">🥁<br>Drumroll</button>
                    <button onclick="playSound('tada')" style="padding: 2rem;">🎉<br>Tada</button>
                </div>
            </div>
        `,
        screenshot: `
            <h2>📸 Screenshot Guide</h2>
            <div style="padding: 2rem;">
                <h3>macOS:</h3>
                <ul style="list-style: none; padding: 0;">
                    <li>⌘ + Shift + 3: Full screen</li>
                    <li>⌘ + Shift + 4: Select area</li>
                    <li>⌘ + Shift + 5: Screenshot options</li>
                </ul>
                <h3 style="margin-top: 2rem;">Windows:</h3>
                <ul style="list-style: none; padding: 0;">
                    <li>Win + Shift + S: Snipping tool</li>
                    <li>Win + PrtScn: Full screen</li>
                    <li>Alt + PrtScn: Active window</li>
                </ul>
            </div>
        `
    };
    
    return interfaces[tool] || '<p>Tool interface coming soon!</p>';
}

function initializeTool(tool) {
    switch(tool) {
        case 'metronome':
            initializeMetronome();
            break;
        case 'notes':
            initializeNotes();
            break;
        case 'ruler':
            initializeRuler();
            break;
        case 'timer':
            switchTimerMode('timer');
            break;
        case 'calculator':
            switchCalcMode('basic');
            break;
        case 'color-picker':
            initializeColorPicker();
            break;
        case 'unit-converter':
            updateUnitOptions();
            break;
        case 'exif-remover':
            initializeExifRemover();
            break;
        case 'reverse-search':
            initializeReverseSearch();
            break;
        case 'notes-app':
            loadStickyNotes();
            break;
    }
}

// ==================== THEME TOGGLE ====================
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode');
        updateThemeIcon();
        savePreferences();
    });
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = isDarkMode ? '☀️' : '🌙';
}

// ==================== LANGUAGE TOGGLE ====================
function initializeLangToggle() {
    const langToggle = document.getElementById('lang-toggle');
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'hu' ? 'en' : 'hu';
        updateLanguage();
        savePreferences();
    });
}

function updateLanguage() {
    document.getElementById('lang-text').textContent = currentLang.toUpperCase();
    
    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = el.dataset[currentLang];
    });
    
    // Update date and nameday
    updateDate();
}

// Tool implementations will be loaded from separate files
// This file contains the core functionality and modal system
