# Test Prompts & Expected Responses — Ladder Pick

Use these prompts to verify the app works correctly during ChatGPT Developer Mode testing and before submission.

---

## Happy Path (10 scenarios)

### 1. Basic game — all at once
**Prompt:** "Play a ladder game with Alice, Bob, Charlie, and Dana. The prizes are Gold, Silver, Bronze, and Participation."

**Expected:**
- Tool called: `create_game` with 4 players and 4 items, revealMode: "all"
- Widget displayed with results table showing all 4 pairings
- ChatGPT response includes the matching

---

### 2. One-by-one reveal
**Prompt:** "Ladder game for team A, B, C with tasks 1, 2, 3 — reveal one by one."

**Expected:**
- Tool called: `create_game` with revealMode: "one-by-one"
- Widget shows "Reveal Next" button
- Subsequent prompts "reveal next" call `reveal_next` and uncover one pair at a time

---

### 3. Reshuffle
**Prompt:** (After a game) "Reshuffle the results."

**Expected:**
- Tool called: `reshuffle` with the current gameId
- New matching displayed with a different seed

---

### 4. Custom seed for reproducibility
**Prompt:** "Ladder game: players John, Jane; items A, B — seed: myseed123"

**Expected:**
- Tool called: `create_game` with seed: "myseed123"
- Same result every time when using the same seed

---

### 5. Export as text
**Prompt:** "Export the ladder results as text."

**Expected:**
- Tool called: `export_result` with format: "text"
- Formatted table with all pairings and seed shown in response

---

### 6. Export as JSON
**Prompt:** "Export the game results as JSON."

**Expected:**
- Tool called: `export_result` with format: "json"
- JSON string with gameId, seed, revealMode, mapping

---

### 7. Large group (8 people)
**Prompt:** "Random assignment: players Amy, Ben, Cal, Dan, Eve, Fay, Gus, Hal — roles: Scrum Master, Developer ×4, QA, Designer, PM"

**Expected:**
- Tool called: `create_game` with 8 players and 8 items
- Full results table in widget

---

### 8. Emoji names
**Prompt:** "Ladder pick: 🐱, 🐶, 🐭 get 🏆, 🥈, 🥉"

**Expected:**
- Emoji handled correctly; matching produced

---

### 9. Max players (20)
**Prompt:** "Create a ladder game with P1 through P20 matched to I1 through I20."

**Expected:**
- Tool called with 20 players and 20 items; succeeds

---

### 10. Reveal all after one-by-one
**Prompt:** (After starting one-by-one) "Reveal all remaining results."

**Expected:**
- Multiple `reveal_next` calls until all pairs revealed
- Widget shows full table at the end

---

## Error / Negative Scenarios (5 scenarios)

### E1. Too few players
**Prompt:** "Ladder game with just Alice and items: Gold, Silver, Bronze."

**Expected:**
- Mismatch detected; error message: "Number of items must match number of players. You have 1 players and 3 items." (or similar)
- Widget shows inline error, no result displayed

---

### E2. Only 1 player
**Prompt:** "Ladder game with only Alice, prize: Gold."

**Expected:**
- Error: "At least 2 players are required."

---

### E3. Player/item count mismatch
**Prompt:** "Match Alice, Bob, Charlie to Item1, Item2."

**Expected:**
- Error: "Number of items must match number of players. You have 3 players and 2 items."

---

### E4. Empty items
**Prompt:** "Ladder game for Alice, Bob — no items."

**Expected:**
- Error: "Items list cannot be empty."

---

### E5. Special characters in names
**Prompt:** "Ladder pick: players 'A & B', 'C<D>' — items '1>2', '3<4'"

**Expected:**
- Names sanitized/escaped; matching produced without XSS issues

---

## Regression Checklist

- [ ] Same seed always produces the same mapping
- [ ] No duplicate assignments in any match (1:1 integrity)
- [ ] Widget renders without console errors in both web and mobile ChatGPT
- [ ] Reshuffle changes the seed and mapping
- [ ] reveal_next progresses state correctly (no repeats, correct count)
- [ ] export_result does not change game state (readOnly)
- [ ] Error messages appear inline in widget, not as server errors
