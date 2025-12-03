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
