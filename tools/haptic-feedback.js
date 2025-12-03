// ==================== HAPTIC FEEDBACK SYSTEM ====================

const hapticState = {
    enabled: true,
    strength: 'medium', // light, medium, strong
    testInterval: null
};

// Vibration patterns (in milliseconds)
const hapticPatterns = {
    light: {
        click: 10,
        success: [10, 50, 10],
        error: [50, 50, 50],
        warning: [30, 30, 30]
    },
    medium: {
        click: 20,
        success: [20, 70, 20],
        error: [70, 70, 70],
        warning: [50, 50, 50]
    },
    strong: {
        click: 40,
        success: [40, 100, 40],
        error: [100, 100, 100],
        warning: [80, 80, 80]
    }
};

// ==================== INITIALIZATION ====================
function initHapticFeedback() {
    loadHapticSettings();
    attachHapticListeners();
}

function loadHapticSettings() {
    const savedEnabled = localStorage.getItem('sek_haptic_enabled');
    const savedStrength = localStorage.getItem('sek_haptic_strength');

    if (savedEnabled !== null) {
        hapticState.enabled = savedEnabled === 'true';
    }
    if (savedStrength) {
        hapticState.strength = savedStrength;
    }
}

// ==================== VIBRATION FUNCTIONS ====================
function vibrate(pattern) {
    if (!hapticState.enabled) return;
    if (!navigator.vibrate) {
        console.log('Vibration API not supported');
        return;
    }

    const currentPattern = typeof pattern === 'string'
        ? hapticPatterns[hapticState.strength][pattern]
        : pattern;

    navigator.vibrate(currentPattern);
}

function vibrateClick() {
    vibrate('click');
}

function vibrateSuccess() {
    vibrate('success');
}

function vibrateError() {
    vibrate('error');
}

function vibrateWarning() {
    vibrate('warning');
}

function vibrateCustom(duration) {
    if (!hapticState.enabled) return;
    if (!navigator.vibrate) return;
    navigator.vibrate(duration);
}

// Continuous vibration (buzz until stopped)
function startContinuousVibration() {
    if (!hapticState.enabled) return;
    if (!navigator.vibrate) return;

    // Pattern: vibrate for 500ms, pause for 100ms, repeat
    const pattern = [500, 100];
    navigator.vibrate(pattern);

    // Store interval for stopping
    hapticState.testInterval = setInterval(() => {
        navigator.vibrate(pattern);
    }, 600);
}

function stopContinuousVibration() {
    if (hapticState.testInterval) {
        clearInterval(hapticState.testInterval);
        hapticState.testInterval = null;
    }
    if (navigator.vibrate) {
        navigator.vibrate(0); // Stop vibration
    }
}

// ==================== EVENT LISTENERS ====================
function attachHapticListeners() {
    // Attach to all buttons
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            vibrateClick();
        }
    });

    // Attach to tool cards
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('tool-card') || e.target.closest('.tool-card')) {
            vibrate('success');
        }
    });
}

// ==================== SETTINGS ====================
function toggleHapticFeedback(enabled) {
    hapticState.enabled = enabled;
    localStorage.setItem('sek_haptic_enabled', enabled);
}

function setHapticStrength(strength) {
    if (['light', 'medium', 'strong'].includes(strength)) {
        hapticState.strength = strength;
        localStorage.setItem('sek_haptic_strength', strength);

        // Update UI
        updateHapticStrengthUI();
    }
}

function updateHapticStrengthUI() {
    document.querySelectorAll('.haptic-strength-btn').forEach(btn => {
        const btnStrength = btn.getAttribute('data-strength');
        if (btnStrength === hapticState.strength) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Test vibration
function testVibration() {
    if (!navigator.vibrate) {
        alert('Vibration API is not supported on this device/browser.');
        return;
    }
    vibrate('success');
}

// ==================== SETTINGS UI ====================
function getHapticSettingsUI() {
    return `
        <div class="settings-section">
            <h3>📳 Haptic Feedback</h3>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                <span>Enable Vibration</span>
                <label class="switch">
                    <input type="checkbox" id="haptic-toggle" ${hapticState.enabled ? 'checked' : ''} 
                        onchange="toggleHapticFeedback(this.checked)">
                    <span class="slider round"></span>
                </label>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem;">Vibration Strength:</label>
                <div class="haptic-strength-options">
                    <button class="haptic-strength-btn ${hapticState.strength === 'light' ? 'active' : ''}" 
                        data-strength="light" onclick="setHapticStrength('light')">
                        Light
                    </button>
                    <button class="haptic-strength-btn ${hapticState.strength === 'medium' ? 'active' : ''}" 
                        data-strength="medium" onclick="setHapticStrength('medium')">
                        Medium
                    </button>
                    <button class="haptic-strength-btn ${hapticState.strength === 'strong' ? 'active' : ''}" 
                        data-strength="strong" onclick="setHapticStrength('strong')">
                        Strong
                    </button>
                </div>
            </div>
            
            <div style="display: flex; gap: 0.5rem;">
                <button onclick="testVibration()" class="test-btn">
                    Test Vibration
                </button>
                <button onmousedown="startContinuousVibration()" 
                        onmouseup="stopContinuousVibration()" 
                        ontouchstart="startContinuousVibration()" 
                        ontouchend="stopContinuousVibration()"
                        class="test-btn">
                    Hold to Buzz
                </button>
            </div>
        </div>
    `;
}
