// Dev & Utility Tools Implementation

// ==================== MARKDOWN PREVIEW ====================
function initMarkdownPreview() {
    const input = document.getElementById('md-input');
    const preview = document.getElementById('md-preview');

    input.addEventListener('input', () => {
        const text = input.value;
        preview.innerHTML = parseMarkdown(text);
    });

    function parseMarkdown(text) {
        let html = text
            // Headers
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            // Bold
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            // Links
            .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' target='_blank'>$1</a>")
            // Code blocks
            .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
            // Inline code
            .replace(/`([^`]+)`/gim, '<code>$1</code>')
            // Lists
            .replace(/^\s*-\s+(.*)/gim, '<li>$1</li>')
            // Paragraphs (double newline)
            .replace(/\n\n/gim, '<br><br>');

        return html;
    }
}

// ==================== BASE64 CONVERTER ====================
function initBase64() {
    const input = document.getElementById('b64-input');
    const output = document.getElementById('b64-output');

    window.encodeBase64 = () => {
        try {
            output.value = btoa(input.value);
        } catch (e) {
            output.value = "Error: Invalid input for Base64 encoding";
        }
    };

    window.decodeBase64 = () => {
        try {
            output.value = atob(input.value);
        } catch (e) {
            output.value = "Error: Invalid Base64 string";
        }
    };
}

// ==================== PASSWORD GENERATOR ====================
function initPasswordGenerator() {
    const lengthInput = document.getElementById('pwd-length');
    const lengthVal = document.getElementById('pwd-length-val');
    const includeCaps = document.getElementById('pwd-caps');
    const includeNums = document.getElementById('pwd-nums');
    const includeSyms = document.getElementById('pwd-syms');
    const output = document.getElementById('pwd-output');

    lengthInput.addEventListener('input', () => {
        lengthVal.innerText = lengthInput.value;
    });

    window.generatePassword = () => {
        const length = parseInt(lengthInput.value);
        const caps = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const small = 'abcdefghijklmnopqrstuvwxyz';
        const nums = '0123456789';
        const syms = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        let charset = small;
        if (includeCaps.checked) charset += caps;
        if (includeNums.checked) charset += nums;
        if (includeSyms.checked) charset += syms;

        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        output.value = password;
    };

    window.copyPassword = () => {
        output.select();
        document.execCommand('copy');
        alert('Password copied!');
    };
}

// ==================== LOREM IPSUM GENERATOR ====================
function initLoremIpsum() {
    const countInput = document.getElementById('lorem-count');
    const typeSelect = document.getElementById('lorem-type'); // paragraphs, sentences, words
    const output = document.getElementById('lorem-output');

    const loremText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    const words = loremText.replace(/[.,]/g, '').split(' ');
    const sentences = loremText.split('. ');

    window.generateLorem = () => {
        const count = parseInt(countInput.value);
        const type = typeSelect.value;
        let result = '';

        if (type === 'words') {
            for (let i = 0; i < count; i++) {
                result += words[i % words.length] + ' ';
            }
        } else if (type === 'sentences') {
            for (let i = 0; i < count; i++) {
                result += sentences[i % sentences.length] + '. ';
            }
        } else { // paragraphs
            for (let i = 0; i < count; i++) {
                result += loremText + '\n\n';
            }
        }

        output.value = result.trim();
    };

    window.copyLorem = () => {
        output.select();
        document.execCommand('copy');
        alert('Copied!');
    };
}

// ==================== JSON VIEWER ====================
function initJsonViewer() {
    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    const errorMsg = document.getElementById('json-error');

    window.formatJson = () => {
        try {
            const json = JSON.parse(input.value);
            output.innerHTML = syntaxHighlight(JSON.stringify(json, null, 4));
            errorMsg.style.display = 'none';
            if (window.haptics) window.haptics.success();
        } catch (e) {
            errorMsg.textContent = "Invalid JSON: " + e.message;
            errorMsg.style.display = 'block';
            if (window.haptics) window.haptics.error();
        }
    };

    window.minifyJson = () => {
        try {
            const json = JSON.parse(input.value);
            input.value = JSON.stringify(json);
            output.innerHTML = '';
            errorMsg.style.display = 'none';
            if (window.haptics) window.haptics.success();
        } catch (e) {
            errorMsg.textContent = "Invalid JSON: " + e.message;
            errorMsg.style.display = 'block';
            if (window.haptics) window.haptics.error();
        }
    };

    window.copyJson = () => {
        if (output.textContent) {
            navigator.clipboard.writeText(output.textContent);
            alert('Formatted JSON copied!');
        } else {
            navigator.clipboard.writeText(input.value);
            alert('Input JSON copied!');
        }
    };

    function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
}

// ==================== REGEX TESTER ====================
function initRegexTester() {
    const patternInput = document.getElementById('regex-pattern');
    const flagsInput = document.getElementById('regex-flags');
    const textInput = document.getElementById('regex-input');

    if (!patternInput) return;

    const updateResults = () => {
        const pattern = patternInput.value;
        const flags = flagsInput.value;
        const text = textInput.value;
        const output = document.getElementById('regex-output');
        const matchesDiv = document.getElementById('regex-matches');

        if (!pattern || !text) {
            output.innerHTML = text || '<span style="opacity: 0.5;">Enter pattern and text...</span>';
            matchesDiv.innerHTML = '';
            return;
        }

        try {
            const regex = new RegExp(pattern, flags);
            const matches = text.match(regex) || [];

            // Highlight matches in text
            let highlighted = text.replace(regex, (match) =>
                `<mark style="background: #fbbf24; color: #000; padding: 0 2px; border-radius: 2px;">${match}</mark>`
            );
            output.innerHTML = highlighted;

            // Show match info
            if (matches.length > 0) {
                matchesDiv.innerHTML = `<strong>${matches.length} match${matches.length > 1 ? 'es' : ''}</strong>: ${matches.slice(0, 10).map(m => `"${m}"`).join(', ')}${matches.length > 10 ? '...' : ''}`;
                if (window.haptics) window.haptics.light();
            } else {
                matchesDiv.innerHTML = '<span style="color: #ef4444;">No matches found</span>';
            }
        } catch (e) {
            output.innerHTML = `<span style="color: #ef4444;">Invalid regex: ${e.message}</span>`;
            matchesDiv.innerHTML = '';
        }
    };

    patternInput.addEventListener('input', updateResults);
    flagsInput.addEventListener('input', updateResults);
    textInput.addEventListener('input', updateResults);
}

// ==================== CODE BEAUTIFIER ====================
function initCodeBeautifier() {
    const langSelect = document.getElementById('beautify-lang');
    const input = document.getElementById('beautify-input');

    if (!langSelect) return;

    // Auto-detect language based on content
    input.addEventListener('input', () => {
        const text = input.value.trim();
        if (text.startsWith('<!DOCTYPE') || text.startsWith('<html') || text.match(/^<[a-z]+/i)) {
            langSelect.value = 'html';
        } else if (text.includes('{') && (text.includes(':') || text.includes('px') || text.includes('color'))) {
            langSelect.value = 'css';
        } else if (text.includes('function') || text.includes('const ') || text.includes('let ') || text.includes('=>')) {
            langSelect.value = 'js';
        }
    });
}

window.beautifyCode = function () {
    const lang = document.getElementById('beautify-lang').value;
    const input = document.getElementById('beautify-input').value;
    const output = document.getElementById('beautify-output');

    try {
        let result = '';
        switch (lang) {
            case 'html':
                result = beautifyHTML(input);
                break;
            case 'css':
                result = beautifyCSS(input);
                break;
            case 'js':
                result = beautifyJS(input);
                break;
        }
        output.value = result;
        if (window.haptics) window.haptics.success();
    } catch (e) {
        output.value = 'Error: ' + e.message;
        if (window.haptics) window.haptics.error();
    }
};

function beautifyHTML(html) {
    let formatted = '';
    let indent = 0;
    const tab = '  ';

    // Split by tags
    const parts = html.replace(/>\s*</g, '>\n<').split('\n');

    parts.forEach(part => {
        part = part.trim();
        if (!part) return;

        // Check if closing tag
        if (part.match(/^<\/\w/)) {
            indent = Math.max(0, indent - 1);
        }

        formatted += tab.repeat(indent) + part + '\n';

        // Check if opening tag (not self-closing)
        if (part.match(/^<\w[^>]*[^\/]>$/)) {
            indent++;
        }
    });

    return formatted.trim();
}

function beautifyCSS(css) {
    return css
        .replace(/\s*{\s*/g, ' {\n  ')
        .replace(/\s*}\s*/g, '\n}\n')
        .replace(/;\s*/g, ';\n  ')
        .replace(/\n  }/g, '\n}')
        .replace(/\n\n+/g, '\n\n')
        .trim();
}

function beautifyJS(js) {
    let formatted = '';
    let indent = 0;
    const tab = '  ';

    // Simple tokenization
    const lines = js.split(/[;\n]+/).filter(l => l.trim());

    lines.forEach(line => {
        line = line.trim();
        if (!line) return;

        // Decrease indent for closing braces
        if (line.includes('}') && !line.includes('{')) {
            indent = Math.max(0, indent - 1);
        }

        formatted += tab.repeat(indent) + line + ';\n';

        // Increase indent for opening braces
        if (line.includes('{') && !line.includes('}')) {
            indent++;
        }
    });

    return formatted
        .replace(/;;/g, ';')
        .replace(/{\s*;/g, '{')
        .replace(/;}/g, '}')
        .trim();
}

window.copyBeautified = function () {
    const output = document.getElementById('beautify-output');
    navigator.clipboard.writeText(output.value);
    if (window.haptics) window.haptics.success();
    alert('Copied to clipboard!');
};

// ==================== DIFF CHECKER ====================
function initDiffChecker() {
    // Initialize with empty state
}

window.compareDiff = function () {
    const text1 = document.getElementById('diff-text1').value;
    const text2 = document.getElementById('diff-text2').value;
    const output = document.getElementById('diff-output');

    if (!text1 || !text2) {
        output.innerHTML = '<span style="opacity: 0.5;">Enter text in both panels...</span>';
        return;
    }

    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);

    let html = '';
    let additions = 0;
    let deletions = 0;

    for (let i = 0; i < maxLines; i++) {
        const line1 = lines1[i] || '';
        const line2 = lines2[i] || '';

        if (line1 === line2) {
            html += `<div style="padding: 2px 8px;">${escapeHtml(line1) || '&nbsp;'}</div>`;
        } else if (!line1) {
            html += `<div style="padding: 2px 8px; background: rgba(16,185,129,0.3); color: #10b981;">+ ${escapeHtml(line2)}</div>`;
            additions++;
        } else if (!line2) {
            html += `<div style="padding: 2px 8px; background: rgba(239,68,68,0.3); color: #ef4444;">- ${escapeHtml(line1)}</div>`;
            deletions++;
        } else {
            html += `<div style="padding: 2px 8px; background: rgba(239,68,68,0.3); color: #ef4444;">- ${escapeHtml(line1)}</div>`;
            html += `<div style="padding: 2px 8px; background: rgba(16,185,129,0.3); color: #10b981;">+ ${escapeHtml(line2)}</div>`;
            additions++;
            deletions++;
        }
    }

    document.getElementById('diff-stats').innerHTML = `<span style="color: #10b981;">+${additions}</span> / <span style="color: #ef4444;">-${deletions}</span> changes`;
    output.innerHTML = html;
    if (window.haptics) window.haptics.light();
};

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== HEX CONVERTER ====================
function initHexConverter() {
    const decInput = document.getElementById('dec-input');
    const hexInput = document.getElementById('hex-input');

    if (decInput && hexInput) {
        decInput.addEventListener('input', () => {
            const val = parseInt(decInput.value);
            if (!isNaN(val)) {
                hexInput.value = val.toString(16).toUpperCase();
            } else {
                hexInput.value = '';
            }
        });

        hexInput.addEventListener('input', () => {
            const val = hexInput.value;
            // Check if valid hex
            if (/^[0-9A-Fa-f]+$/.test(val)) {
                const dec = parseInt(val, 16);
                if (!isNaN(dec)) {
                    decInput.value = dec;
                }
            } else if (val === '') {
                decInput.value = '';
            }
        });
    }
}
