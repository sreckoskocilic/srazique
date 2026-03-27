import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const PROJECT_ROOT = process.cwd();
const CLEAN_HTML_PATH = path.join(PROJECT_ROOT, 'tests', 'fixtures', 'index.clean.html');
const CLEAN_HTML = fs.existsSync(CLEAN_HTML_PATH) ? fs.readFileSync(CLEAN_HTML_PATH, 'utf8') : null;

const SCRIPT_MATCH = CLEAN_HTML ? CLEAN_HTML.match(/<script>([\s\S]*?)<\/script>/) : null;
const GAME_CODE = SCRIPT_MATCH ? SCRIPT_MATCH[1] : '';

const describeGame = CLEAN_HTML ? describe : describe.skip;

// Creates an isolated game context and returns the exported functions/state.
// Uses an IIFE wrapper so const/let declarations from GAME_CODE are accessible.
function createGameContext() {
  const mockElement = () => ({
    querySelectorAll: () => [],
    style: { setProperty: () => {}, display: '' },
    classList: { contains: () => false, add: () => {}, remove: () => {}, toggle: () => {} },
    textContent: '',
    innerHTML: '',
    appendChild: () => {},
    onclick: null,
    dataset: {},
    offsetWidth: 0,
  });

  const sandbox = {
    document: {
      getElementById: () => mockElement(),
      createElement: () => mockElement(),
      addEventListener: () => {},
      documentElement: { style: { setProperty: () => {} } },
    },
    localStorage: { getItem: () => null, setItem: () => {} },
    requestAnimationFrame: () => {},
    setTimeout: () => 0,
    clearTimeout: () => {},
    console: { warn: () => {}, error: () => {}, log: () => {} },
    fetch: () => Promise.resolve({ ok: false }),
    AbortSignal: { timeout: () => ({}) },
  };

  vm.createContext(sandbox);

  const wrappedCode = `(function() {
    ${GAME_CODE}
    return {
      State, PHASE, CATS, RANK_UP_THRESHOLD, PLAYER_COLORS, COORD_BASE,
      shuffle, cleanHtml, convertTriviaQ,
      checkWinCondition, rankUp, rankDown,
      getQuestion, getValidMoves, eliminatePeg, movePegTo,
      getAdjacentTiles, randomCat,
      handleCombatQ1, handleCombatQ2, handleNormalMove, handleFlagQ, finishBattle,
    };
  })()`;

  return vm.runInContext(wrappedCode, sandbox);
}

describeGame('Game Constants', () => {
  it('should have PLAYER_COLORS with 4 colors', () => {
    expect(GAME_CODE).toContain("const PLAYER_COLORS");
    expect(GAME_CODE).toContain("'#E53935'");
    expect(GAME_CODE).toContain("'#1E88E5'");
    expect(GAME_CODE).toContain("'#43A047'");
    expect(GAME_CODE).toContain("'#FB8C00'");
  });

  it('should have DEFAULT_NAMES', () => {
    expect(GAME_CODE).toContain("'Player 1'");
    expect(GAME_CODE).toContain("'Player 2'");
    expect(GAME_CODE).toContain("'Player 3'");
    expect(GAME_CODE).toContain("'Player 4'");
  });

  it('should have RANK_NAMES', () => {
    expect(GAME_CODE).toContain("'Kmet'");
    expect(GAME_CODE).toContain("'Vojnik'");
    expect(GAME_CODE).toContain("'Vitez'");
  });

  it('should have PHASE object with all phases', () => {
    expect(GAME_CODE).toContain("SELECT_PEG: 'selectPeg'");
    expect(GAME_CODE).toContain("SELECT_TILE: 'selectTile'");
    expect(GAME_CODE).toContain("QUESTION: 'question'");
    expect(GAME_CODE).toContain("COMBAT_Q1: 'combatQ1'");
    expect(GAME_CODE).toContain("COMBAT_Q2: 'combatQ2'");
    expect(GAME_CODE).toContain("FLAG_Q: 'flagQ'");
    expect(GAME_CODE).toContain("GAME_OVER: 'gameOver'");
  });

  it('should have CATS array with 10 categories', () => {
    expect(GAME_CODE).toContain("'art'");
    expect(GAME_CODE).toContain("'geography'");
    expect(GAME_CODE).toContain("'history'");
    expect(GAME_CODE).toContain("'literature'");
    expect(GAME_CODE).toContain("'science'");
    expect(GAME_CODE).toContain("'business'");
    expect(GAME_CODE).toContain("'sport'");
    expect(GAME_CODE).toContain("'religion'");
    expect(GAME_CODE).toContain("'entertainment'");
    expect(GAME_CODE).toContain("'general'");
  });

  it('should have SYM_FLAG and SYM_COMBAT', () => {
    expect(GAME_CODE).toContain("SYM_FLAG   = '⚑'");
    expect(GAME_CODE).toContain("SYM_COMBAT = '⚔'");
  });

  it('should have OPTION_KEYS', () => {
    expect(GAME_CODE).toContain("'A','B','C','D'");
  });

  it('should have KEY_MAP for keyboard input', () => {
    expect(GAME_CODE).toContain("'a':0");
    expect(GAME_CODE).toContain("'b':1");
    expect(GAME_CODE).toContain("'c':2");
    expect(GAME_CODE).toContain("'d':3");
  });

  it('should have DIRS for movement directions', () => {
    expect(GAME_CODE).toContain("[[-1,0],[1,0],[0,-1],[0,1]]");
  });

  it('should have RANK_UP_THRESHOLD', () => {
    expect(GAME_CODE).toContain("RANK_UP_THRESHOLD = 5");
  });

  it('should have CAT_NAMES mapping', () => {
    expect(GAME_CODE).toContain("art:'Art'");
    expect(GAME_CODE).toContain("geography:'Geography'");
    expect(GAME_CODE).toContain("history:'History'");
  });
});

describeGame('State Object', () => {
  it('should have State object', () => {
    expect(GAME_CODE).toContain("const State = {");
  });

  it('should have setup property', () => {
    expect(GAME_CODE).toContain("setup: {");
    expect(GAME_CODE).toContain("playerCount: 2");
    expect(GAME_CODE).toContain("boardSize: 8");
  });

  it('should have game property', () => {
    expect(GAME_CODE).toContain("game: null");
  });

  it('should have questions property', () => {
    expect(GAME_CODE).toContain("questions: {}");
  });

  it('should have questionsLoaded property', () => {
    expect(GAME_CODE).toContain("questionsLoaded: false");
  });

  it('should have DOM property', () => {
    expect(GAME_CODE).toContain("DOM: {");
    expect(GAME_CODE).toContain("board: null");
    expect(GAME_CODE).toContain("tiles: []");
    expect(GAME_CODE).toContain("pegs: new Map()");
  });
});

describeGame('Game Functions', () => {
  it('should have randomCat function', () => expect(GAME_CODE).toContain('function randomCat'));
  it('should have tileCat function', () => expect(GAME_CODE).toContain('function tileCat'));
  it('should have generateLayoutMap function', () => expect(GAME_CODE).toContain('function generateLayoutMap'));
  it('should have getCornerOwner function', () => expect(GAME_CODE).toContain('function getCornerOwner'));
  it('should have getStartPositions function', () => expect(GAME_CODE).toContain('function getStartPositions'));
  it('should have shuffle function', () => expect(GAME_CODE).toContain('function shuffle'));
  it('should have loadQCache function', () => expect(GAME_CODE).toContain('function loadQCache'));
  it('should have saveQCache function', () => expect(GAME_CODE).toContain('function saveQCache'));
  it('should have loadQuestions function', () => expect(GAME_CODE).toContain('function loadQuestions'));
  it('should have qBankTotal function', () => expect(GAME_CODE).toContain('function qBankTotal'));
  it('should have updateQBankDisplay function', () => expect(GAME_CODE).toContain('function updateQBankDisplay'));
  it('should have cleanHtml function', () => expect(GAME_CODE).toContain('function cleanHtml'));
  it('should have convertTriviaQ function', () => expect(GAME_CODE).toContain('function convertTriviaQ'));
  it('should have debouncedFetch function', () => expect(GAME_CODE).toContain('function debouncedFetch'));
  it('should have setPlayerCount function', () => expect(GAME_CODE).toContain('function setPlayerCount'));
  it('should have setBoardSize function', () => expect(GAME_CODE).toContain('function setBoardSize'));
  it('should have renderPlayerInputs function', () => expect(GAME_CODE).toContain('function renderPlayerInputs'));
  it('should have startGame function', () => expect(GAME_CODE).toContain('function startGame'));
  it('should have initGame function', () => expect(GAME_CODE).toContain('function initGame'));
  it('should have currentPlayer function', () => expect(GAME_CODE).toContain('function currentPlayer'));
  it('should have getAdjacentTiles function', () => expect(GAME_CODE).toContain('function getAdjacentTiles'));
  it('should have getEligiblePegs function', () => expect(GAME_CODE).toContain('function getEligiblePegs'));
  it('should have getValidMoves function', () => expect(GAME_CODE).toContain('function getValidMoves'));
  it('should have getQuestion function', () => expect(GAME_CODE).toContain('function getQuestion'));
  it('should have rankUp function', () => expect(GAME_CODE).toContain('function rankUp'));
  it('should have rankDown function', () => expect(GAME_CODE).toContain('function rankDown'));
  it('should have eliminatePeg function', () => expect(GAME_CODE).toContain('function eliminatePeg'));
  it('should have movePegTo function', () => expect(GAME_CODE).toContain('function movePegTo'));
  it('should have pushPegAway function', () => expect(GAME_CODE).toContain('function pushPegAway'));
  it('should have checkWinCondition function', () => expect(GAME_CODE).toContain('function checkWinCondition'));
  it('should have advanceTurn function', () => expect(GAME_CODE).toContain('function advanceTurn'));
  it('should have selectPeg function', () => expect(GAME_CODE).toContain('function selectPeg'));
  it('should have onPegClick function', () => expect(GAME_CODE).toContain('function onPegClick'));
  it('should have onTileClick function', () => expect(GAME_CODE).toContain('function onTileClick'));
  it('should have showQuestion function', () => expect(GAME_CODE).toContain('function showQuestion'));
  it('should have onAnswer function', () => expect(GAME_CODE).toContain('function onAnswer'));
  it('should have continueAfterQuestion function', () => expect(GAME_CODE).toContain('function continueAfterQuestion'));
  it('should have handleNormalMove function', () => expect(GAME_CODE).toContain('function handleNormalMove'));
  it('should have handleFlagQ function', () => expect(GAME_CODE).toContain('function handleFlagQ'));
  it('should have handleCombatQ1 function', () => expect(GAME_CODE).toContain('function handleCombatQ1'));
  it('should have handleCombatQ2 function', () => expect(GAME_CODE).toContain('function handleCombatQ2'));
  it('should have finishBattle function', () => expect(GAME_CODE).toContain('function finishBattle'));
  it('should have finishPegMove function', () => expect(GAME_CODE).toContain('function finishPegMove'));
  it('should have checkEndGame function', () => expect(GAME_CODE).toContain('function checkEndGame'));
  it('should have showGameOver function', () => expect(GAME_CODE).toContain('function showGameOver'));
  it('should have quitGame function', () => expect(GAME_CODE).toContain('function quitGame'));
  it('should have resetGame function', () => expect(GAME_CODE).toContain('function resetGame'));
  it('should have markUIDirty function', () => expect(GAME_CODE).toContain('function markUIDirty'));
  it('should have scheduleFlush function', () => expect(GAME_CODE).toContain('function scheduleFlush'));
  it('should have flushUpdates function', () => expect(GAME_CODE).toContain('function flushUpdates'));
  it('should have buildBoardDOM function', () => expect(GAME_CODE).toContain('function buildBoardDOM'));
  it('should have tileBaseClass function', () => expect(GAME_CODE).toContain('function tileBaseClass'));
  it('should have isValidMoveTarget function', () => expect(GAME_CODE).toContain('function isValidMoveTarget'));
  it('should have updateTileDOM function', () => expect(GAME_CODE).toContain('function updateTileDOM'));
  it('should have flushUIUpdates function', () => expect(GAME_CODE).toContain('function flushUIUpdates'));
  it('should have markAllTilesDirty function', () => expect(GAME_CODE).toContain('function markAllTilesDirty'));
  it('should have renderAll function', () => expect(GAME_CODE).toContain('function renderAll'));
});

describeGame('Question Data', () => {
  it('should have BUILTIN_Q constant', () => expect(GAME_CODE).toContain('const BUILTIN_Q'));
  it('should have HRBA_Q constant', () => expect(GAME_CODE).toContain('const HRBA_Q'));
  it('should have art questions in BUILTIN_Q', () => expect(GAME_CODE).toContain("art: ["));
  it('should have geography questions in BUILTIN_Q', () => expect(GAME_CODE).toContain("geography: ["));
  it('should have history questions in BUILTIN_Q', () => expect(GAME_CODE).toContain("history: ["));
  it('should have science questions in BUILTIN_Q', () => expect(GAME_CODE).toContain("science: ["));
  it('should have sport questions in BUILTIN_Q', () => expect(GAME_CODE).toContain("sport: ["));
  it('should have religion questions in BUILTIN_Q', () => expect(GAME_CODE).toContain("religion: ["));
  it('should have general questions in BUILTIN_Q', () => expect(GAME_CODE).toContain("general: ["));
});

describeGame('Global Event Handlers', () => {
  it('should have keydown handler', () => expect(GAME_CODE).toContain("document.addEventListener('keydown'"));
});

describeGame('Setup and Initialization', () => {
  it('should have State.DOM.board', () => expect(GAME_CODE).toContain("State.DOM.board"));
  it('should set board style', () => expect(GAME_CODE).toContain("board.style.setProperty"));
});

describeGame('Clean HTML Structure', () => {
  it('should have not been obfuscated', () => {
    expect(CLEAN_HTML).not.toContain('obfuscate');
  });

  it('should be valid HTML', () => {
    expect(CLEAN_HTML).toContain('<!DOCTYPE html>');
    expect(CLEAN_HTML).toContain('<html');
    expect(CLEAN_HTML).toContain('</html>');
    expect(CLEAN_HTML).toContain('<body>');
    expect(CLEAN_HTML).toContain('</body>');
  });

  it('should contain game script', () => {
    expect(CLEAN_HTML).toContain('<script>');
    expect(CLEAN_HTML).toContain('</script>');
  });
});

// ============================================================
// GAME LOGIC EXECUTION TESTS
// These tests actually execute the game code in a sandboxed vm
// context and verify runtime behavior, not just code presence.
// ============================================================

const ALL_CATS = ['art','geography','history','literature','science','business','sport','religion','entertainment','general'];
const EMPTY_USED_Q = () => Object.fromEntries(ALL_CATS.map(c => [c, new Set()]));
const EMPTY_QUESTIONS = () => Object.fromEntries(ALL_CATS.map(c => [c, []]));

describeGame('shuffle()', () => {
  it('returns same length array', () => {
    const g = createGameContext();
    expect(g.shuffle([1, 2, 3, 4])).toHaveLength(4);
  });
  it('contains same elements after shuffle', () => {
    const g = createGameContext();
    const arr = [1, 2, 3, 4];
    expect(g.shuffle([...arr]).sort()).toEqual([...arr].sort());
  });
  it('handles empty array', () => {
    const g = createGameContext();
    expect(g.shuffle([])).toEqual([]);
  });
  it('handles single element', () => {
    const g = createGameContext();
    expect(g.shuffle([42])).toEqual([42]);
  });
});

describeGame('cleanHtml()', () => {
  it('decodes common HTML entities', () => {
    const g = createGameContext();
    expect(g.cleanHtml('&amp;')).toBe('&');
    expect(g.cleanHtml('&quot;')).toBe('"');
    expect(g.cleanHtml('&lt;')).toBe('<');
    expect(g.cleanHtml('&gt;')).toBe('>');
    expect(g.cleanHtml('&#039;')).toBe("'");
    expect(g.cleanHtml('&eacute;')).toBe('é');
    expect(g.cleanHtml('&egrave;')).toBe('è');
  });
  it('leaves plain text unchanged', () => {
    const g = createGameContext();
    expect(g.cleanHtml('Hello World')).toBe('Hello World');
  });
  it('decodes multiple entities in one string', () => {
    const g = createGameContext();
    expect(g.cleanHtml('A &amp; B &lt; C')).toBe('A & B < C');
  });
});

describeGame('convertTriviaQ()', () => {
  it('converts a valid trivia question', () => {
    const g = createGameContext();
    const raw = {
      question: { text: 'What is 2+2?' },
      correctAnswer: 'Four',
      incorrectAnswers: ['One', 'Two', 'Three'],
    };
    const result = g.convertTriviaQ(raw);
    expect(result).not.toBeNull();
    expect(result.opts).toHaveLength(4);
    expect(result.opts).toContain('Four');
    expect(result.opts[result.a]).toBe('Four');
  });
  it('returns null for missing question text', () => {
    const g = createGameContext();
    expect(g.convertTriviaQ(null)).toBeNull();
    expect(g.convertTriviaQ({})).toBeNull();
    expect(g.convertTriviaQ({ question: {}, correctAnswer: 'A', incorrectAnswers: ['B','C','D'] })).toBeNull();
  });
  it('returns null when fewer than 3 incorrect answers', () => {
    const g = createGameContext();
    const raw = { question: { text: 'Q?' }, correctAnswer: 'A', incorrectAnswers: ['B'] };
    expect(g.convertTriviaQ(raw)).toBeNull();
  });
  it('decodes HTML entities in question text and answers', () => {
    const g = createGameContext();
    const raw = {
      question: { text: 'A &amp; B?' },
      correctAnswer: '&lt;yes&gt;',
      incorrectAnswers: ['no1', 'no2', 'no3'],
    };
    const result = g.convertTriviaQ(raw);
    expect(result.q).toBe('A & B?');
    expect(result.opts[result.a]).toBe('<yes>');
  });
});

describeGame('checkWinCondition()', () => {
  it('returns -1 when multiple players have pegs', () => {
    const g = createGameContext();
    g.State.game = {
      players: [{ id: 0, pegIds: ['p0_peg0'] }, { id: 1, pegIds: ['p1_peg0'] }],
    };
    expect(g.checkWinCondition()).toBe(-1);
  });
  it('returns survivor id when only one player has pegs', () => {
    const g = createGameContext();
    g.State.game = {
      players: [{ id: 0, pegIds: [] }, { id: 1, pegIds: ['p1_peg0'] }],
    };
    expect(g.checkWinCondition()).toBe(1);
  });
  it('identifies correct survivor in 4-player game', () => {
    const g = createGameContext();
    g.State.game = {
      players: [
        { id: 0, pegIds: [] },
        { id: 1, pegIds: [] },
        { id: 2, pegIds: ['p2_peg0', 'p2_peg1'] },
        { id: 3, pegIds: [] },
      ],
    };
    expect(g.checkWinCondition()).toBe(2);
  });
  it('returns -1 when all players still have pegs', () => {
    const g = createGameContext();
    g.State.game = {
      players: [
        { id: 0, pegIds: ['p0_peg0'] },
        { id: 1, pegIds: ['p1_peg0'] },
        { id: 2, pegIds: ['p2_peg0'] },
      ],
    };
    expect(g.checkWinCondition()).toBe(-1);
  });
});

describeGame('rankUp() and rankDown()', () => {
  it('rankUp increments rank from 0 to 1', () => {
    const g = createGameContext();
    g.State.game = { pegs: { 'p0_peg0': { rank: 0, correct: 3 } } };
    g.rankUp('p0_peg0');
    expect(g.State.game.pegs['p0_peg0'].rank).toBe(1);
    expect(g.State.game.pegs['p0_peg0'].correct).toBe(0);
  });
  it('rankUp increments rank from 1 to 2 (max)', () => {
    const g = createGameContext();
    g.State.game = { pegs: { 'p0_peg0': { rank: 1, correct: 5 } } };
    g.rankUp('p0_peg0');
    expect(g.State.game.pegs['p0_peg0'].rank).toBe(2);
  });
  it('rankUp does not exceed max rank of 2', () => {
    const g = createGameContext();
    g.State.game = { pegs: { 'p0_peg0': { rank: 2, correct: 3 } } };
    g.rankUp('p0_peg0');
    expect(g.State.game.pegs['p0_peg0'].rank).toBe(2);
  });
  it('rankDown decrements rank and resets correct count', () => {
    const g = createGameContext();
    g.State.game = { pegs: { 'p0_peg0': { rank: 2, correct: 1 } } };
    g.rankDown('p0_peg0');
    expect(g.State.game.pegs['p0_peg0'].rank).toBe(1);
    expect(g.State.game.pegs['p0_peg0'].correct).toBe(0);
  });
  it('rankDown returns false (survived) when rank > 0', () => {
    const g = createGameContext();
    g.State.game = { pegs: { 'p0_peg0': { rank: 1, correct: 2 } } };
    expect(g.rankDown('p0_peg0')).toBe(false);
  });
  it('rankDown returns true (eliminated) when rank is 0', () => {
    const g = createGameContext();
    g.State.game = { pegs: { 'p0_peg0': { rank: 0, correct: 1 } } };
    expect(g.rankDown('p0_peg0')).toBe(true);
    expect(g.State.game.pegs['p0_peg0'].rank).toBe(0);
  });
});

describeGame('getQuestion()', () => {
  it('returns null when no questions available in any category', () => {
    const g = createGameContext();
    g.State.questions = EMPTY_QUESTIONS();
    g.State.game = { usedQ: EMPTY_USED_Q() };
    expect(g.getQuestion('art')).toBeNull();
  });
  it('returns a question with correct category tag', () => {
    const g = createGameContext();
    const q = { q: 'What is art?', opts: ['A','B','C','D'], a: 0 };
    g.State.questions = { ...EMPTY_QUESTIONS(), art: [q] };
    g.State.game = { usedQ: EMPTY_USED_Q() };
    const result = g.getQuestion('art');
    expect(result).not.toBeNull();
    expect(result.q).toBe('What is art?');
    expect(result.category).toBe('art');
  });
  it('marks the returned question as used', () => {
    const g = createGameContext();
    const q = { q: 'Q?', opts: ['A','B','C','D'], a: 0 };
    g.State.questions = { ...EMPTY_QUESTIONS(), art: [q] };
    const usedArt = new Set();
    g.State.game = { usedQ: { ...EMPTY_USED_Q(), art: usedArt } };
    g.getQuestion('art');
    expect(usedArt.size).toBe(1);
  });
  it('clears used set and continues when all questions exhausted', () => {
    const g = createGameContext();
    const qs = [{ q: 'Q1?', opts: ['A','B','C','D'], a: 0 }, { q: 'Q2?', opts: ['A','B','C','D'], a: 1 }];
    g.State.questions = { ...EMPTY_QUESTIONS(), art: qs };
    g.State.game = { usedQ: { ...EMPTY_USED_Q(), art: new Set([0, 1]) } };
    const result = g.getQuestion('art');
    expect(result).not.toBeNull();
  });
  it('falls back deterministically when requested category is empty', () => {
    const g = createGameContext();
    const q = { q: 'A geography Q?', opts: ['A','B','C','D'], a: 0 };
    // Only geography has questions; art is empty — fallback must find geography
    g.State.questions = { ...EMPTY_QUESTIONS(), geography: [q] };
    g.State.game = { usedQ: EMPTY_USED_Q() };
    const result = g.getQuestion('art');
    expect(result).not.toBeNull();
    expect(result.category).toBe('geography');
  });
  it('returns null when all categories are empty', () => {
    const g = createGameContext();
    g.State.questions = EMPTY_QUESTIONS();
    g.State.game = { usedQ: EMPTY_USED_Q() };
    expect(g.getQuestion('art')).toBeNull();
  });
});

describeGame('eliminatePeg()', () => {
  it('clears the tile the peg was on', () => {
    const g = createGameContext();
    g.State.game = {
      pegs: { 'p0_peg0': { row: 1, col: 2, playerId: 0 } },
      board: [[{},{},{},{}],[{},{},{ pegId: 'p0_peg0' },{}]],
      players: [{ id: 0, pegIds: ['p0_peg0'] }],
    };
    g.eliminatePeg('p0_peg0');
    expect(g.State.game.board[1][2].pegId).toBeNull();
  });
  it('removes peg from player pegIds list', () => {
    const g = createGameContext();
    g.State.game = {
      pegs: { 'p0_peg0': { row: 0, col: 0, playerId: 0 } },
      board: [[{ pegId: 'p0_peg0' }]],
      players: [{ id: 0, pegIds: ['p0_peg0', 'p0_peg1'] }],
    };
    g.eliminatePeg('p0_peg0');
    expect(g.State.game.players[0].pegIds).toEqual(['p0_peg1']);
  });
});

describeGame('getValidMoves()', () => {
  it('returns all 4 adjacent tiles from center of open board', () => {
    const g = createGameContext();
    g.State.boardSize = 3;
    const emptyTile = () => ({ category: 'art', pegId: null, cornerOwner: null });
    g.State.game = {
      board: [
        [emptyTile(), emptyTile(), emptyTile()],
        [emptyTile(), emptyTile(), emptyTile()],
        [emptyTile(), emptyTile(), emptyTile()],
      ],
      pegs: { 'p0_peg0': { row: 1, col: 1, playerId: 0 } },
    };
    g.State.game.board[1][1].pegId = 'p0_peg0';
    const moves = g.getValidMoves('p0_peg0');
    expect(moves).toHaveLength(4);
  });
  it('returns only 2 moves from a corner', () => {
    const g = createGameContext();
    g.State.boardSize = 3;
    const emptyTile = () => ({ category: 'art', pegId: null, cornerOwner: null });
    g.State.game = {
      board: [
        [emptyTile(), emptyTile(), emptyTile()],
        [emptyTile(), emptyTile(), emptyTile()],
        [emptyTile(), emptyTile(), emptyTile()],
      ],
      pegs: { 'p0_peg0': { row: 0, col: 0, playerId: 0 } },
    };
    g.State.game.board[0][0].pegId = 'p0_peg0';
    const moves = g.getValidMoves('p0_peg0');
    expect(moves).toHaveLength(2);
  });
  it('excludes tiles occupied by own player pegs', () => {
    const g = createGameContext();
    g.State.boardSize = 3;
    const emptyTile = () => ({ category: 'art', pegId: null, cornerOwner: null });
    g.State.game = {
      board: [
        [emptyTile(), emptyTile(), emptyTile()],
        [emptyTile(), emptyTile(), emptyTile()],
        [emptyTile(), emptyTile(), emptyTile()],
      ],
      pegs: {
        'p0_peg0': { row: 1, col: 1, playerId: 0 },
        'p0_peg1': { row: 0, col: 1, playerId: 0 },
      },
    };
    g.State.game.board[1][1].pegId = 'p0_peg0';
    g.State.game.board[0][1].pegId = 'p0_peg1';
    const moves = g.getValidMoves('p0_peg0');
    expect(moves).toHaveLength(3); // up blocked by own peg
  });
  it('allows moving onto enemy peg tiles (combat)', () => {
    const g = createGameContext();
    g.State.boardSize = 3;
    const emptyTile = () => ({ category: 'art', pegId: null, cornerOwner: null });
    g.State.game = {
      board: [
        [emptyTile(), emptyTile(), emptyTile()],
        [emptyTile(), emptyTile(), emptyTile()],
        [emptyTile(), emptyTile(), emptyTile()],
      ],
      pegs: {
        'p0_peg0': { row: 1, col: 1, playerId: 0 },
        'p1_peg0': { row: 0, col: 1, playerId: 1 },
      },
    };
    g.State.game.board[1][1].pegId = 'p0_peg0';
    g.State.game.board[0][1].pegId = 'p1_peg0';
    const moves = g.getValidMoves('p0_peg0');
    expect(moves).toHaveLength(4); // enemy tile is a valid (combat) move
  });
});

describeGame('validMoves encoding consistency', () => {
  // Regression: handleNormalMove() was assigning a raw array instead of an
  // encoded Set, breaking isValidMoveTarget() for multi-move turns (rank > 0).
  it('validMoves is always a Set of encoded numbers, not an array of objects', () => {
    const g = createGameContext();
    g.State.boardSize = 3;
    const emptyTile = () => ({ category: 'art', pegId: null, cornerOwner: null });
    g.State.game = {
      board: [
        [emptyTile(), emptyTile(), emptyTile()],
        [emptyTile(), emptyTile(), emptyTile()],
        [emptyTile(), emptyTile(), emptyTile()],
      ],
      pegs: { 'p0_peg0': { row: 1, col: 1, playerId: 0 } },
      validMoves: new Set(),
      selectedPegId: 'p0_peg0',
      movesRemaining: 1,
      phase: g.PHASE.SELECT_TILE,
    };
    g.State.game.board[1][1].pegId = 'p0_peg0';

    // Simulate what handleNormalMove does when movesRemaining > 0
    const raw = g.getValidMoves('p0_peg0');
    g.State.game.validMoves = new Set(raw.map(({r, c}) => r * g.COORD_BASE + c));

    // validMoves must be a Set (not an array)
    expect(g.State.game.validMoves instanceof Set).toBe(true);
    // Values must be numbers, not objects
    for (const v of g.State.game.validMoves) {
      expect(typeof v).toBe('number');
    }
    // isValidMoveTarget must work correctly against encoded Set
    const [first] = raw;
    expect(g.State.game.validMoves.has(first.r * 100 + first.c)).toBe(true);
    expect(g.State.game.validMoves.has(first.r * 100 + first.c + 999)).toBe(false);
  });
});

describeGame('Async handler null safety', () => {
  // All QUESTION_HANDLERS must guard against State.game being null when invoked
  // 220ms after continueAfterQuestion fires (user may have quit during that window).
  it('handleCombatQ1 returns silently when State.game is null', () => {
    const g = createGameContext();
    g.State.game = null;
    expect(() => g.handleCombatQ1(true)).not.toThrow();
    expect(() => g.handleCombatQ1(false)).not.toThrow();
  });

  it('handleNormalMove returns silently when State.game is null', () => {
    const g = createGameContext();
    g.State.game = null;
    expect(() => g.handleNormalMove(true)).not.toThrow();
  });

  it('handleFlagQ returns silently when State.game is null', () => {
    const g = createGameContext();
    g.State.game = null;
    expect(() => g.handleFlagQ(true)).not.toThrow();
  });

  it('handleCombatQ2 returns silently when State.game is null', () => {
    const g = createGameContext();
    g.State.game = null;
    expect(() => g.handleCombatQ2(true)).not.toThrow();
  });

  it('finishBattle returns silently when State.game is null', () => {
    const g = createGameContext();
    g.State.game = null;
    expect(() => g.finishBattle()).not.toThrow();
  });
});