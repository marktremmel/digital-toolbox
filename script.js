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
    initUISettings(); // Initialize UI Settings
    initializeSettingsToggle(); // Wire up button
    registerServiceWorker();

    // Update date every minute
    setInterval(updateDate, 60000);
}

function initializeSettingsToggle() {
    const settingsBtn = document.getElementById('settings-toggle');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            const modalOverlay = document.getElementById('modal-overlay');
            const modalBody = document.getElementById('modal-body');

            modalBody.innerHTML = getSettingsInterface();
            modalOverlay.classList.add('active');

            // Re-apply current states to UI controls
            // (This is handled by initUISettings -> loadUISettings, but we might need to refresh UI state here if modal was just created)
            // For now, getSettingsInterface renders with current state.
        });
    }
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(() => console.log('Service Worker Registered'))
            .catch((err) => console.log('Service Worker Failed', err));
    }
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

function toggleFolder(header) {
    header.classList.toggle('collapsed');
    const content = header.nextElementSibling;
    content.classList.toggle('collapsed');

    const toggleIcon = header.querySelector('.folder-toggle');
    if (toggleIcon) {
        toggleIcon.textContent = header.classList.contains('collapsed') ? '🔽' : '🔼';
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
            <div style="display: grid; gap: 2rem; margin-top: 1rem;">
                <div>
                    <h3>macOS:</h3>
                    <ul>
                        <li><strong>⌘ + Shift + 3:</strong> Full screen</li>
                        <li><strong>⌘ + Shift + 4:</strong> Select area</li>
                        <li><strong>⌘ + Shift + 5:</strong> Screenshot options</li>
                    </ul>
                </div>
                <div>
                    <h3>Windows:</h3>
                    <ul>
                        <li><strong>Win + Shift + S:</strong> Snipping tool</li>
                        <li><strong>Win + PrtScn:</strong> Full screen</li>
                        <li><strong>Alt + PrtScn:</strong> Active window</li>
                    </ul>
                </div>
            </div>
        `,
        'word-counter': `
            <h2>📝 Word Counter</h2>
            <textarea id="word-counter-text" placeholder="Type or paste your text here..." style="width: 100%; height: 200px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;"></textarea>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 1rem; text-align: center;">
                <div class="glass-card" style="padding: 1rem;">
                    <div id="wc-words" style="font-size: 1.5rem; font-weight: bold; color: #fbbf24;">0</div>
                    <div>Words</div>
                </div>
                <div class="glass-card" style="padding: 1rem;">
                    <div id="wc-chars" style="font-size: 1.5rem; font-weight: bold; color: #fbbf24;">0</div>
                    <div>Chars</div>
                </div>
                <div class="glass-card" style="padding: 1rem;">
                    <div id="wc-sentences" style="font-size: 1.5rem; font-weight: bold; color: #fbbf24;">0</div>
                    <div>Sentences</div>
                </div>
                <div class="glass-card" style="padding: 1rem;">
                    <div id="wc-paragraphs" style="font-size: 1.5rem; font-weight: bold; color: #fbbf24;">0</div>
                    <div>Paragraphs</div>
                </div>
                <div class="glass-card" style="padding: 1rem;">
                    <div id="wc-read-time" style="font-size: 1.5rem; font-weight: bold; color: #fbbf24;">0 min</div>
                    <div>Read Time</div>
                </div>
            </div>
        `,
        'todo-list': `
            <h2>✅ Todo List</h2>
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                <input type="text" id="todo-input" placeholder="Add a new task..." style="flex: 1;">
                <button id="todo-add-btn">Add</button>
            </div>
            <ul id="todo-list" style="list-style: none; padding: 0;">
                <!-- Todos will appear here -->
            </ul>
            <style>
                .todo-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: rgba(255,255,255,0.1); margin-bottom: 0.5rem; border-radius: 8px; }
                .todo-item.completed .todo-text { text-decoration: line-through; opacity: 0.6; }
                .todo-text { cursor: pointer; flex: 1; }
                .todo-delete { background: transparent !important; color: #ff6b6b !important; padding: 0.25rem !important; margin-left: 0.5rem; }
            </style>
        `,
        'habit-tracker': `
            <h2>📅 Habit Tracker</h2>
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                <input type="text" id="habit-input" placeholder="New habit (e.g., Read 20 mins)..." style="flex: 1;">
                <button id="habit-add-btn">Add Habit</button>
            </div>
            <div id="habit-grid" style="display: grid; gap: 1rem;">
                <!-- Habits will appear here -->
            </div>
            <style>
                .habit-card { padding: 1rem; }
                .habit-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
                .habit-name { font-weight: bold; font-size: 1.1rem; }
                .habit-streak { color: #fbbf24; margin-bottom: 0.5rem; }
                .habit-check-btn { width: 100%; }
                .habit-check-btn.done { background: #10b981 !important; }
                .habit-delete { background: transparent !important; padding: 0 !important; }
            </style>
        `,
        'flashcards': `
            <h2>🗂️ Flashcards</h2>
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                <select id="flashcard-deck-select" onchange="loadDeck()" style="flex: 1;"></select>
                <button onclick="createNewDeck()">New Deck</button>
                <button onclick="addCardToDeck()">+ Card</button>
            </div>
            
            <div id="flashcard-controls" style="display: none; flex-direction: column; align-items: center; gap: 1rem;">
                <div id="flashcard-card" onclick="flipCard()" style="width: 100%; min-height: 200px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 16px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; perspective: 1000px; padding: 2rem; text-align: center;">
                    <div id="card-content" style="font-size: 1.5rem; font-weight: bold;">Select a deck to start</div>
                    <div id="card-side" style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.7;">Front</div>
                </div>
                
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <button onclick="prevCard()">⬅️ Prev</button>
                    <span id="card-counter">0 / 0</span>
                    <button onclick="nextCard()">Next ➡️</button>
                </div>
            </div>
            <style>
                .flipped { background: rgba(102, 126, 234, 0.3) !important; transform: rotateX(0deg); }
            </style>
        `,

        // CREATIVE TOOLS
        'gradient-generator': `
            <h2>🌈 Gradient Generator</h2>
            <div style="padding: 1rem;">
                <div id="grad-preview" style="width: 100%; height: 150px; border-radius: 12px; margin-bottom: 1rem; border: 2px solid rgba(255,255,255,0.2);"></div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <input type="color" id="grad-color1" value="#667eea" style="width: 100%; height: 50px;">
                    <input type="color" id="grad-color2" value="#764ba2" style="width: 100%; height: 50px;">
                </div>
                <input type="range" id="grad-angle" min="0" max="360" value="135" style="width: 100%; margin-bottom: 1rem;">
                <div style="display: flex; gap: 0.5rem;">
                    <input type="text" id="grad-css" readonly style="flex: 1; padding: 0.5rem; border-radius: 4px; border: none;">
                    <button onclick="copyGradient()">Copy</button>
                    <button onclick="randomizeGradient()">🎲</button>
                </div>
            </div>
        `,
        'palette-generator': `
            <h2>🎨 Palette Generator</h2>
            <div style="padding: 1rem; text-align: center;">
                <div id="palette-container" style="display: flex; height: 150px; border-radius: 12px; overflow: hidden; margin-bottom: 1rem;">
                    <!-- Colors will appear here -->
                </div>
                <button onclick="generatePalette()" style="padding: 1rem 2rem; font-size: 1.1rem;">Generate New Palette 🎲</button>
                <p style="margin-top: 1rem; opacity: 0.7;">Click a color to copy HEX code</p>
                <style>
                    .palette-color { flex: 1; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: flex 0.3s; }
                    .palette-color:hover { flex: 1.5; }
                    .color-code { background: rgba(0,0,0,0.5); padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; opacity: 0; transition: opacity 0.3s; }
                    .palette-color:hover .color-code { opacity: 1; }
                </style>
            </div>
        `,
        'ascii-art': `
            <h2>💻 ASCII Art</h2>
            <div style="padding: 1rem;">
                <input type="text" id="ascii-text-input" placeholder="Enter text..." style="width: 100%; padding: 0.5rem; margin-bottom: 0.5rem;">
                <select id="ascii-font" style="width: 100%; padding: 0.5rem; margin-bottom: 1rem;">
                    <option value="Big">Big Text</option>
                    <option value="Binary">Binary</option>
                    <option value="Box">Boxed</option>
                </select>
                <button onclick="generateAscii()" style="width: 100%; margin-bottom: 1rem;">Generate</button>
                <pre id="ascii-output" style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; overflow-x: auto; font-family: monospace; min-height: 100px; color: #fbbf24;"></pre>
            </div>
        `,

        // DEV TOOLS
        'markdown-preview': `
            <h2>📝 Markdown Preview</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; height: 400px;">
                <textarea id="md-input" placeholder="# Hello World\n\nType markdown here..." style="width: 100%; height: 100%; padding: 1rem; background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; resize: none;"></textarea>
                <div id="md-preview" style="width: 100%; height: 100%; padding: 1rem; background: rgba(255,255,255,0.9); color: #333; border-radius: 8px; overflow-y: auto;"></div>
            </div>
        `,
        'base64': `
            <h2>🔢 Base64 Converter</h2>
            <div style="padding: 1rem;">
                <textarea id="b64-input" placeholder="Input text..." style="width: 100%; height: 100px; padding: 0.5rem; margin-bottom: 1rem;"></textarea>
                <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                    <button onclick="encodeBase64()" style="flex: 1;">Encode</button>
                    <button onclick="decodeBase64()" style="flex: 1;">Decode</button>
                </div>
                <textarea id="b64-output" readonly placeholder="Output..." style="width: 100%; height: 100px; padding: 0.5rem; background: rgba(0,0,0,0.2); color: #fbbf24;"></textarea>
            </div>
        `,
        'password-generator': `
            <h2>🔐 Password Generator</h2>
            <div style="padding: 1rem; text-align: center;">
                <input type="text" id="pwd-output" readonly style="width: 100%; padding: 1rem; font-size: 1.5rem; text-align: center; margin-bottom: 1rem; background: rgba(0,0,0,0.3); color: #fbbf24; border-radius: 8px;">
                <button onclick="copyPassword()" style="margin-bottom: 2rem;">Copy Password</button>
                
                <div style="text-align: left; max-width: 300px; margin: 0 auto;">
                    <div style="margin-bottom: 1rem;">
                        <label>Length: <span id="pwd-length-val">12</span></label>
                        <input type="range" id="pwd-length" min="6" max="32" value="12" style="width: 100%;">
                    </div>
                    <div style="margin-bottom: 0.5rem;"><label><input type="checkbox" id="pwd-caps" checked> Uppercase (A-Z)</label></div>
                    <div style="margin-bottom: 0.5rem;"><label><input type="checkbox" id="pwd-nums" checked> Numbers (0-9)</label></div>
                    <div style="margin-bottom: 1rem;"><label><input type="checkbox" id="pwd-syms" checked> Symbols (!@#$)</label></div>
                    <button onclick="generatePassword()" style="width: 100%;">Generate New</button>
                </div>
            </div>
        `,
        'lorem-ipsum': `
            <h2>📄 Lorem Ipsum</h2>
            <div style="padding: 1rem;">
                <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                    <input type="number" id="lorem-count" value="3" min="1" max="50" style="width: 80px;">
                    <select id="lorem-type" style="flex: 1;">
                        <option value="paragraphs">Paragraphs</option>
                        <option value="sentences">Sentences</option>
                        <option value="words">Words</option>
                    </select>
                    <button onclick="generateLorem()">Generate</button>
                </div>
                <textarea id="lorem-output" readonly style="width: 100%; height: 200px; padding: 1rem; background: rgba(255,255,255,0.1); color: white; border-radius: 8px;"></textarea>
                <button onclick="copyLorem()" style="width: 100%; margin-top: 1rem;">Copy Text</button>
            </div>
        `,

        // GAME TOOLS
        'dice-roller': `
            <h2>🎲 Dice Roller</h2>
            <div style="padding: 1rem; text-align: center;">
                <div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 2rem;">
                    <select id="dice-count" style="padding: 0.5rem; border-radius: 8px;">
                        <option value="1">1 Die</option>
                        <option value="2">2 Dice</option>
                        <option value="3">3 Dice</option>
                        <option value="4">4 Dice</option>
                        <option value="5">5 Dice</option>
                    </select>
                    <select id="dice-type" style="padding: 0.5rem; border-radius: 8px;">
                        <option value="4">d4</option>
                        <option value="6" selected>d6</option>
                        <option value="8">d8</option>
                        <option value="10">d10</option>
                        <option value="12">d12</option>
                        <option value="20">d20</option>
                    </select>
                </div>
                <button onclick="rollDice()" style="padding: 1rem 3rem; font-size: 1.2rem; margin-bottom: 2rem;">ROLL!</button>
                <div id="dice-result" style="min-height: 100px;"></div>
                <div style="margin-top: 1rem; text-align: left;">
                    <h4>History:</h4>
                    <ul id="dice-history" style="font-size: 0.9rem; opacity: 0.7;"></ul>
                </div>
            </div>
        `,
        'magic-8-ball': `
            <h2>🎱 Magic 8 Ball</h2>
            <div style="padding: 1rem; text-align: center;">
                <div id="magic-8-ball" onclick="shakeBall()" style="width: 200px; height: 200px; background: radial-gradient(circle at 30% 30%, #444, #000); border-radius: 50%; margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 10px 20px rgba(0,0,0,0.5);">
                    <div style="width: 100px; height: 100px; background: radial-gradient(circle at 50% 50%, #1a1a2e, #16213e); border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 1rem; border: 4px solid #333;">
                        <span id="magic-answer" style="color: #667eea; font-weight: bold; font-size: 0.9rem; transition: opacity 0.5s;">Click to Shake</span>
                    </div>
                </div>
                <p>Concentrate on your question and click the ball!</p>
                <style>
                    @keyframes shake {
                        0% { transform: translate(1px, 1px) rotate(0deg); }
                        10% { transform: translate(-1px, -2px) rotate(-1deg); }
                        20% { transform: translate(-3px, 0px) rotate(1deg); }
                        30% { transform: translate(3px, 2px) rotate(0deg); }
                        40% { transform: translate(1px, -1px) rotate(1deg); }
                        50% { transform: translate(-1px, 2px) rotate(-1deg); }
                        60% { transform: translate(-3px, 1px) rotate(0deg); }
                        70% { transform: translate(3px, 1px) rotate(-1deg); }
                        80% { transform: translate(-1px, -1px) rotate(1deg); }
                        90% { transform: translate(1px, 2px) rotate(0deg); }
                        100% { transform: translate(1px, -2px) rotate(-1deg); }
                    }
                    .shaking { animation: shake 0.5s; }
                </style>
            </div>
        `,
        'quick-maths': `
            <h2>🧮 Quick Maths</h2>
            <div style="padding: 1rem; text-align: center;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 1.2rem;">
                    <div>Score: <span id="math-score" style="color: #fbbf24; font-weight: bold;">0</span></div>
                    <div>Time: <span id="math-timer" style="color: #fbbf24; font-weight: bold;">30</span>s</div>
                </div>
                
                <button id="math-start-btn" onclick="startMathGame()" style="padding: 2rem; font-size: 1.5rem; width: 100%;">Start Game</button>
                
                <div id="math-game-area" style="display: none;">
                    <div id="math-problem" style="font-size: 3rem; margin: 2rem 0; font-weight: bold;"></div>
                    <input type="number" id="math-input" style="font-size: 2rem; width: 150px; text-align: center; padding: 0.5rem; border-radius: 12px;">
                    <p style="margin-top: 1rem; opacity: 0.7;">Press Enter to submit</p>
                </div>
                <style>
                    .shake { animation: shake 0.5s; border-color: #ff6b6b !important; }
                </style>
            </div>
        `,
        'typing-test': `
            <h2>⌨️ Typing Speed Test</h2>
            <div style="padding: 1rem;">
                <div style="display: flex; justify-content: space-around; margin-bottom: 1rem; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px;">
                    <div>WPM: <span id="typing-wpm" style="color: #fbbf24; font-weight: bold;">0</span></div>
                    <div>Accuracy: <span id="typing-acc" style="color: #fbbf24; font-weight: bold;">100%</span></div>
                    <div>Time: <span id="typing-timer">0s</span></div>
                </div>
                
                <div id="typing-text" style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 1rem; min-height: 100px; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 8px;"></div>
                
                <textarea id="typing-input" placeholder="Start typing here..." style="width: 100%; height: 100px; padding: 1rem; font-size: 1.2rem;"></textarea>
                
                <button id="typing-restart" onclick="startTypingTest()" style="width: 100%; margin-top: 1rem;">Restart Test</button>
                
                <style>
                    .correct { color: #10b981; }
                    .incorrect { color: #ff6b6b; text-decoration: underline; }
                </style>
            </div>
        `,

        // LANGUAGE & SECURITY TOOLS
        'password-strength': `
            <h2>🛡️ Password Strength</h2>
            <div style="padding: 1rem;">
                <input type="password" id="pstrength-input" placeholder="Type a password..." style="width: 100%; padding: 1rem; margin-bottom: 1rem; border-radius: 8px;">
                <div style="height: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden; margin-bottom: 0.5rem;">
                    <div id="pstrength-meter" style="height: 100%; width: 0%; background: transparent; transition: all 0.3s;"></div>
                </div>
                <div id="pstrength-text" style="text-align: right; font-weight: bold;"></div>
            </div>
        `,
        'hash-generator': `
            <h2>#️⃣ Hash Generator</h2>
            <div style="padding: 1rem;">
                <input type="text" id="hash-input" placeholder="Input text..." style="width: 100%; padding: 0.5rem; margin-bottom: 1rem;">
                <button onclick="generateHashes()" style="width: 100%; margin-bottom: 1.5rem;">Generate Hashes</button>
                
                <label>SHA-1:</label>
                <input type="text" id="hash-sha1" readonly style="width: 100%; padding: 0.5rem; margin-bottom: 1rem; background: rgba(0,0,0,0.2); color: #fbbf24;">
                
                <label>SHA-256:</label>
                <input type="text" id="hash-sha256" readonly style="width: 100%; padding: 0.5rem; margin-bottom: 1rem; background: rgba(0,0,0,0.2); color: #fbbf24;">
                
                <label>MD5 (Not supported natively):</label>
                <input type="text" id="hash-md5" readonly style="width: 100%; padding: 0.5rem; background: rgba(0,0,0,0.2); color: #fbbf24;">
            </div>
        `,
        'dictionary': `
            <h2>📖 Dictionary</h2>
            <div style="padding: 1rem;">
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                    <input type="text" id="dict-input" placeholder="Enter a word..." style="flex: 1; padding: 0.5rem;">
                    <button onclick="lookupWord()">Search</button>
                </div>
                <div id="dict-result" style="max-height: 300px; overflow-y: auto; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 8px;"></div>
            </div>
        `,
        'translator': `
            <h2>🗣️ Translator</h2>
            <div style="padding: 1rem;">
                <select id="trans-pair" style="width: 100%; padding: 0.5rem; margin-bottom: 1rem;">
                    <option value="en|hu">English -> Hungarian</option>
                    <option value="hu|en">Hungarian -> English</option>
                    <option value="en|de">English -> German</option>
                    <option value="de|en">German -> English</option>
                    <option value="en|es">English -> Spanish</option>
                    <option value="es|en">Spanish -> English</option>
                    <option value="en|fr">English -> French</option>
                    <option value="fr|en">French -> English</option>
                </select>
                <textarea id="trans-input" placeholder="Type text to translate..." style="width: 100%; height: 100px; padding: 0.5rem; margin-bottom: 1rem;"></textarea>
                <button onclick="translateText()" style="width: 100%; margin-bottom: 1rem;">Translate</button>
                <textarea id="trans-output" readonly placeholder="Translation will appear here..." style="width: 100%; height: 100px; padding: 0.5rem; background: rgba(0,0,0,0.2); color: #fbbf24;"></textarea>
            </div>
        `
    };

    return interfaces[tool] || '<p>Tool interface coming soon!</p>';
}

function initializeTool(tool) {
    switch (tool) {
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
        case 'word-counter':
            initWordCounter();
            break;
        case 'todo-list':
            initTodoList();
            break;
        case 'habit-tracker':
            initHabitTracker();
            break;
        case 'flashcards':
            initFlashcards();
            break;
        case 'gradient-generator':
            initGradientGenerator();
            break;
        case 'palette-generator':
            initPaletteGenerator();
            break;
        case 'ascii-art':
            initAsciiArt();
            break;
        case 'markdown-preview':
            initMarkdownPreview();
            break;
        case 'base64':
            initBase64();
            break;
        case 'password-generator':
            initPasswordGenerator();
            break;
        case 'lorem-ipsum':
            initLoremIpsum();
            break;
        case 'dice-roller':
            initDiceRoller();
            break;
        case 'magic-8-ball':
            initMagic8Ball();
            break;
        case 'quick-maths':
            initQuickMaths();
            break;
        case 'typing-test':
            initTypingTest();
            break;
        case 'password-strength':
            initPasswordStrength();
            break;
        case 'hash-generator':
            initHashGenerator();
            break;
        case 'dictionary':
            initDictionary();
            break;
        case 'translator':
            initTranslator();
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

    // Initialize Search and Favorites
    initSearch();
    initFavorites();
}



// ==================== GLOBAL SEARCH ====================
function initSearch() {
    const searchInput = document.getElementById('global-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const allItems = document.querySelectorAll('.tool-card, .link-card');

        allItems.forEach(item => {
            const text = item.innerText.toLowerCase();
            const parentSection = item.closest('.folder-content, .tool-grid');

            if (text.includes(query)) {
                item.style.display = 'flex';
                // Automatically expand folder if item matches
                if (query.length > 0 && parentSection && parentSection.classList.contains('folder-content')) {
                    parentSection.classList.remove('collapsed');
                    parentSection.previousElementSibling.classList.remove('collapsed');
                }
            } else {
                item.style.display = 'none';
            }
        });

        // Hide empty sections
        document.querySelectorAll('.folder-section, .section').forEach(section => {
            const visibleItems = section.querySelectorAll('.tool-card[style="display: flex;"], .link-card[style="display: flex;"]');
            if (query.length > 0 && visibleItems.length === 0) {
                section.style.display = 'none';
            } else {
                section.style.display = 'block';
            }
        });
    });
}

// ==================== FAVORITES SYSTEM ====================
function initFavorites() {
    // Load favorites from localStorage
    let favorites = JSON.parse(localStorage.getItem('sek_favorites')) || [];
    const favoritesSection = document.getElementById('favorites-section');
    const favoritesGrid = document.getElementById('favorites-grid');

    // Add context menu to all tools and links
    document.querySelectorAll('.tool-card, .link-card').forEach(item => {
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            toggleFavorite(item);
        });
    });

    function toggleFavorite(item) {
        const name = item.querySelector('.tool-name, .link-name').innerText;
        const type = item.classList.contains('tool-card') ? 'tool' : 'link';
        const data = type === 'tool' ? item.dataset.tool : item.href;
        const icon = item.querySelector('.tool-icon, .link-icon').innerText;

        const index = favorites.findIndex(f => f.name === name);

        if (index === -1) {
            // Add to favorites
            favorites.push({ name, type, data, icon });
            showNotification(`Added to Favorites: ${name}`);
        } else {
            // Remove from favorites
            favorites.splice(index, 1);
            showNotification(`Removed from Favorites: ${name}`);
        }

        localStorage.setItem('sek_favorites', JSON.stringify(favorites));
        renderFavorites();
    }

    function renderFavorites() {
        if (favorites.length === 0) {
            favoritesSection.style.display = 'none';
            return;
        }

        favoritesSection.style.display = 'block';
        favoritesGrid.innerHTML = '';

        favorites.forEach(fav => {
            const el = document.createElement(fav.type === 'tool' ? 'button' : 'a');
            el.className = `${fav.type}-card glass-card`;

            if (fav.type === 'tool') {
                el.dataset.tool = fav.data;
                el.onclick = () => openTool(fav.data);
            } else {
                el.href = fav.data;
                el.target = '_blank';
            }

            el.innerHTML = `
                <span class="${fav.type}-icon">${fav.icon}</span>
                <span class="${fav.type}-name">${fav.name}</span>
            `;

            // Allow removing from favorites via context menu
            el.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                toggleFavorite(el);
            });

            favoritesGrid.appendChild(el);
        });
    }

    // Initial render
    renderFavorites();
}

function showNotification(msg) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.innerText = msg;
    document.body.appendChild(notif);

    setTimeout(() => notif.classList.add('show'), 100);
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}

// Tool implementations will be loaded from separate files
// This file contains the core functionality and modal system
