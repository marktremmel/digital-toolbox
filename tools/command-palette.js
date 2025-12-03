// ==================== COMMAND PALETTE ====================

let commandPaletteOpen = false;
let commandRegistry = [];

// ==================== INITIALIZATION ====================
function initCommandPalette() {
    buildCommandRegistry();
    createCommandPaletteUI();
}

function buildCommandRegistry() {
    commandRegistry = [];

    // Add all tools
    document.querySelectorAll('[data-tool]').forEach(tool => {
        const toolName = tool.getAttribute('data-tool');
        const displayName = tool.querySelector('.tool-name')?.textContent || toolName;
        const icon = tool.querySelector('.tool-icon')?.textContent || '🔧';

        commandRegistry.push({
            id: `tool-${toolName}`,
            type: 'tool',
            name: displayName,
            icon: icon,
            keywords: [toolName, displayName.toLowerCase()],
            action: () => {
                tool.click();
                closeCommandPalette();
            }
        });
    });

    // Add all links
    document.querySelectorAll('.link-card').forEach(link => {
        const linkName = link.querySelector('.link-name')?.textContent || 'Link';
        const icon = link.querySelector('.link-icon')?.textContent || '🔗';

        commandRegistry.push({
            id: `link-${linkName}`,
            type: 'link',
            name: linkName,
            icon: icon,
            keywords: [linkName.toLowerCase()],
            action: () => {
                link.click();
                closeCommandPalette();
            }
        });
    });

    // Add actions
    commandRegistry.push(
        {
            id: 'action-settings',
            type: 'action',
            name: 'Open Settings',
            icon: '⚙️',
            keywords: ['settings', 'preferences', 'config'],
            action: () => {
                document.getElementById('settings-toggle')?.click();
                closeCommandPalette();
            }
        },
        {
            id: 'action-darkmode',
            type: 'action',
            name: 'Toggle Dark Mode',
            icon: '🌙',
            keywords: ['dark', 'light', 'theme', 'mode'],
            action: () => {
                document.getElementById('theme-toggle')?.click();
                closeCommandPalette();
            }
        },
        {
            id: 'action-shortcuts',
            type: 'action',
            name: 'Keyboard Shortcuts',
            icon: '⌨️',
            keywords: ['shortcuts', 'hotkeys', 'keyboard'],
            action: () => {
                showKeyboardShortcuts();
                closeCommandPalette();
            }
        }
    );
}

// ==================== UI ====================
function createCommandPaletteUI() {
    const palette = document.createElement('div');
    palette.id = 'command-palette';
    palette.className = 'command-palette';
    palette.style.display = 'none';

    palette.innerHTML = `
        <div class="command-palette-backdrop" onclick="closeCommandPalette()"></div>
        <div class="command-palette-content glass-card">
            <input type="text" id="command-search" class="command-search" placeholder="Search tools, links, actions..." autocomplete="off">
            <div id="command-results" class="command-results"></div>
        </div>
    `;

    document.body.appendChild(palette);

    // Add event listener for search
    const searchInput = palette.querySelector('#command-search');
    searchInput.addEventListener('input', (e) => {
        filterCommands(e.target.value);
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            focusNextResult();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            focusPrevResult();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            executeSelectedCommand();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            closeCommandPalette();
        }
    });
}

function openCommandPalette() {
    const palette = document.getElementById('command-palette');
    if (!palette) return;

    commandPaletteOpen = true;
    palette.style.display = 'flex';

    // Focus search input
    const searchInput = document.getElementById('command-search');
    searchInput.value = '';
    searchInput.focus();

    // Show all commands initially
    filterCommands('');
}

function closeCommandPalette() {
    const palette = document.getElementById('command-palette');
    if (!palette) return;

    commandPaletteOpen = false;
    palette.style.display = 'none';
}

// ==================== SEARCH & FILTER ====================
function filterCommands(query) {
    const results = document.getElementById('command-results');
    if (!results) return;

    const lowerQuery = query.toLowerCase();

    // Filter commands
    const filtered = commandRegistry.filter(cmd => {
        if (!query) return true; // Show all if no query

        // Check name
        if (cmd.name.toLowerCase().includes(lowerQuery)) return true;

        // Check keywords
        return cmd.keywords.some(kw => kw.includes(lowerQuery));
    });

    // Render results
    if (filtered.length === 0) {
        results.innerHTML = '<div class="command-empty">No results found</div>';
        return;
    }

    let html = '';
    filtered.slice(0, 10).forEach((cmd, index) => {
        html += `
            <div class="command-item ${index === 0 ? 'selected' : ''}" data-command-id="${cmd.id}">
                <span class="command-icon">${cmd.icon}</span>
                <div class="command-text">
                    <div class="command-name">${cmd.name}</div>
                    <div class="command-type">${cmd.type}</div>
                </div>
            </div>
        `;
    });

    results.innerHTML = html;

    // Add click listeners
    results.querySelectorAll('.command-item').forEach(item => {
        item.addEventListener('click', () => {
            const cmdId = item.getAttribute('data-command-id');
            const cmd = commandRegistry.find(c => c.id === cmdId);
            if (cmd) cmd.action();
        });
    });
}

function focusNextResult() {
    const results = document.querySelectorAll('.command-item');
    const selected = document.querySelector('.command-item.selected');

    if (!selected || !results.length) return;

    const currentIndex = Array.from(results).indexOf(selected);
    const nextIndex = (currentIndex + 1) % results.length;

    selected.classList.remove('selected');
    results[nextIndex].classList.add('selected');
}

function focusPrevResult() {
    const results = document.querySelectorAll('.command-item');
    const selected = document.querySelector('.command-item.selected');

    if (!selected || !results.length) return;

    const currentIndex = Array.from(results).indexOf(selected);
    const prevIndex = (currentIndex - 1 + results.length) % results.length;

    selected.classList.remove('selected');
    results[prevIndex].classList.add('selected');
}

function executeSelectedCommand() {
    const selected = document.querySelector('.command-item.selected');
    if (!selected) return;

    const cmdId = selected.getAttribute('data-command-id');
    const cmd = commandRegistry.find(c => c.id === cmdId);
    if (cmd) cmd.action();
}
