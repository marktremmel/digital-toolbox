// ==================== METRONOME ====================
let metronomeInterval = null;
let metronomeBPM = 120;

function initializeMetronome() {
    const slider = document.getElementById('metronome-slider');
    const bpmDisplay = document.getElementById('metronome-bpm');

    slider.addEventListener('input', (e) => {
        metronomeBPM = parseInt(e.target.value);
        bpmDisplay.textContent = metronomeBPM;
    });
}

function startMetronome() {
    if (metronomeInterval) return;

    const interval = (60 / metronomeBPM) * 1000;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    metronomeInterval = setInterval(() => {
        // Visual beat
        const beat = document.getElementById('metronome-beat');
        if (beat) {
            beat.style.opacity = '1';
            beat.style.transform = 'scale(1.2)';
            setTimeout(() => {
                beat.style.opacity = '0.3';
                beat.style.transform = 'scale(1)';
            }, 100);
        }

        // Audio click
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.3;

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    }, interval);

    window.activeInterval = metronomeInterval;
}

function stopMetronome() {
    if (metronomeInterval) {
        clearInterval(metronomeInterval);
        metronomeInterval = null;
        window.activeInterval = null;
    }
}

// ==================== MUSICAL NOTES ====================
function initializeNotes() {
    // Notes are ready to play on button click
}

function playNote(noteName, frequency) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;

    oscillator.start(audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    oscillator.stop(audioContext.currentTime + 1);
}

// ==================== FLASHLIGHT ====================
let flashlightOn = false;
let flashlightBrightness = 100;

function toggleFlashlight() {
    flashlightOn = !flashlightOn;
    const btn = document.getElementById('flashlight-btn');
    const modal = document.querySelector('.modal-content');

    if (flashlightOn) {
        modal.style.background = `rgba(255, 255, 255, ${flashlightBrightness / 100})`;
        btn.textContent = '💡';
    } else {
        modal.style.background = '';
        btn.textContent = '🔦';
    }
}

function updateBrightness(value) {
    flashlightBrightness = parseInt(value);
    if (flashlightOn) {
        const modal = document.querySelector('.modal-content');
        modal.style.background = `rgba(255, 255, 255, ${flashlightBrightness / 100})`;
    }
}

// ==================== RULER ====================
function initializeRuler() {
    const canvas = document.getElementById('ruler-canvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let startX, startY;

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        document.getElementById('ruler-measurement').textContent = `Distance: ${Math.round(distance)} pixels`;
    });

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });
}

// ==================== TIMER / STOPWATCH / ALARM ====================
let timerMode = 'timer';
let timerInterval = null;
let timerSeconds = 0;

function switchTimerMode(mode) {
    timerMode = mode;
    const btns = document.querySelectorAll('.timer-mode-btn');
    btns.forEach(btn => {
        btn.style.background = btn.dataset.mode === mode ? '#667eea' : 'rgba(255,255,255,0.2)';
        btn.style.color = btn.dataset.mode === mode ? 'white' : '';
    });

    const interface = document.getElementById('timer-interface');

    if (mode === 'timer') {
        interface.innerHTML = `
            <div style="text-align: center;">
                <div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 2rem;">
                    <input type="number" id="timer-hours" placeholder="HH" min="0" max="23" style="width: 60px; padding: 0.5rem;" value="0">
                    <span style="font-size: 2rem;">:</span>
                    <input type="number" id="timer-minutes" placeholder="MM" min="0" max="59" style="width: 60px; padding: 0.5rem;" value="0">
                    <span style="font-size: 2rem;">:</span>
                    <input type="number" id="timer-seconds" placeholder="SS" min="0" max="59" style="width: 60px; padding: 0.5rem;" value="0">
                </div>
                <div id="timer-display" style="font-size: 3rem; margin-bottom: 2rem;">00:00:00</div>
                <button onclick="startTimer()" style="padding: 1rem 2rem; margin: 0.5rem;">Start</button>
                <button onclick="stopTimer()" style="padding: 1rem 2rem; margin: 0.5rem;">Stop</button>
                <button onclick="resetTimer()" style="padding: 1rem 2rem; margin: 0.5rem;">Reset</button>
            </div>
        `;
    } else if (mode === 'stopwatch') {
        interface.innerHTML = `
            <div style="text-align: center;">
                <div id="stopwatch-display" style="font-size: 3rem; margin-bottom: 2rem;">00:00:00</div>
                <button onclick="startStopwatch()" style="padding: 1rem 2rem; margin: 0.5rem;">Start</button>
                <button onclick="stopStopwatch()" style="padding: 1rem 2rem; margin: 0.5rem;">Stop</button>
                <button onclick="resetStopwatch()" style="padding: 1rem 2rem; margin: 0.5rem;">Reset</button>
            </div>
        `;
    } else if (mode === 'alarm') {
        interface.innerHTML = `
            <div style="text-align: center;">
                <div style="margin-bottom: 2rem;">
                    <input type="time" id="alarm-time" style="padding: 1rem; font-size: 1.5rem;">
                </div>
                <button onclick="setAlarm()" style="padding: 1rem 2rem;">Set Alarm</button>
                <div id="alarm-status" style="margin-top: 2rem; font-size: 1.2rem;"></div>
            </div>
        `;
    }
}

function startTimer() {
    const hours = parseInt(document.getElementById('timer-hours').value) || 0;
    const minutes = parseInt(document.getElementById('timer-minutes').value) || 0;
    const seconds = parseInt(document.getElementById('timer-seconds').value) || 0;

    timerSeconds = hours * 3600 + minutes * 60 + seconds;

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (timerSeconds <= 0) {
            stopTimer();
            showNotification('Timer finished!');
            return;
        }

        timerSeconds--;
        updateTimerDisplay();
    }, 1000);

    window.activeInterval = timerInterval;
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    timerSeconds = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const hours = Math.floor(timerSeconds / 3600);
    const minutes = Math.floor((timerSeconds % 3600) / 60);
    const seconds = timerSeconds % 60;

    const display = document.getElementById('timer-display');
    if (display) {
        display.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

function startStopwatch() {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        timerSeconds++;
        const hours = Math.floor(timerSeconds / 3600);
        const minutes = Math.floor((timerSeconds % 3600) / 60);
        const seconds = timerSeconds % 60;

        document.getElementById('stopwatch-display').textContent =
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);

    window.activeInterval = timerInterval;
}

function stopStopwatch() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetStopwatch() {
    stopStopwatch();
    timerSeconds = 0;
    document.getElementById('stopwatch-display').textContent = '00:00:00';
}

function setAlarm() {
    const alarmTime = document.getElementById('alarm-time').value;
    if (!alarmTime) return;

    const [hours, minutes] = alarmTime.split(':');
    const alarmDate = new Date();
    alarmDate.setHours(parseInt(hours), parseInt(minutes), 0);

    const now = new Date();
    let timeUntilAlarm = alarmDate - now;

    if (timeUntilAlarm < 0) {
        timeUntilAlarm += 24 * 60 * 60 * 1000; // Add 24 hours
    }

    const status = document.getElementById('alarm-status');
    status.textContent = `Alarm set for ${alarmTime}`;

    setTimeout(() => {
        showNotification('⏰ Alarm!');
        status.textContent = 'Alarm ringing!';
    }, timeUntilAlarm);
}

// ==================== POMODORO ====================
let pomodoroInterval = null;
let pomodoroSeconds = 25 * 60;
let pomodoroMode = 'work';
let pomodoroSession = 0;

function startPomodoro() {
    if (pomodoroInterval) return;

    pomodoroInterval = setInterval(() => {
        pomodoroSeconds--;

        if (pomodoroSeconds <= 0) {
            if (pomodoroMode === 'work') {
                pomodoroMode = 'break';
                pomodoroSeconds = parseInt(document.getElementById('break-time').value) * 60;
                pomodoroSession++;
                showNotification('Work session complete! Take a break.');
            } else {
                pomodoroMode = 'work';
                pomodoroSeconds = parseInt(document.getElementById('work-time').value) * 60;
                showNotification('Break over! Back to work.');
            }
            updatePomodoroSession();
        }

        updatePomodoroDisplay();
    }, 1000);

    window.activeInterval = pomodoroInterval;
}

function pausePomodoro() {
    if (pomodoroInterval) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
    }
}

function resetPomodoro() {
    pausePomodoro();
    pomodoroMode = 'work';
    pomodoroSeconds = parseInt(document.getElementById('work-time').value) * 60;
    pomodoroSession = 0;
    updatePomodoroDisplay();
    updatePomodoroSession();
}

function updatePomodoroDisplay() {
    const minutes = Math.floor(pomodoroSeconds / 60);
    const seconds = pomodoroSeconds % 60;
    document.getElementById('pomodoro-display').textContent =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updatePomodoroSession() {
    document.getElementById('pomodoro-session').textContent =
        `Session ${pomodoroSession} | ${pomodoroMode === 'work' ? '💼 Work' : '☕ Break'}`;
}

// ==================== CALCULATOR ====================
let calcMode = 'basic';
let calcExpression = '';

function switchCalcMode(mode) {
    calcMode = mode;
    const btns = document.querySelectorAll('.calc-mode-btn');
    btns.forEach(btn => {
        btn.style.background = btn.textContent.toLowerCase() === mode ? '#667eea' : 'rgba(255,255,255,0.2)';
        btn.style.color = btn.textContent.toLowerCase() === mode ? 'white' : '';
    });

    renderCalculator();
}

function renderCalculator() {
    const container = document.getElementById('calc-buttons');

    if (calcMode === 'basic') {
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem;">
                ${['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map(btn =>
            `<button onclick="calcInput('${btn}')" style="padding: 1.5rem; font-size: 1.5rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); cursor: pointer;">${btn}</button>`
        ).join('')}
                <button onclick="calcClear()" style="padding: 1.5rem; font-size: 1.5rem; grid-column: span 2; border-radius: 8px; background: #f093fb; color: white; border: none; cursor: pointer;">C</button>
                <button onclick="calcBackspace()" style="padding: 1.5rem; font-size: 1.5rem; grid-column: span 2; border-radius: 8px; background: #764ba2; color: white; border: none; cursor: pointer;">⌫</button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem; font-size: 0.9rem;">
                ${['sin', 'cos', 'tan', '√', 'x²', '7', '8', '9', '/', '(', '4', '5', '6', '*', ')', '1', '2', '3', '-', 'π', '0', '.', '=', '+', 'e'].map(btn =>
            `<button onclick="calcInput('${btn}')" style="padding: 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); cursor: pointer;">${btn}</button>`
        ).join('')}
                <button onclick="calcClear()" style="padding: 1rem; grid-column: span 3; border-radius: 8px; background: #f093fb; color: white; border: none; cursor: pointer;">Clear</button>
                <button onclick="calcBackspace()" style="padding: 1rem; grid-column: span 2; border-radius: 8px; background: #764ba2; color: white; border: none; cursor: pointer;">⌫</button>
            </div>
        `;
    }
}

function calcInput(value) {
    const display = document.getElementById('calc-display');

    if (value === '=') {
        try {
            let expr = calcExpression
                .replace(/π/g, 'Math.PI')
                .replace(/e/g, 'Math.E')
                .replace(/sin/g, 'Math.sin')
                .replace(/cos/g, 'Math.cos')
                .replace(/tan/g, 'Math.tan')
                .replace(/√/g, 'Math.sqrt')
                .replace(/x²/g, '**2');

            const result = eval(expr);
            display.value = result;
            calcExpression = String(result);
        } catch (e) {
            display.value = 'Error';
            calcExpression = '';
        }
    } else {
        calcExpression += value;
        display.value = calcExpression;
    }
}

function calcClear() {
    calcExpression = '';
    document.getElementById('calc-display').value = '';
}

function calcBackspace() {
    calcExpression = calcExpression.slice(0, -1);
    document.getElementById('calc-display').value = calcExpression;
}

// ==================== COLOR PICKER ====================
function initializeColorPicker() {
    const colorInput = document.getElementById('color-input');

    colorInput.addEventListener('input', (e) => {
        const hex = e.target.value;
        updateColorInfo(hex);
    });

    updateColorInfo('#667eea');
}

function updateColorInfo(hex) {
    document.getElementById('color-hex').textContent = hex;

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    document.getElementById('color-rgb').textContent = `rgb(${r}, ${g}, ${b})`;

    const h = rgbToHsl(r, g, b)[0];
    const s = rgbToHsl(r, g, b)[1];
    const l = rgbToHsl(r, g, b)[2];

    document.getElementById('color-hsl').textContent = `hsl(${h}, ${s}%, ${l}%)`;
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function copyColor() {
    const hex = document.getElementById('color-hex').textContent;
    navigator.clipboard.writeText(hex);
    alert('Color copied to clipboard!');
}

// ==================== UNIT CONVERTER ====================
const unitData = {
    length: {
        m: 1,
        km: 0.001,
        cm: 100,
        mm: 1000,
        mi: 0.000621371,
        yd: 1.09361,
        ft: 3.28084,
        in: 39.3701
    },
    weight: {
        kg: 1,
        g: 1000,
        mg: 1000000,
        lb: 2.20462,
        oz: 35.274
    },
    temperature: {}, // Special handling
    volume: {
        l: 1,
        ml: 1000,
        gal: 0.264172,
        qt: 1.05669,
        pt: 2.11338,
        cup: 4.22675
    }
};

function updateUnitOptions() {
    const category = document.getElementById('unit-category').value;
    const fromUnit = document.getElementById('from-unit');
    const toUnit = document.getElementById('to-unit');

    const units = Object.keys(unitData[category] || {});

    fromUnit.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');
    toUnit.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');

    if (category === 'temperature') {
        fromUnit.innerHTML = '<option value="C">°C</option><option value="F">°F</option><option value="K">K</option>';
        toUnit.innerHTML = '<option value="C">°C</option><option value="F">°F</option><option value="K">K</option>';
    }

    convertUnits();
}

function convertUnits() {
    const category = document.getElementById('unit-category').value;
    const fromValue = parseFloat(document.getElementById('from-value').value) || 0;
    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;

    let result;

    if (category === 'temperature') {
        result = convertTemperature(fromValue, fromUnit, toUnit);
    } else {
        const baseValue = fromValue / unitData[category][fromUnit];
        result = baseValue * unitData[category][toUnit];
    }

    document.getElementById('to-value').value = result.toFixed(4);
}

function convertTemperature(value, from, to) {
    // Convert to Celsius first
    let celsius;
    if (from === 'C') celsius = value;
    else if (from === 'F') celsius = (value - 32) * 5 / 9;
    else if (from === 'K') celsius = value - 273.15;

    // Convert to target unit
    if (to === 'C') return celsius;
    else if (to === 'F') return celsius * 9 / 5 + 32;
    else if (to === 'K') return celsius + 273.15;
}

// ==================== QR CODE GENERATOR ====================
function generateQR() {
    const text = document.getElementById('qr-input').value;
    if (!text) return;

    const output = document.getElementById('qr-output');
    output.innerHTML = `
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}" 
            alt="QR Code" style="max-width: 100%; border-radius: 12px;">
        <div style="margin-top: 1rem;">
            <a href="https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(text)}" 
                download="qrcode.png" style="padding: 1rem 2rem; background: #667eea; color: white; text-decoration: none; border-radius: 12px; display: inline-block;">
                Download QR Code
            </a>
        </div>
    `;
}

// ==================== EXIF REMOVER ====================
function initializeExifRemover() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('exif-input');

    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#667eea';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            removeExif(file);
        }
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) removeExif(file);
    });
}

function removeExif(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                document.getElementById('exif-output').innerHTML = `
                    <p>✓ EXIF data removed!</p>
                    <img src="${url}" style="max-width: 400px; border-radius: 12px; margin: 1rem 0;">
                    <br>
                    <a href="${url}" download="no-exif-${file.name}" style="padding: 1rem 2rem; background: #667eea; color: white; text-decoration: none; border-radius: 12px; display: inline-block;">
                        Download Clean Image
                    </a>
                `;
            });
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

// ==================== REVERSE IMAGE SEARCH ====================
let reverseImageData = null;

function initializeReverseSearch() {
    const dropZone = document.getElementById('reverse-drop-zone');
    const fileInput = document.getElementById('reverse-input');

    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#667eea';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            prepareReverseSearch(file);
        }
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) prepareReverseSearch(file);
    });
}

function prepareReverseSearch(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        reverseImageData = e.target.result;
        document.getElementById('reverse-preview').innerHTML = `
            <img src="${reverseImageData}" style="max-width: 300px; border-radius: 12px;">
        `;
        document.getElementById('reverse-services').style.display = 'block';
    };

    reader.readAsDataURL(file);
}

function reverseSearch(service) {
    if (!reverseImageData) return;

    // Note: Most services require the image to be uploaded to a URL
    // This is a simplified version that opens the service

    const urls = {
        google: 'https://www.google.com/imghp?hl=en',
        tineye: 'https://tineye.com',
        yandex: 'https://yandex.com/images/',
        bing: 'https://www.bing.com/visualsearch'
    };

    window.open(urls[service], '_blank');
    alert('Please manually upload the image to the opened service.');
}

// ==================== STICKY NOTES ====================
function loadStickyNotes() {
    const container = document.getElementById('notes-container');
    const notes = JSON.parse(localStorage.getItem('stickyNotes') || '[]');

    container.innerHTML = notes.map((note, index) => `
        <div class="sticky-note" style="background: ${note.color}; padding: 1rem; border-radius: 12px; position: relative; min-height: 150px;">
            <textarea onblur="updateNote(${index}, this.value)" style="width: 100%; height: 120px; background: transparent; border: none; resize: none; font-family: inherit;">${note.text}</textarea>
            <button onclick="deleteNote(${index})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(255,0,0,0.5); border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer;">×</button>
        </div>
    `).join('');
}

function addStickyNote() {
    const notes = JSON.parse(localStorage.getItem('stickyNotes') || '[]');
    const colors = ['#FFD1DC', '#E0BBE4', '#D4F1F4', '#FFFACD', '#C1E1C1'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    notes.push({ text: '', color: randomColor });
    localStorage.setItem('stickyNotes', JSON.stringify(notes));
    loadStickyNotes();
}

function updateNote(index, text) {
    const notes = JSON.parse(localStorage.getItem('stickyNotes') || '[]');
    notes[index].text = text;
    localStorage.setItem('stickyNotes', JSON.stringify(notes));
}

function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem('stickyNotes') || '[]');
    notes.splice(index, 1);
    localStorage.setItem('stickyNotes', JSON.stringify(notes));
    loadStickyNotes();
}

// ==================== SOUNDBOARD ====================
function playSound(sound) {
    // Using Web Audio API to generate simple sounds
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different sounds
    switch (sound) {
        case 'applause':
            // White noise for applause
            const bufferSize = audioContext.sampleRate * 2;
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = audioContext.createBufferSource();
            noise.buffer = buffer;
            noise.connect(gainNode);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
            noise.start();
            noise.stop(audioContext.currentTime + 2);
            return;
        case 'crickets':
            oscillator.frequency.value = 4000;
            oscillator.type = 'square';
            break;
        case 'drumroll':
            oscillator.frequency.value = 200;
            oscillator.type = 'sawtooth';
            break;
        case 'tada':
            oscillator.frequency.value = 1000;
            oscillator.type = 'sine';
            break;
    }

    gainNode.gain.value = 0.3;
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
}

// ==================== NOTIFICATIONS ====================
function showNotification(message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('SEK Toolbox', { body: message });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('SEK Toolbox', { body: message });
            }
        });
    }

    // Fallback: alert
    alert(message);
}
