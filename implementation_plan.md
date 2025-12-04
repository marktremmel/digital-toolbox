# Phase 3 Batch 2: Priority Tools - Implementation Plan

## Goal
Implement high-value tools across all categories (Study, Creative, Dev, Games) that provide maximum utility to students.

## Batch 2 Features (8 Priority Tools)

### 1. Image Compressor 📸
**File:** `tools/image-tools.js`
- Client-side compression using Canvas API
- Support PNG and JPG only (no WebP per user request)
- Adjustable quality slider (1-100%)
- Before/after size comparison
- Download compressed image
- Drag & drop or file picker

### 2. JSON Viewer/Editor 💻
**File:** `tools/dev-tools.js` (extend)
- Prettify JSON with syntax highlighting
- Validate JSON structure
- Tree view for navigation
- Copy formatted JSON
- Error indicators with line numbers
- Minify option

### 3. Memory Game 🎮
**File:** `tools/game-tools.js` (extend)
- Card matching game (8 pairs = 16 cards)
- Flip animation with CSS
- Move counter
- Timer
- Best score tracking (localStorage)
- Multiple difficulty levels (Easy/Medium/Hard)
- Theme-aware card backs

### 4. Random Name Picker 🎲
**File:** `tools/game-tools.js` (extend)
- Add names (one per line)
- Random selection with animation
- Remove selected names option
- Save/load name lists (localStorage)
- Classroom mode (no repeats until all picked)
- History of picks

### 5. Quiz Maker 📝
**File:** `tools/study-tools.js` (extend)
- Create multiple-choice quizzes
- Add/edit/delete questions
- Quiz taking mode
- Score calculation
- Save quizzes (localStorage)
- Export/import quiz JSON
- Timer option

### 6. Citation Generator 📚
**File:** `tools/study-tools.js` (extend)
- Support APA, MLA, IEEE, Chicago formats
- Input fields for: Author, Title, Year, Publisher, URL, etc.
- Copy formatted citation
- Save citations list
- Batch export

### 7. Regex Tester 🔍
**File:** `tools/dev-tools.js` (extend)
- Pattern input with syntax highlighting
- Test string input
- Live match highlighting
- Match groups display
- Common regex library (email, URL, phone, etc.)
- Regex explanation/breakdown

### 8. Code Beautifier ✨
**File:** `tools/dev-tools.js` (extend)
- Beautify HTML, CSS, JavaScript
- Configurable indentation (2/4 spaces, tabs)
- Remove comments option
- Minify option
- Copy beautified code
- Side-by-side before/after view

---

## Implementation Order

### Session 1: Image Tools & JSON
1. Image Compressor
2. JSON Viewer/Editor

### Session 2: Study Tools
3. Quiz Maker
4. Citation Generator

### Session 3: Games
5. Memory Game
6. Random Name Picker

### Session 4: Dev Tools
7. Regex Tester
8. Code Beautifier

---

## File Changes

### New Files
None - extending existing tool modules

### Modified Files

#### tools/image-tools.js (NEW)
```javascript
// Image Compressor
// - Canvas-based compression
// - Quality slider
// - Download functionality
```

#### tools/dev-tools.js
```javascript
// Add:
// - JSON Viewer/Editor
// - Regex Tester
// - Code Beautifier
```

#### tools/study-tools.js
```javascript
// Add:
// - Quiz Maker
// - Citation Generator
```

#### tools/game-tools.js
```javascript
// Add:
// - Memory Game
// - Random Name Picker
```

#### index.html
```html
<!-- Add tool buttons to appropriate sections -->
<!-- Add script reference for image-tools.js -->
```

#### style.css
```css
/* Add styles for:
   - Memory game cards
   - JSON syntax highlighting
   - Quiz interface
   - Citation forms
*/
```

---

## Technical Details

### Image Compressor
- Use Canvas API `toBlob()` with quality parameter
- No external libraries needed
- File size reduction: typically 50-90%

### JSON Viewer
- Use `JSON.parse()` for validation
- Syntax highlighting with CSS classes
- Collapsible tree view with recursive rendering

### Memory Game
- Grid layout with CSS Grid
- Card flip with CSS `transform: rotateY()`
- Shuffle using Fisher-Yates algorithm
- Match detection with array comparison

### Quiz Maker
- JSON structure: `{questions: [{q, options, correct}]}`
- localStorage for persistence
- Randomize question order option
- Show correct answers after completion

---

## Verification Plan

### Testing
1. **Image Compressor**: Test with large images (>5MB), verify compression, check download
2. **JSON Viewer**: Test with valid/invalid JSON, nested objects, large files
3. **Memory Game**: Test all difficulty levels, verify score tracking
4. **Random Name Picker**: Test with 1-100 names, verify no duplicates in classroom mode
5. **Quiz Maker**: Create quiz with 10 questions, take quiz, verify scoring
6. **Citation Generator**: Generate citations in all 4 formats, verify accuracy
7. **Regex Tester**: Test common patterns (email, URL, phone), verify matches
8. **Code Beautifier**: Test with minified code, verify formatting, test all languages

### Browser Compatibility
- Chrome/Edge ✅
- Firefox ✅
- Safari ✅
- Mobile browsers ✅

---

## Notes
- Keep all tools client-side (no backend)
- Use localStorage for persistence
- Maintain consistent UI/UX with existing tools
- Add haptic feedback on interactions
- Ensure keyboard navigation works
- Add to command palette registry
