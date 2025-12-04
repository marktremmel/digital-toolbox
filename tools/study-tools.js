// Study Tools Implementation

// ==================== WORD COUNTER ====================
function initWordCounter() {
    const textarea = document.getElementById('word-counter-text');
    const stats = {
        words: document.getElementById('wc-words'),
        chars: document.getElementById('wc-chars'),
        sentences: document.getElementById('wc-sentences'),
        paragraphs: document.getElementById('wc-paragraphs'),
        readingTime: document.getElementById('wc-read-time')
    };

    textarea.addEventListener('input', () => {
        const text = textarea.value;

        // Count words (split by whitespace and filter empty)
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);
        stats.words.innerText = words.length;

        // Count characters
        stats.chars.innerText = text.length;

        // Count sentences (split by . ! ? and filter empty)
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        stats.sentences.innerText = sentences.length;

        // Count paragraphs (split by double newline)
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        stats.paragraphs.innerText = paragraphs.length;

        // Reading time (avg 200 wpm)
        const minutes = Math.ceil(words.length / 200);
        stats.readingTime.innerText = `~${minutes} min`;
    });
}

// ==================== TODO LIST ====================
function initTodoList() {
    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('todo-add-btn');
    const list = document.getElementById('todo-list');

    let todos = JSON.parse(localStorage.getItem('sek_todos')) || [];

    function saveTodos() {
        localStorage.setItem('sek_todos', JSON.stringify(todos));
    }

    function renderTodos() {
        list.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <span class="todo-text" onclick="toggleTodo(${index})">${todo.text}</span>
                <button class="todo-delete" onclick="deleteTodo(${index})">❌</button>
            `;
            list.appendChild(li);
        });
    }

    window.toggleTodo = (index) => {
        todos[index].completed = !todos[index].completed;
        saveTodos();
        renderTodos();
    };

    window.deleteTodo = (index) => {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    };

    function addTodo() {
        const text = input.value.trim();
        if (text) {
            todos.push({ text, completed: false });
            input.value = '';
            saveTodos();
            renderTodos();
        }
    }

    addBtn.addEventListener('click', addTodo);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    renderTodos();
}

// ==================== HABIT TRACKER ====================
function initHabitTracker() {
    const input = document.getElementById('habit-input');
    const addBtn = document.getElementById('habit-add-btn');
    const grid = document.getElementById('habit-grid');

    let habits = JSON.parse(localStorage.getItem('sek_habits')) || [];

    function saveHabits() {
        localStorage.setItem('sek_habits', JSON.stringify(habits));
    }

    function renderHabits() {
        grid.innerHTML = '';
        const today = new Date().toISOString().split('T')[0];

        habits.forEach((habit, index) => {
            const div = document.createElement('div');
            div.className = 'habit-card glass-card';

            // Check if completed today
            const isDone = habit.dates && habit.dates.includes(today);

            div.innerHTML = `
                <div class="habit-header">
                    <span class="habit-name">${habit.name}</span>
                    <button class="habit-delete" onclick="deleteHabit(${index})">🗑️</button>
                </div>
                <div class="habit-streak">🔥 Streak: ${calculateStreak(habit.dates)} days</div>
                <button class="habit-check-btn ${isDone ? 'done' : ''}" onclick="toggleHabit(${index})">
                    ${isDone ? 'COMPLETED ✅' : 'MARK DONE'}
                </button>
            `;
            grid.appendChild(div);
        });
    }

    function calculateStreak(dates) {
        if (!dates || dates.length === 0) return 0;
        // Simple streak calculation logic could be added here
        // For now just returning count of days
        return dates.length;
    }

    window.toggleHabit = (index) => {
        const today = new Date().toISOString().split('T')[0];
        if (!habits[index].dates) habits[index].dates = [];

        const dateIndex = habits[index].dates.indexOf(today);
        if (dateIndex === -1) {
            habits[index].dates.push(today);
        } else {
            habits[index].dates.splice(dateIndex, 1);
        }

        saveHabits();
        renderHabits();
    };

    window.deleteHabit = (index) => {
        if (confirm('Delete this habit?')) {
            habits.splice(index, 1);
            saveHabits();
            renderHabits();
        }
    };

    addBtn.addEventListener('click', () => {
        const name = input.value.trim();
        if (name) {
            habits.push({ name, dates: [] });
            input.value = '';
            saveHabits();
            renderHabits();
        }
    });

    renderHabits();
}

// ==================== FLASHCARDS ====================
function initFlashcards() {
    const deckSelect = document.getElementById('flashcard-deck-select');
    const cardDisplay = document.getElementById('flashcard-display');
    const controls = document.getElementById('flashcard-controls');
    const createSection = document.getElementById('flashcard-create');

    let decks = JSON.parse(localStorage.getItem('sek_flashcards')) || {
        'Demo Deck': [
            { front: 'HTML', back: 'HyperText Markup Language' },
            { front: 'CSS', back: 'Cascading Style Sheets' },
            { front: 'JS', back: 'JavaScript' }
        ]
    };

    let currentDeck = null;
    let currentCardIndex = 0;
    let isFlipped = false;

    window.loadDeck = () => {
        const deckName = deckSelect.value;
        if (!deckName) return;

        currentDeck = decks[deckName];
        currentCardIndex = 0;
        isFlipped = false;
        showCard();
        controls.style.display = 'flex';
    };

    window.flipCard = () => {
        if (!currentDeck) return;
        isFlipped = !isFlipped;
        const card = currentDeck[currentCardIndex];
        const content = isFlipped ? card.back : card.front;

        document.getElementById('card-content').innerText = content;
        document.getElementById('card-side').innerText = isFlipped ? 'Back' : 'Front';
        document.getElementById('flashcard-card').classList.toggle('flipped', isFlipped);
    };

    window.nextCard = () => {
        if (!currentDeck) return;
        currentCardIndex = (currentCardIndex + 1) % currentDeck.length;
        isFlipped = false;
        showCard();
    };

    window.prevCard = () => {
        if (!currentDeck) return;
        currentCardIndex = (currentCardIndex - 1 + currentDeck.length) % currentDeck.length;
        isFlipped = false;
        showCard();
    };

    function showCard() {
        const card = currentDeck[currentCardIndex];
        document.getElementById('card-content').innerText = card.front;
        document.getElementById('card-side').innerText = 'Front';
        document.getElementById('card-counter').innerText = `${currentCardIndex + 1} / ${currentDeck.length}`;
        document.getElementById('flashcard-card').classList.remove('flipped');
    }

    // Initialize deck select
    function updateDeckSelect() {
        deckSelect.innerHTML = '<option value="">Select a Deck...</option>';
        Object.keys(decks).forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.innerText = name;
            deckSelect.appendChild(option);
        });
    }

    window.createNewDeck = () => {
        const name = prompt('Deck Name:');
        if (name && !decks[name]) {
            decks[name] = [];
            localStorage.setItem('sek_flashcards', JSON.stringify(decks));
            updateDeckSelect();
        }
    };

    window.addCardToDeck = () => {
        const deckName = deckSelect.value;
        if (!deckName) {
            alert('Please select a deck first');
            return;
        }

        const front = prompt('Front side:');
        const back = prompt('Back side:');

        if (front && back) {
            decks[deckName].push({ front, back });
            localStorage.setItem('sek_flashcards', JSON.stringify(decks));
            if (currentDeck) loadDeck(); // Reload if active
        }
    };

    updateDeckSelect();
}

// ==================== QUIZ MAKER ====================
let quizzes = [];
let currentQuiz = null;
let currentQuestionIndex = 0;
let quizScore = 0;

function initQuizMaker() {
    quizzes = JSON.parse(localStorage.getItem('sek_quizzes')) || [];
    renderQuizList();
}

function renderQuizList() {
    const listContainer = document.getElementById('quiz-list');
    if (!listContainer) return;

    listContainer.innerHTML = quizzes.length === 0
        ? '<p style="opacity: 0.7;">No quizzes yet. Create one!</p>'
        : quizzes.map((q, i) => `
            <div class="quiz-item glass-card" style="padding: 0.75rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span>${q.title} (${q.questions.length} questions)</span>
                <div>
                    <button onclick="takeQuiz(${i})" style="padding: 0.25rem 0.5rem;">▶️ Take</button>
                    <button onclick="deleteQuiz(${i})" style="padding: 0.25rem 0.5rem; background: #ef4444;">🗑️</button>
                </div>
            </div>
        `).join('');
}

window.showCreateQuiz = function () {
    document.getElementById('quiz-list').style.display = 'none';
    document.getElementById('quiz-create-form').style.display = 'block';
    document.getElementById('quiz-take-area').style.display = 'none';
    document.getElementById('quiz-questions-editor').innerHTML = '';
    addQuestion();
};

window.backToQuizList = function () {
    document.getElementById('quiz-list').style.display = 'block';
    document.getElementById('quiz-create-form').style.display = 'none';
    document.getElementById('quiz-take-area').style.display = 'none';
    renderQuizList();
};

window.addQuestion = function () {
    const editor = document.getElementById('quiz-questions-editor');
    const qNum = editor.children.length + 1;

    const qDiv = document.createElement('div');
    qDiv.className = 'quiz-q-editor';
    qDiv.style.cssText = 'background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;';
    qDiv.innerHTML = `
        <input type="text" placeholder="Question ${qNum}" class="q-question" style="width: 100%; padding: 0.5rem; margin-bottom: 0.5rem;">
        <input type="text" placeholder="Option A" class="q-option" style="width: 100%; padding: 0.25rem; margin-bottom: 0.25rem;">
        <input type="text" placeholder="Option B" class="q-option" style="width: 100%; padding: 0.25rem; margin-bottom: 0.25rem;">
        <input type="text" placeholder="Option C" class="q-option" style="width: 100%; padding: 0.25rem; margin-bottom: 0.25rem;">
        <input type="text" placeholder="Option D" class="q-option" style="width: 100%; padding: 0.25rem; margin-bottom: 0.5rem;">
        <select class="q-correct" style="width: 100%; padding: 0.25rem;">
            <option value="0">Correct: A</option>
            <option value="1">Correct: B</option>
            <option value="2">Correct: C</option>
            <option value="3">Correct: D</option>
        </select>
    `;
    editor.appendChild(qDiv);
};

window.saveQuiz = function () {
    const title = document.getElementById('quiz-title').value.trim();
    if (!title) {
        alert('Please enter a quiz title');
        return;
    }

    const qs = document.querySelectorAll('.quiz-q-editor');
    const questions = Array.from(qs).map(q => {
        const question = q.querySelector('.q-question').value;
        const options = Array.from(q.querySelectorAll('.q-option')).map(o => o.value);
        const correct = parseInt(q.querySelector('.q-correct').value);
        return { question, options, correct };
    }).filter(q => q.question && q.options.every(o => o));

    if (questions.length === 0) {
        alert('Add at least one complete question');
        return;
    }

    quizzes.push({ title, questions });
    localStorage.setItem('sek_quizzes', JSON.stringify(quizzes));
    if (window.haptics) window.haptics.success();
    backToQuizList();
};

window.takeQuiz = function (index) {
    currentQuiz = quizzes[index];
    currentQuestionIndex = 0;
    quizScore = 0;

    document.getElementById('quiz-list').style.display = 'none';
    document.getElementById('quiz-create-form').style.display = 'none';
    document.getElementById('quiz-take-area').style.display = 'block';

    showQuestion();
};

function showQuestion() {
    const area = document.getElementById('quiz-take-area');
    const q = currentQuiz.questions[currentQuestionIndex];

    area.innerHTML = `
        <h3 style="margin-bottom: 1rem;">${currentQuiz.title}</h3>
        <div style="margin-bottom: 0.5rem; opacity: 0.7;">Question ${currentQuestionIndex + 1}/${currentQuiz.questions.length}</div>
        <div style="font-size: 1.2rem; margin-bottom: 1rem;">${q.question}</div>
        ${q.options.map((opt, i) => `
            <button onclick="answerQuestion(${i})" style="display: block; width: 100%; text-align: left; padding: 0.75rem; margin-bottom: 0.5rem;">${['A', 'B', 'C', 'D'][i]}. ${opt}</button>
        `).join('')}
        <div style="margin-top: 1rem;">
            <button onclick="backToQuizList()">← Back</button>
        </div>
    `;
}

window.answerQuestion = function (answer) {
    const q = currentQuiz.questions[currentQuestionIndex];
    if (answer === q.correct) {
        quizScore++;
        if (window.haptics) window.haptics.success();
    } else {
        if (window.haptics) window.haptics.error();
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < currentQuiz.questions.length) {
        showQuestion();
    } else {
        showQuizResults();
    }
};

function showQuizResults() {
    const area = document.getElementById('quiz-take-area');
    const pct = Math.round((quizScore / currentQuiz.questions.length) * 100);

    area.innerHTML = `
        <h3>Quiz Complete! 🎉</h3>
        <div style="font-size: 3rem; color: ${pct >= 70 ? '#10b981' : '#ef4444'}; margin: 2rem 0;">${pct}%</div>
        <div style="margin-bottom: 2rem;">${quizScore} / ${currentQuiz.questions.length} correct</div>
        <button onclick="takeQuiz(${quizzes.indexOf(currentQuiz)})">Try Again</button>
        <button onclick="backToQuizList()">Back to Quizzes</button>
    `;
}

window.deleteQuiz = function (index) {
    if (confirm('Delete this quiz?')) {
        quizzes.splice(index, 1);
        localStorage.setItem('sek_quizzes', JSON.stringify(quizzes));
        renderQuizList();
    }
};

// ==================== CITATION GENERATOR ====================
function initCitationGenerator() {
    const typeSelect = document.getElementById('citation-type');
    const styleSelect = document.getElementById('citation-style');

    if (typeSelect) {
        typeSelect.addEventListener('change', updateCitationFields);
        updateCitationFields();
    }
}

function updateCitationFields() {
    const type = document.getElementById('citation-type').value;
    const fieldsContainer = document.getElementById('citation-fields');

    const fields = {
        book: ['author', 'title', 'publisher', 'year', 'city'],
        article: ['author', 'title', 'journal', 'volume', 'issue', 'pages', 'year'],
        website: ['author', 'title', 'siteName', 'url', 'accessDate', 'publishDate']
    };

    const labels = {
        author: 'Author(s)',
        title: 'Title',
        publisher: 'Publisher',
        year: 'Year',
        city: 'City',
        journal: 'Journal Name',
        volume: 'Volume',
        issue: 'Issue',
        pages: 'Pages (e.g., 10-25)',
        siteName: 'Website Name',
        url: 'URL',
        accessDate: 'Access Date',
        publishDate: 'Publish Date'
    };

    fieldsContainer.innerHTML = fields[type].map(field => `
        <div style="margin-bottom: 0.5rem;">
            <label style="display: block; font-size: 0.9rem; opacity: 0.8;">${labels[field]}</label>
            <input type="${field.includes('Date') ? 'date' : 'text'}" id="cite-${field}" 
                   placeholder="${labels[field]}" style="width: 100%; padding: 0.5rem;">
        </div>
    `).join('');
}

window.generateCitation = function () {
    const type = document.getElementById('citation-type').value;
    const style = document.getElementById('citation-style').value;
    const output = document.getElementById('citation-output');

    const getValue = (id) => document.getElementById(`cite-${id}`)?.value.trim() || '';

    let citation = '';

    if (type === 'book') {
        const author = getValue('author');
        const title = getValue('title');
        const publisher = getValue('publisher');
        const year = getValue('year');
        const city = getValue('city');

        switch (style) {
            case 'apa':
                citation = `${author} (${year}). <i>${title}</i>. ${publisher}.`;
                break;
            case 'mla':
                citation = `${author}. <i>${title}</i>. ${publisher}, ${year}.`;
                break;
            case 'ieee':
                citation = `${author}, <i>${title}</i>. ${city}: ${publisher}, ${year}.`;
                break;
            case 'chicago':
                citation = `${author}. <i>${title}</i>. ${city}: ${publisher}, ${year}.`;
                break;
        }
    } else if (type === 'article') {
        const author = getValue('author');
        const title = getValue('title');
        const journal = getValue('journal');
        const volume = getValue('volume');
        const issue = getValue('issue');
        const pages = getValue('pages');
        const year = getValue('year');

        switch (style) {
            case 'apa':
                citation = `${author} (${year}). ${title}. <i>${journal}</i>, ${volume}(${issue}), ${pages}.`;
                break;
            case 'mla':
                citation = `${author}. "${title}." <i>${journal}</i>, vol. ${volume}, no. ${issue}, ${year}, pp. ${pages}.`;
                break;
            case 'ieee':
                citation = `${author}, "${title}," <i>${journal}</i>, vol. ${volume}, no. ${issue}, pp. ${pages}, ${year}.`;
                break;
            case 'chicago':
                citation = `${author}. "${title}." <i>${journal}</i> ${volume}, no. ${issue} (${year}): ${pages}.`;
                break;
        }
    } else if (type === 'website') {
        const author = getValue('author') || 'N.A.';
        const title = getValue('title');
        const siteName = getValue('siteName');
        const url = getValue('url');
        const accessDate = getValue('accessDate');
        const publishDate = getValue('publishDate');

        const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

        switch (style) {
            case 'apa':
                citation = `${author}. (${publishDate ? new Date(publishDate).getFullYear() : 'n.d.'}). ${title}. <i>${siteName}</i>. ${url}`;
                break;
            case 'mla':
                citation = `${author}. "${title}." <i>${siteName}</i>, ${formatDate(publishDate)}, ${url}. Accessed ${formatDate(accessDate)}.`;
                break;
            case 'ieee':
                citation = `${author}, "${title}," <i>${siteName}</i>. [Online]. Available: ${url}. [Accessed: ${formatDate(accessDate)}].`;
                break;
            case 'chicago':
                citation = `${author}. "${title}." ${siteName}. Accessed ${formatDate(accessDate)}. ${url}.`;
                break;
        }
    }

    output.innerHTML = citation;
    if (window.haptics) window.haptics.light();
};

window.copyCitation = function () {
    const output = document.getElementById('citation-output');
    const text = output.innerText;

    if (text) {
        navigator.clipboard.writeText(text);
        if (window.haptics) window.haptics.success();
        alert('Citation copied!');
    }
};

// ==================== GRADE CALCULATOR ====================
let gradeRows = [];

function initGradeCalculator() {
    gradeRows = [];
    addGradeRow();
    addGradeRow();
    addGradeRow();
}

window.addGradeRow = function () {
    const container = document.getElementById('grade-rows');
    if (!container) return;

    const id = gradeRows.length;
    gradeRows.push({ name: '', grade: '', weight: '' });

    const row = document.createElement('div');
    row.className = 'grade-row';
    row.style.cssText = 'display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 0.5rem; margin-bottom: 0.5rem;';
    row.innerHTML = `
        <input type="text" placeholder="Subject" oninput="updateGradeRow(${id}, 'name', this.value)" style="padding: 0.5rem;">
        <input type="number" placeholder="Grade" min="0" max="100" oninput="updateGradeRow(${id}, 'grade', this.value)" style="padding: 0.5rem;">
        <input type="number" placeholder="Weight %" min="0" max="100" oninput="updateGradeRow(${id}, 'weight', this.value)" style="padding: 0.5rem;">
        <button onclick="removeGradeRow(${id})" style="padding: 0.5rem; background: #ef4444;">×</button>
    `;
    container.appendChild(row);
};

window.updateGradeRow = function (id, field, value) {
    gradeRows[id][field] = value;
    calculateGrade();
};

window.removeGradeRow = function (id) {
    gradeRows[id] = null;
    document.getElementById('grade-rows').children[id].remove();
    calculateGrade();
};

function calculateGrade() {
    const valid = gradeRows.filter(r => r && r.grade && r.weight);
    if (valid.length === 0) {
        document.getElementById('grade-result').innerText = '--';
        return;
    }

    let totalWeightedGrade = 0;
    let totalWeight = 0;

    valid.forEach(row => {
        const grade = parseFloat(row.grade);
        const weight = parseFloat(row.weight);
        totalWeightedGrade += grade * weight;
        totalWeight += weight;
    });

    const average = totalWeight > 0 ? (totalWeightedGrade / totalWeight).toFixed(2) : 0;
    const resultEl = document.getElementById('grade-result');
    resultEl.innerText = average + '%';

    // Color based on grade
    if (average >= 90) resultEl.style.color = '#10b981';
    else if (average >= 70) resultEl.style.color = '#fbbf24';
    else if (average >= 50) resultEl.style.color = '#f59e0b';
    else resultEl.style.color = '#ef4444';

    if (window.haptics) window.haptics.light();
}

// ==================== EXAM TIMER ====================
let examInterval = null;
let examSeconds = 0;
let examTotalSeconds = 0;
let examWarnings = { half: false, ten: false, five: false, one: false };

function initExamTimer() {
    document.getElementById('exam-duration').addEventListener('change', resetExamTimer);
    resetExamTimer();
}

function resetExamTimer() {
    clearInterval(examInterval);
    examInterval = null;
    const mins = parseInt(document.getElementById('exam-duration').value) || 60;
    examTotalSeconds = mins * 60;
    examSeconds = examTotalSeconds;
    examWarnings = { half: false, ten: false, five: false, one: false };
    updateExamDisplay();
    document.getElementById('exam-start-btn').innerText = 'Start';
    document.getElementById('exam-progress').style.width = '100%';
    document.getElementById('exam-progress').style.background = '#10b981';
}

window.toggleExamTimer = function () {
    const btn = document.getElementById('exam-start-btn');
    if (examInterval) {
        clearInterval(examInterval);
        examInterval = null;
        btn.innerText = 'Resume';
    } else {
        examInterval = setInterval(tickExamTimer, 1000);
        btn.innerText = 'Pause';
    }
};

function tickExamTimer() {
    examSeconds--;
    updateExamDisplay();

    const progress = (examSeconds / examTotalSeconds) * 100;
    const progressBar = document.getElementById('exam-progress');
    progressBar.style.width = progress + '%';

    // Color and warnings
    if (progress <= 10) {
        progressBar.style.background = '#ef4444';
        if (!examWarnings.one && examSeconds <= 60) {
            examWarnings.one = true;
            showExamWarning('⚠️ 1 minute remaining!', 'critical');
        }
    } else if (progress <= 25) {
        progressBar.style.background = '#f59e0b';
        if (!examWarnings.five && examSeconds <= 300) {
            examWarnings.five = true;
            showExamWarning('⏰ 5 minutes remaining!', 'warning');
        }
    } else if (progress <= 50) {
        progressBar.style.background = '#fbbf24';
        if (!examWarnings.ten && examSeconds <= 600) {
            examWarnings.ten = true;
            showExamWarning('📢 10 minutes remaining', 'info');
        }
    }

    if (!examWarnings.half && examSeconds <= examTotalSeconds / 2) {
        examWarnings.half = true;
        showExamWarning('⏱️ Halfway there!', 'info');
    }

    if (examSeconds <= 0) {
        clearInterval(examInterval);
        examInterval = null;
        document.getElementById('exam-start-btn').innerText = 'Restart';
        showExamWarning('🔔 TIME IS UP!', 'critical');
        if (window.haptics) window.haptics.heavy();
    }
}

function updateExamDisplay() {
    const hours = Math.floor(examSeconds / 3600);
    const mins = Math.floor((examSeconds % 3600) / 60);
    const secs = examSeconds % 60;
    document.getElementById('exam-display').innerText =
        (hours > 0 ? hours + ':' : '') +
        String(mins).padStart(2, '0') + ':' +
        String(secs).padStart(2, '0');
}

function showExamWarning(msg, type) {
    const warningEl = document.getElementById('exam-warning');
    warningEl.innerText = msg;
    warningEl.style.display = 'block';
    warningEl.style.background = type === 'critical' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6';
    if (window.haptics) window.haptics[type === 'critical' ? 'heavy' : 'medium']();
    setTimeout(() => warningEl.style.display = 'none', 3000);
}

window.resetExamTimer = resetExamTimer;
