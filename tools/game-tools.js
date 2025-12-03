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
