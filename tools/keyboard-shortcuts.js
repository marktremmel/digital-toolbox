// ==================== KEYBOARD SHORTCUTS SYSTEM ====================

const shortcuts = {
    // Global shortcuts
    'cmd+k': { name: 'Command Palette', action: () => openCommandPalette(), description: 'Quick access to all tools and actions' },
    'ctrl+k': { name: 'Command Palette', action: () => openCommandPalette(), description: 'Quick access to all tools and actions' },

    'cmd+/': { name: 'Keyboard Shortcuts', action: () => showKeyboardShortcuts(), description: 'Show this help dialog' },
    'ctrl+/': { name: 'Keyboard Shortcuts', action: () => showKeyboardShortcuts(), description: 'Show this help dialog' },

    'cmd+s': { name: 'Settings', action: (e) => { e.preventDefault(); document.getElementById('settings-toggle')?.click(); }, description: 'Open settings panel' },
    'ctrl+s': { name: 'Settings', action: (e) => { e.preventDefault(); document.getElementById('settings-toggle')?.click(); }, description: 'Open settings panel' },

    'cmd+f': { name: 'Focus Search', action: (e) => { e.preventDefault(); document.getElementById('global-search')?.focus(); }, description: 'Focus global search' },
    'ctrl+f': { name: 'Focus Search', action: (e) => { e.preventDefault(); document.getElementById('global-search')?.focus(); }, description: 'Focus global search' },

    'escape': { name: 'Close Modal', action: () => closeModal(), description: 'Close open modals or palettes' },

    'cmd+d': { name: 'Toggle Dark Mode', action: (e) => { e.preventDefault(); document.getElementById('theme-toggle')?.click(); }, description: 'Toggle dark/light mode' },
    'ctrl+d': { name: 'Toggle Dark Mode', action: (e) => { e.preventDefault(); document.getElementById('theme-toggle')?.click(); }, description: 'Toggle dark/light mode' }
};

// ==================== INITIALIZATION ====================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', handleKeyPress);
}

// ==================== KEY PRESS HANDLER ====================
function handleKeyPress(e) {
    const key = [];

    if (e.ctrlKey) key.push('ctrl');
    if (e.metaKey) key.push('cmd');
    if (e.altKey) key.push('alt');
    if (e.shiftKey) key.push('shift');

    key.push(e.key.toLowerCase());

    const combo = key.join('+');

    if (shortcuts[combo]) {
        shortcuts[combo].action(e);
    }
}

// ==================== SHORTCUTS MODAL ====================
function showKeyboardShortcuts() {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');

    let html = `
        <h2>⌨️ Keyboard Shortcuts</h2>
        <div class="shortcuts-list">
    `;

    // Group shortcuts by category
    const categories = {
        'Navigation': ['cmd+k', 'cmd+f', 'cmd+s', 'escape'],
        'Interface': ['cmd+d', 'cmd+/']
    };

    Object.entries(categories).forEach(([category, keys]) => {
        html += `<h3>${category}</h3><div class="shortcuts-group">`;

        keys.forEach(key => {
            if (shortcuts[key]) {
                const shortcut = shortcuts[key];
                const displayKey = key.replace('cmd', '⌘').replace('ctrl', 'Ctrl').replace('+', ' + ').toUpperCase();

                html += `
                    <div class="shortcut-item">
                        <div class="shortcut-keys">
                            ${displayKey.split(' + ').map(k => `<kbd>${k}</kbd>`).join(' + ')}
                        </div>
                        <div class="shortcut-desc">
                            <strong>${shortcut.name}</strong>
                            <p>${shortcut.description}</p>
                        </div>
                    </div>
                `;
            }
        });

        html += '</div>';
    });

    html += '</div>';

    modalBody.innerHTML = html;
    modalOverlay.classList.add('active');
}
