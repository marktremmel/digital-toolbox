// Game Tools Implementation

// ==================== DICE ROLLER ====================
function initDiceRoller() {
    const diceType = document.getElementById('dice-type');
    const diceCount = document.getElementById('dice-count');
    const resultDisplay = document.getElementById('dice-result');
    const historyList = document.getElementById('dice-history');

    window.rollDice = () => {
        const sides = parseInt(diceType.value);
        const count = parseInt(diceCount.value);
        const rolls = [];
        let total = 0;

        for (let i = 0; i < count; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            rolls.push(roll);
            total += roll;
        }

        resultDisplay.innerHTML = `
            <div style="font-size: 3rem; font-weight: bold; color: #fbbf24;">${total}</div>
            <div style="font-size: 1rem; opacity: 0.8;">[ ${rolls.join(', ')} ]</div>
        `;

        // Add to history
        const li = document.createElement('li');
        li.innerText = `${count}d${sides}: ${total} [${rolls.join(', ')}]`;
        historyList.insertBefore(li, historyList.firstChild);
        if (historyList.children.length > 5) historyList.removeChild(historyList.lastChild);
    };
}

// ==================== MAGIC 8 BALL ====================
function initMagic8Ball() {
    const ball = document.getElementById('magic-8-ball');
    const answer = document.getElementById('magic-answer');

    const answers = [
        "It is certain", "It is decidedly so", "Without a doubt", "Yes definitely",
        "You may rely on it", "As I see it, yes", "Most likely", "Outlook good",
        "Yes", "Signs point to yes", "Reply hazy, try again", "Ask again later",
        "Better not tell you now", "Cannot predict now", "Concentrate and ask again",
        "Don't count on it", "My reply is no", "My sources say no",
        "Outlook not so good", "Very doubtful"
    ];

    window.shakeBall = () => {
        ball.classList.add('shaking');
        answer.style.opacity = 0;

        setTimeout(() => {
            ball.classList.remove('shaking');
            const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
            answer.innerText = randomAnswer;
            answer.style.opacity = 1;
        }, 1000);
    };
}

// ==================== QUICK MATHS ====================
function initQuickMaths() {
    const problemDisplay = document.getElementById('math-problem');
    const input = document.getElementById('math-input');
    const scoreDisplay = document.getElementById('math-score');
    const timerDisplay = document.getElementById('math-timer');
    const startBtn = document.getElementById('math-start-btn');
    const gameArea = document.getElementById('math-game-area');

    let score = 0;
    let timeLeft = 30;
    let timerInterval;
    let currentAnswer = 0;
    let isPlaying = false;

    window.startMathGame = () => {
        score = 0;
        timeLeft = 30;
        isPlaying = true;
        scoreDisplay.innerText = score;
        timerDisplay.innerText = timeLeft;
        startBtn.style.display = 'none';
        gameArea.style.display = 'block';
        input.value = '';
        input.focus();

        generateProblem();

        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.innerText = timeLeft;
            if (timeLeft <= 0) {
                endMathGame();
            }
        }, 1000);
    };

    function generateProblem() {
        const ops = ['+', '-', '*'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let a, b;

        if (op === '*') {
            a = Math.floor(Math.random() * 10) + 1;
            b = Math.floor(Math.random() * 10) + 1;
            currentAnswer = a * b;
        } else if (op === '-') {
            a = Math.floor(Math.random() * 50) + 10;
            b = Math.floor(Math.random() * a); // Ensure positive result
            currentAnswer = a - b;
        } else {
            a = Math.floor(Math.random() * 50);
            b = Math.floor(Math.random() * 50);
            currentAnswer = a + b;
        }

        problemDisplay.innerText = `${a} ${op} ${b} = ?`;
    }

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && isPlaying) {
            const val = parseInt(input.value);
            if (val === currentAnswer) {
                score++;
                scoreDisplay.innerText = score;
                input.value = '';
                generateProblem();
                // Bonus time for correct answer
                timeLeft += 1;
                timerDisplay.innerText = timeLeft;
            } else {
                // Penalty for wrong answer
                timeLeft -= 2;
                timerDisplay.innerText = timeLeft;
                input.classList.add('shake');
                setTimeout(() => input.classList.remove('shake'), 500);
            }
        }
    });

    function endMathGame() {
        clearInterval(timerInterval);
        isPlaying = false;
        gameArea.style.display = 'none';
        startBtn.style.display = 'block';
        startBtn.innerText = `Game Over! Score: ${score}. Play Again?`;
    }
}

// ==================== TYPING SPEED TEST ====================
function initTypingTest() {
    const textDisplay = document.getElementById('typing-text');
    const input = document.getElementById('typing-input');
    const wpmDisplay = document.getElementById('typing-wpm');
    const accDisplay = document.getElementById('typing-acc');
    const timerDisplay = document.getElementById('typing-timer');
    const restartBtn = document.getElementById('typing-restart');

    const sampleTexts = [
        "The quick brown fox jumps over the lazy dog.",
        "To be or not to be, that is the question.",
        "All that glitters is not gold.",
        "A journey of a thousand miles begins with a single step.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts."
    ];

    let currentText = "";
    let startTime = null;
    let timerInterval = null;
    let isFinished = false;

    window.startTypingTest = () => {
        currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        textDisplay.innerHTML = currentText.split('').map(char => `<span>${char}</span>`).join('');
        input.value = '';
        input.disabled = false;
        input.focus();
        wpmDisplay.innerText = '0';
        accDisplay.innerText = '100%';
        timerDisplay.innerText = '0s';
        startTime = null;
        isFinished = false;
        if (timerInterval) clearInterval(timerInterval);
    };

    input.addEventListener('input', () => {
        if (isFinished) return;

        if (!startTime) {
            startTime = new Date();
            timerInterval = setInterval(updateStats, 100);
        }

        const arrayQuote = textDisplay.querySelectorAll('span');
        const arrayValue = input.value.split('');
        let correct = true;
        let correctChars = 0;

        arrayQuote.forEach((characterSpan, index) => {
            const character = arrayValue[index];
            if (character == null) {
                characterSpan.classList.remove('correct');
                characterSpan.classList.remove('incorrect');
                correct = false;
            } else if (character === characterSpan.innerText) {
                characterSpan.classList.add('correct');
                characterSpan.classList.remove('incorrect');
                correctChars++;
            } else {
                characterSpan.classList.remove('correct');
                characterSpan.classList.add('incorrect');
                correct = false;
            }
        });

        if (arrayValue.length === currentText.length && correct) {
            isFinished = true;
            clearInterval(timerInterval);
            input.disabled = true;
            updateStats(); // Final update
        }
    });

    function updateStats() {
        const timeElapsed = (new Date() - startTime) / 1000 / 60; // in minutes
        const wordsTyped = input.value.length / 5;
        const wpm = Math.round(wordsTyped / timeElapsed) || 0;

        // Calculate accuracy
        let correctChars = 0;
        const arrayQuote = textDisplay.querySelectorAll('span');
        const arrayValue = input.value.split('');
        arrayValue.forEach((char, index) => {
            if (char === arrayQuote[index].innerText) correctChars++;
        });
        const accuracy = Math.round((correctChars / input.value.length) * 100) || 100;

        wpmDisplay.innerText = wpm;
        accDisplay.innerText = `${accuracy}%`;
        timerDisplay.innerText = `${Math.round((new Date() - startTime) / 1000)}s`;
    }

    window.startTypingTest(); // Auto start on load
}

// ==================== MEMORY GAME ====================
let memoryCards = [];
let memoryFlippedCards = [];
let memoryMoves = 0;
let memoryMatched = 0;
let memoryTimer = null;
let memoryTime = 0;
let memoryLocked = false;

function initMemoryGame() {
    const bestScore = localStorage.getItem('memoryBest');
    if (bestScore) {
        document.getElementById('memory-best').innerText = bestScore;
    }
    startMemoryGame();
}

window.startMemoryGame = function () {
    const grid = document.getElementById('memory-grid');
    const emojis = ['🎉', '🎮', '🎵', '🎨', '🚀', '💎', '🌟', '🔥'];
    const cards = [...emojis, ...emojis]; // 16 cards

    // Reset state
    memoryMoves = 0;
    memoryMatched = 0;
    memoryTime = 0;
    memoryFlippedCards = [];
    memoryLocked = false;

    document.getElementById('memory-moves').innerText = '0';
    document.getElementById('memory-time').innerText = '0s';

    if (memoryTimer) clearInterval(memoryTimer);
    memoryTimer = setInterval(() => {
        memoryTime++;
        document.getElementById('memory-time').innerText = `${memoryTime}s`;
    }, 1000);

    // Shuffle cards (Fisher-Yates)
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    grid.innerHTML = cards.map((emoji, index) => `
        <div class="memory-card" data-index="${index}" data-emoji="${emoji}" onclick="flipCard(this)"></div>
    `).join('');
};

window.flipCard = function (card) {
    if (memoryLocked) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (memoryFlippedCards.length >= 2) return;

    card.classList.add('flipped');
    card.innerText = card.dataset.emoji;
    memoryFlippedCards.push(card);

    if (memoryFlippedCards.length === 2) {
        memoryMoves++;
        document.getElementById('memory-moves').innerText = memoryMoves;
        checkMatch();
    }
};

function checkMatch() {
    const [card1, card2] = memoryFlippedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        memoryFlippedCards = [];
        memoryMatched++;

        if (memoryMatched === 8) {
            clearInterval(memoryTimer);
            const score = `${memoryMoves} moves in ${memoryTime}s`;
            const best = localStorage.getItem('memoryBest');
            if (!best || memoryMoves < parseInt(best)) {
                localStorage.setItem('memoryBest', memoryMoves);
                document.getElementById('memory-best').innerText = memoryMoves;
            }
            setTimeout(() => alert(`You won! ${score}`), 300);
        }

        if (window.haptics) window.haptics.success();
    } else {
        memoryLocked = true;
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.innerText = '';
            card2.innerText = '';
            memoryFlippedCards = [];
            memoryLocked = false;
        }, 1000);
    }
}

// ==================== IMAGE COMPRESSOR ====================
let compressFile = null;
let compressBlob = null;

function initImageCompressor() {
    const dropZone = document.getElementById('drop-zone-compress');
    const fileInput = document.getElementById('compress-input');
    const qualitySlider = document.getElementById('compress-quality');
    const qualityVal = document.getElementById('compress-quality-val');
    const downloadBtn = document.getElementById('compress-download');

    if (!dropZone) return;

    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) {
            handleCompressFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleCompressFile(e.target.files[0]);
    });

    qualitySlider.addEventListener('input', (e) => {
        qualityVal.innerText = `${e.target.value}%`;
        if (compressFile) compressImage();
    });

    downloadBtn.addEventListener('click', () => {
        if (compressBlob) {
            const url = URL.createObjectURL(compressBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `compressed_${compressFile.name}`;
            a.click();
            URL.revokeObjectURL(url);
            if (window.haptics) window.haptics.success();
        }
    });
}

function handleCompressFile(file) {
    if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
        alert('Please upload a PNG or JPG image.');
        return;
    }

    compressFile = file;
    document.getElementById('drop-zone-compress').style.display = 'none';
    document.getElementById('compress-editor').style.display = 'block';
    document.getElementById('compress-orig-size').innerText = formatBytes(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('compress-original').src = e.target.result;
        compressImage();
    };
    reader.readAsDataURL(file);
}

function compressImage() {
    const img = new Image();
    img.src = document.getElementById('compress-original').src;

    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const quality = document.getElementById('compress-quality').value / 100;

        canvas.toBlob((blob) => {
            compressBlob = blob;
            document.getElementById('compress-result').src = URL.createObjectURL(blob);
            document.getElementById('compress-new-size').innerText = formatBytes(blob.size);

            const savings = ((compressFile.size - blob.size) / compressFile.size * 100).toFixed(1);
            const badge = document.getElementById('compress-savings');
            badge.innerText = `-${savings}%`;
            badge.style.background = savings > 0 ? '#10B981' : '#EF4444';

            document.getElementById('compress-download').disabled = false;
        }, compressFile.type, quality);
    };
}

window.resetCompressor = function () {
    compressFile = null;
    compressBlob = null;
    document.getElementById('drop-zone-compress').style.display = 'flex';
    document.getElementById('compress-editor').style.display = 'none';
    document.getElementById('compress-input').value = '';
    document.getElementById('compress-download').disabled = true;
};

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ==================== RANDOM NAME PICKER ====================
let namesList = [];

function initRandomNamePicker() {
    namesList = JSON.parse(localStorage.getItem('sek_names')) || [];
    renderNamesList();
}

function renderNamesList() {
    const list = document.getElementById('names-list');
    if (!list) return;

    list.innerHTML = namesList.length === 0
        ? '<p style="opacity: 0.7; text-align: center;">Add names below</p>'
        : namesList.map((name, i) => `
            <span class="name-tag" style="display: inline-block; background: rgba(255,255,255,0.1); padding: 0.25rem 0.5rem; border-radius: 4px; margin: 0.25rem;">
                ${name} <button onclick="removeName(${i})" style="background: none; padding: 0; margin-left: 0.25rem; font-size: 0.8rem;">❌</button>
            </span>
        `).join('');
}

window.addName = function () {
    const input = document.getElementById('name-input');
    const name = input.value.trim();
    if (name) {
        namesList.push(name);
        localStorage.setItem('sek_names', JSON.stringify(namesList));
        input.value = '';
        renderNamesList();
    }
};

window.removeName = function (index) {
    namesList.splice(index, 1);
    localStorage.setItem('sek_names', JSON.stringify(namesList));
    renderNamesList();
};

window.pickRandomName = function () {
    if (namesList.length === 0) {
        alert('Add some names first!');
        return;
    }

    const result = document.getElementById('picked-name');
    const btn = document.getElementById('pick-btn');
    btn.disabled = true;

    // Animate through names
    let iterations = 0;
    const maxIterations = 15;

    const interval = setInterval(() => {
        const randomName = namesList[Math.floor(Math.random() * namesList.length)];
        result.innerText = randomName;
        iterations++;

        if (iterations >= maxIterations) {
            clearInterval(interval);
            const winner = namesList[Math.floor(Math.random() * namesList.length)];
            result.innerText = `🎉 ${winner} 🎉`;
            result.style.color = '#fbbf24';
            if (window.haptics) window.haptics.success();
            btn.disabled = false;
        }
    }, 100);
};

window.clearAllNames = function () {
    if (confirm('Clear all names?')) {
        namesList = [];
        localStorage.setItem('sek_names', JSON.stringify(namesList));
        renderNamesList();
    }
};

// ==================== REACTION TIME TEST ====================
let reactionStartTime = null;
let reactionTimeout = null;
let reactionState = 'waiting'; // waiting, ready, click, done

function initReactionTest() {
    const best = localStorage.getItem('reactionBest');
    if (best) {
        document.getElementById('reaction-best').innerText = best + 'ms';
    }
}

window.startReactionTest = function () {
    const box = document.getElementById('reaction-box');
    const result = document.getElementById('reaction-result');

    reactionState = 'waiting';
    box.style.background = '#ef4444';
    box.innerText = 'Wait for green...';
    result.innerText = '';

    // Random delay between 1-5 seconds
    const delay = Math.random() * 4000 + 1000;

    reactionTimeout = setTimeout(() => {
        reactionState = 'ready';
        box.style.background = '#10b981';
        box.innerText = 'CLICK NOW!';
        reactionStartTime = Date.now();
    }, delay);
};

window.clickReactionBox = function () {
    const box = document.getElementById('reaction-box');
    const result = document.getElementById('reaction-result');

    if (reactionState === 'waiting') {
        // Clicked too early
        clearTimeout(reactionTimeout);
        box.style.background = '#f59e0b';
        box.innerText = 'Too early! Click to try again';
        result.innerText = 'You clicked before it turned green!';
        reactionState = 'done';
        if (window.haptics) window.haptics.error();
    } else if (reactionState === 'ready') {
        // Good click!
        const reactionTime = Date.now() - reactionStartTime;
        box.style.background = '#3b82f6';
        box.innerText = reactionTime + 'ms';
        result.innerText = getReactionMessage(reactionTime);

        // Update best score
        const best = localStorage.getItem('reactionBest');
        if (!best || reactionTime < parseInt(best)) {
            localStorage.setItem('reactionBest', reactionTime);
            document.getElementById('reaction-best').innerText = reactionTime + 'ms';
            result.innerText += ' 🏆 New Best!';
        }

        reactionState = 'done';
        if (window.haptics) window.haptics.success();
    } else if (reactionState === 'done') {
        // Restart
        startReactionTest();
    }
};

function getReactionMessage(time) {
    if (time < 200) return '⚡ Incredible! Are you a robot?';
    if (time < 250) return '🔥 Amazing reflexes!';
    if (time < 300) return '👍 Great reaction time!';
    if (time < 400) return '😊 Good job!';
    if (time < 500) return '🙂 Not bad!';
    return '🐢 Keep practicing!';
}

// ==================== SIMON SAYS ====================
let simonSequence = [];
let simonPlayerIndex = 0;
let simonScore = 0;
let simonPlaying = false;
let simonColors = ['red', 'blue', 'green', 'yellow'];

function initSimonSays() {
    const best = localStorage.getItem('simonBest');
    if (best) document.getElementById('simon-best').innerText = best;
}

window.startSimon = function () {
    simonSequence = [];
    simonPlayerIndex = 0;
    simonScore = 0;
    simonPlaying = true;
    document.getElementById('simon-score').innerText = '0';
    document.getElementById('simon-status').innerText = 'Watch the pattern...';
    addSimonStep();
};

function addSimonStep() {
    const color = simonColors[Math.floor(Math.random() * 4)];
    simonSequence.push(color);
    simonPlayerIndex = 0;
    playSimonSequence();
}

function playSimonSequence() {
    simonPlaying = false;
    document.getElementById('simon-status').innerText = 'Watch...';

    let i = 0;
    const interval = setInterval(() => {
        if (i >= simonSequence.length) {
            clearInterval(interval);
            simonPlaying = true;
            document.getElementById('simon-status').innerText = 'Your turn!';
            return;
        }

        flashSimonButton(simonSequence[i]);
        i++;
    }, 600);
}

function flashSimonButton(color) {
    const btn = document.getElementById('simon-' + color);
    btn.style.filter = 'brightness(2)';
    btn.style.transform = 'scale(1.1)';
    if (window.haptics) window.haptics.light();

    setTimeout(() => {
        btn.style.filter = '';
        btn.style.transform = '';
    }, 300);
}

window.simonPress = function (color) {
    if (!simonPlaying) return;

    flashSimonButton(color);

    if (color === simonSequence[simonPlayerIndex]) {
        simonPlayerIndex++;

        if (simonPlayerIndex === simonSequence.length) {
            // Completed sequence
            simonScore++;
            document.getElementById('simon-score').innerText = simonScore;

            const best = localStorage.getItem('simonBest');
            if (!best || simonScore > parseInt(best)) {
                localStorage.setItem('simonBest', simonScore);
                document.getElementById('simon-best').innerText = simonScore;
            }

            if (window.haptics) window.haptics.success();
            setTimeout(addSimonStep, 1000);
        }
    } else {
        // Wrong!
        simonPlaying = false;
        document.getElementById('simon-status').innerText = `Game Over! Score: ${simonScore}`;
        if (window.haptics) window.haptics.error();
    }
};
