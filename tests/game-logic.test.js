import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = process.cwd();
const CLEAN_HTML = fs.readFileSync(path.join(PROJECT_ROOT, 'tests', 'fixtures', 'index.clean.html'), 'utf8');

const SCRIPT_MATCH = CLEAN_HTML.match(/<script>([\s\S]*?)<\/script>/);
const GAME_CODE = SCRIPT_MATCH ? SCRIPT_MATCH[1] : '';

describe('Game Constants', () => {
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

describe('State Object', () => {
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

describe('Game Functions', () => {
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

describe('Question Data', () => {
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

describe('Global Event Handlers', () => {
  it('should have keydown handler', () => expect(GAME_CODE).toContain("document.addEventListener('keydown'"));
});

describe('Setup and Initialization', () => {
  it('should have State.DOM.board', () => expect(GAME_CODE).toContain("State.DOM.board"));
  it('should set board style', () => expect(GAME_CODE).toContain("board.style.setProperty"));
});

describe('Clean HTML Structure', () => {
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