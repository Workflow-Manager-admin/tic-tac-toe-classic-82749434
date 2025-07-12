import React, { useState, useEffect } from "react";
import "./App.css";

/* Color palette for the app */
const COLORS = {
  primary: "#1976d2",   // Blue
  secondary: "#424242", // Dark gray
  accent: "#ffd600",    // Yellow
  bgLight: "#ffffff",
  boardShadow: "rgba(50,50,50,0.08)",
  border: "#e9ecef"
};

const BOARD_SIZE = 3;
const EMPTY = null;

const MODE_LOCAL = "local";
const MODE_AI = "ai";

const PLAYER_X = "X";
const PLAYER_O = "O";

// Basic AI: Pick random empty square
function aiMove(board) {
  const emptySquares = [];
  for (let i = 0; i < BOARD_SIZE; ++i) {
    for (let j = 0; j < BOARD_SIZE; ++j) {
      if (board[i][j] === EMPTY) emptySquares.push([i, j]);
    }
  }
  if (emptySquares.length === 0) return null;
  return emptySquares[Math.floor(Math.random() * emptySquares.length)];
}

// Returns "X", "O", "draw" or null
function calculateWinner(board) {
  // Rows, columns, diagonals
  let checkLines = [];

  // Rows/cols
  for (let i = 0; i < BOARD_SIZE; ++i) {
    checkLines.push(board[i]); // row
    checkLines.push(board.map(row => row[i])); // column
  }
  // Diagonals
  checkLines.push(board.map((row, i) => row[i]));
  checkLines.push(board.map((row, i) => row[BOARD_SIZE - 1 - i]));

  for (const line of checkLines) {
    if (line.every(cell => cell && cell === line[0])) return line[0];
  }
  // Draw: no empty squares
  if (board.flat().every(cell => cell !== EMPTY)) return "draw";
  return null;
}

// Board rendering
function Board({ board, onSquareClick, disabled }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
        gap: 0,
        background: COLORS.bgLight,
        borderRadius: "16px",
        boxShadow: `0 2px 16px 0 ${COLORS.boardShadow}`,
        width: "min(94vw, 370px)",
        aspectRatio: "1 / 1"
      }}
      aria-label="Tic Tac Toe Board"
    >
      {board.map((row, i) =>
        row.map((cell, j) => (
          <button
            key={i + "-" + j}
            className="ttt-square"
            style={{
              borderRight:
                j < BOARD_SIZE - 1
                  ? `1.5px solid ${COLORS.border}`
                  : "none",
              borderBottom:
                i < BOARD_SIZE - 1
                  ? `1.5px solid ${COLORS.border}`
                  : "none",
              background: COLORS.bgLight,
              color: cell === PLAYER_X ? COLORS.primary : COLORS.secondary,
              cursor: disabled || cell ? "default" : "pointer",
              fontWeight: 700
            }}
            aria-label={
              cell
                ? `Cell ${i + 1},${j + 1}, value ${cell}`
                : `Cell ${i + 1},${j + 1}, empty`
            }
            onClick={() =>
              !disabled && !cell ? onSquareClick(i, j) : undefined
            }
            disabled={disabled || !!cell}
          >
            {cell}
          </button>
        ))
      )}
    </div>
  );
}

// Status panel and controls
function GameControls({
  mode,
  setMode,
  onReset,
  winner,
  nextTurn,
  disabled,
  aiThinking
}) {
  return (
    <div className="ttt-controls" style={{ margin: "22px 0 0 0" }}>
      <div className="ttt-modes" style={{ marginBottom: 10 }}>
        <button
          className={`ttt-mode ${mode === MODE_LOCAL ? "active" : ""}`}
          style={{
            background: mode === MODE_LOCAL ? COLORS.primary : COLORS.bgLight,
            color: mode === MODE_LOCAL ? "#fff" : COLORS.secondary,
            border: mode === MODE_LOCAL
              ? `2px solid ${COLORS.primary}`
              : `1.5px solid ${COLORS.border}`,
            marginRight: 4,
            transition: "all 0.15s"
          }}
          onClick={() => setMode(MODE_LOCAL)}
          disabled={aiThinking}
          aria-pressed={mode === MODE_LOCAL}
        >
          👥 2-Player
        </button>
        <button
          className={`ttt-mode ${mode === MODE_AI ? "active" : ""}`}
          style={{
            background: mode === MODE_AI ? COLORS.accent : COLORS.bgLight,
            color: mode === MODE_AI ? COLORS.secondary : COLORS.secondary,
            border: mode === MODE_AI
              ? `2px solid ${COLORS.accent}`
              : `1.5px solid ${COLORS.border}`,
            transition: "all 0.15s"
          }}
          onClick={() => setMode(MODE_AI)}
          disabled={aiThinking}
          aria-pressed={mode === MODE_AI}
        >
          🤖 vs AI
        </button>
      </div>
      <button
        className="ttt-reset"
        style={{
          background: COLORS.secondary,
          color: COLORS.accent,
          border: "none",
          padding: "8px 24px",
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 16,
          cursor: aiThinking ? "not-allowed" : "pointer",
          opacity: aiThinking ? 0.7 : 1,
          boxShadow: "0 2px 6px rgba(60,60,60,0.06)"
        }}
        onClick={onReset}
        disabled={aiThinking}
      >
        ↻ New Game
      </button>
      <div className="ttt-status" style={{ marginTop: 18, fontSize: 20 }}>
        {winner
          ? winner === "draw"
            ? (
              <span style={{color: COLORS.secondary}}>
                🤝 <span style={{ fontWeight: 500 }}>Draw!</span>
              </span>
            )
            : (
              <span>
                🏆 <span style={{ color: winner === PLAYER_X ? COLORS.primary : COLORS.secondary, fontWeight: 700 }}>{winner}</span> wins!
              </span>
            )
          : (
            aiThinking
              ? <span style={{ color: COLORS.accent }}>🤖 Thinking...</span>
              : (
                <span>
                  <span>Next: </span>
                  <span style={{ color: nextTurn === PLAYER_X ? COLORS.primary : COLORS.secondary, fontWeight: 700}}>
                    {nextTurn}
                  </span>
                </span>
              )
          )
        }
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function App() {
  // theme for demo
  const [theme, setTheme] = useState("light");
  // game state
  const [mode, setMode] = useState(MODE_LOCAL);
  const [board, setBoard] = useState(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY)));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");

  // Reset the game
  // PUBLIC_INTERFACE
  const resetGame = () => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY)));
    setXIsNext(true);
    setWinner(null);
    setAiThinking(false);
  };

  // Update winner status on board change
  useEffect(() => {
    const res = calculateWinner(board);
    setWinner(res);
    if (res) setAiThinking(false);
  }, [board]);

  // If AI mode and it's O's turn and not over, make an AI move
  useEffect(() => {
    if (mode === MODE_AI && !winner && !xIsNext) {
      setAiThinking(true);
      const aiDelay = setTimeout(() => {
        const move = aiMove(board);
        if (move && !winner) {
          const [i, j] = move;
          setBoard(prev => {
            const next = prev.map(row => [...row]);
            next[i][j] = PLAYER_O;
            return next;
          });
          setXIsNext(true);
        }
        setAiThinking(false);
      }, 650);
      return () => clearTimeout(aiDelay);
    }
  }, [mode, winner, xIsNext, board]);

  // For changing difficulty, one could easily swap aiMove function to a more advanced one

  // Handle user clicking board cell
  // PUBLIC_INTERFACE
  function handleSquareClick(i, j) {
    if (winner || board[i][j]) return;
    setBoard(prev => {
      const next = prev.map(row => [...row]);
      next[i][j] = xIsNext ? PLAYER_X : PLAYER_O;
      return next;
    });
    setXIsNext(x => !x);
  }

  // Change mode resets the game
  useEffect(() => {
    resetGame();
    // eslint-disable-next-line
    // (no dependency on resetGame to avoid infinite loop)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Apply theme class for demo theme-switcher
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div
      className="App"
      style={{
        background: COLORS.bgLight,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 0,
        fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif"
      }}
      data-theme={theme}
    >
      <header
        className="App-header"
        style={{
          background: "none",
          minHeight: 0,
          paddingTop: 38,
          paddingBottom: 0,
          boxShadow: "none",
          alignItems: "center"
        }}
      >
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <h1
          style={{
            fontFamily: "'Segoe UI Semibold', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 600,
            fontSize: "2.1rem",
            marginTop: 10,
            marginBottom: 18,
            color: COLORS.primary,
            textShadow: "0 1px 0 #fff"
          }}
        >
          Tic-Tac-Toe
        </h1>
        <Board
          board={board}
          onSquareClick={handleSquareClick}
          disabled={!!winner || aiThinking || (mode === MODE_AI && !xIsNext)}
        />
        <GameControls
          mode={mode}
          setMode={setMode}
          onReset={resetGame}
          winner={winner}
          nextTurn={xIsNext ? PLAYER_X : PLAYER_O}
          disabled={!!winner}
          aiThinking={aiThinking}
        />
        <footer
          style={{
            marginTop: 38,
            color: "#adb5bd",
            fontSize: 15,
            opacity: 0.96,
          }}
        >
          <span>
            Made with <span style={{ color: COLORS.accent }}>X</span>s &{" "}
            <span style={{ color: COLORS.primary }}>O</span>s
          </span>
        </footer>
      </header>
    </div>
  );
}
