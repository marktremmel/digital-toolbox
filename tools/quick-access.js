// ==================== QUICK ACCESS BAR ====================

let quickAccessExpanded = false;

// ==================== INITIALIZATION ====================
function initQuickAccess() {
    createQuickAccessBar();
}

function createQuickAccessBar() {
    const fab = document.createElement('div');
    fab.id = 'quick-access';
    fab.className = 'quick-access';

    fab.innerHTML = `
        <div class="quick-access-backdrop" style="display: none;" onclick="toggleQuickAccess()"></div>
        <div class="quick-access-menu" style="display: none;">
            <button class="quick-action glass-card" onclick="openCommandPalette()" title="Command Palette (⌘K)">
                <span>🔍</span>
                <span class="quick-label">Search</span>
            </button>
            <button class="quick-action glass-card" onclick="document.getElementById('settings-toggle').click()" title="Settings (⌘S)">
                <span>⚙️</span>
                <span class="quick-label">Settings</span>
            </button>
            <button class="quick-action glass-card" onclick="document.getElementById('theme-toggle').click()" title="Toggle Dark Mode (⌘D)">
                <span class="theme-icon">🌙</span>
                <span class="quick-label">Theme</span>
            </button>
            <button class="quick-action glass-card" onclick="showKeyboardShortcuts()" title="Shortcuts (⌘/)">
                <span>⌨️</span>
                <span class="quick-label">Shortcuts</span>
            </button>
        </div>
        <button class="quick-access-fab glass-card" onclick="toggleQuickAccess()">
            <span class="fab-icon">⚡</span>
        </button>
    `;

    document.body.appendChild(fab);
}

function toggleQuickAccess() {
    quickAccessExpanded = !quickAccessExpanded;

    const menu = document.querySelector('.quick-access-menu');
    const backdrop = document.querySelector('.quick-access-backdrop');
    const fabIcon = document.querySelector('.fab-icon');

    if (quickAccessExpanded) {
        menu.style.display = 'flex';
        backdrop.style.display = 'block';
        fabIcon.textContent = '✕';

        // Vibrate on open
        vibrateClick();
    } else {
        menu.style.display = 'none';
        backdrop.style.display = 'none';
        fabIcon.textContent = '⚡';
    }
}
