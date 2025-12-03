// ==================== THEME SYSTEM ====================

const themes = {
    default: {
        name: 'Default (Purple Wave)',
        colors: {
            primary: '#667eea',
            secondary: '#764ba2',
            accent: '#f093fb',
            gradientStart: '#667eea',
            gradientMid: '#764ba2',
            gradientEnd: '#f093fb'
        }
    },
    ocean: {
        name: 'Ocean Blue',
        colors: {
            primary: '#0077be',
            secondary: '#00a8e8',
            accent: '#00ffcc',
            gradientStart: '#0077be',
            gradientMid: '#0096c7',
            gradientEnd: '#00b4d8'
        }
    },
    forest: {
        name: 'Forest Green',
        colors: {
            primary: '#2d6a4f',
            secondary: '#40916c',
            accent: '#95d5b2',
            gradientStart: '#2d6a4f',
            gradientMid: '#40916c',
            gradientEnd: '#52b788'
        }
    },
    sunset: {
        name: 'Sunset Orange',
        colors: {
            primary: '#fb8500',
            secondary: '#ffb703',
            accent: '#ff006e',
            gradientStart: '#fb8500',
            gradientMid: '#ffb703',
            gradientEnd: '#ffd60a'
        }
    },
    midnight: {
        name: 'Midnight Purple',
        colors: {
            primary: '#6a4c93',
            secondary: '#8b5cf6',
            accent: '#c77dff',
            gradientStart: '#6a4c93',
            gradientMid: '#8b5cf6',
            gradientEnd: '#c77dff'
        }
    },
    highContrast: {
        name: 'High Contrast',
        colors: {
            primary: '#000000',
            secondary: '#ffffff',
            accent: '#ffff00',
            gradientStart: '#000000',
            gradientMid: '#333333',
            gradientEnd: '#666666'
        }
    }
};

let currentTheme = 'default';

// ==================== INITIALIZATION ====================
function initThemeSystem() {
    loadTheme();
    updateThemeInSettings();
}

function loadTheme() {
    const savedTheme = localStorage.getItem('sek_theme');
    if (savedTheme && themes[savedTheme]) {
        applyTheme(savedTheme);
    }
}

// ==================== THEME APPLICATION ====================
function applyTheme(themeId) {
    if (!themes[themeId]) {
        console.error('Theme not found:', themeId);
        return;
    }

    currentTheme = themeId;
    const theme = themes[themeId];
    const colors = theme.colors;

    // Update CSS custom properties
    const root = document.documentElement;

    // Main colors
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-accent', colors.accent);

    // Update background gradient
    const waveBackground = document.querySelector('.wave-background');
    if (waveBackground && !waveBackground.classList.contains('bg-particles') && !waveBackground.classList.contains('bg-solid')) {
        waveBackground.style.background = `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientMid} 50%, ${colors.gradientEnd} 100%)`;
    }

    // Update title gradient
    document.querySelectorAll('.title-highlight').forEach(el => {
        el.style.background = `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientMid} 50%, ${colors.gradientEnd} 100%)`;
        el.style.webkitBackgroundClip = 'text';
        el.style.webkitTextFillColor = 'transparent';
        el.style.backgroundClip = 'text';
        el.style.backgroundSize = '200% 200%';
    });

    // Save preference
    localStorage.setItem('sek_theme', themeId);

    // Update UI if settings modal is open
    updateThemeInSettings();
}

function updateThemeInSettings() {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        const btnTheme = btn.getAttribute('data-theme');
        if (btnTheme === currentTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// ==================== SETTINGS INTEGRATION ====================
function getThemeSelector() {
    let html = '<div class="theme-grid">';

    Object.keys(themes).forEach(themeId => {
        const theme = themes[themeId];
        const isActive = themeId === currentTheme;
        const colors = theme.colors;

        html += `
            <button class="theme-btn ${isActive ? 'active' : ''}" 
                    data-theme="${themeId}" 
                    onclick="applyTheme('${themeId}')">
                <div class="theme-preview" style="background: linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientMid} 50%, ${colors.gradientEnd} 100%);"></div>
                <span>${theme.name}</span>
            </button>
        `;
    });

    html += '</div>';
    return html;
}
