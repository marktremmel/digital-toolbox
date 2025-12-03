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
