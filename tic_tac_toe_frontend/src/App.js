import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Utility function to check for a winner in tic-tac-toe.
 * @param {Array} squares Array representing the game board.
 * @returns {'X' | 'O' | null} Winner if found.
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6],            // Diagonals
  ];
  for (const [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

/**
 * Basic AI player – picks a random empty square.
 * @param {Array} squares Board state.
 * @returns {number|null} Index to move to.
 */
function getAIMove(squares) {
  const emptyIndices = squares
    .map((val, i) => (val ? null : i))
    .filter((i) => i !== null);
  // Slightly smarter: pick winning move or block
  const ai = "O";
  const opponent = "X";
  // Try to win
  for (const idx of emptyIndices) {
    const copy = squares.slice();
    copy[idx] = ai;
    if (calculateWinner(copy) === ai) return idx;
  }
  // Try to block opponent
  for (const idx of emptyIndices) {
    const copy = squares.slice();
    copy[idx] = opponent;
    if (calculateWinner(copy) === opponent) return idx;
  }
  // Else, pick center if available, else random
  if (emptyIndices.includes(4)) return 4;
  return emptyIndices.length ? emptyIndices[Math.floor(Math.random() * emptyIndices.length)] : null;
}

// PUBLIC_INTERFACE
/**
 * Main App component for Tic-Tac-Toe game UI and logic.
 */
function App() {
  // Theme support (preserved from original template)
  const [theme, setTheme] = useState("light");

  // Game state
  const [mode, setMode] = useState("two"); // "two" | "ai"
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState("ongoing"); // "ongoing" | "win" | "draw"
  const [winner, setWinner] = useState(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Check if game ends
  useEffect(() => {
    const win = calculateWinner(board);
    if (win) {
      setStatus("win");
      setWinner(win);
    } else if (board.every((s) => s)) {
      setStatus("draw");
      setWinner(null);
    } else {
      setStatus("ongoing");
      setWinner(null);
    }
  }, [board]);

  // AI move effect
  useEffect(() => {
    if (
      mode === "ai" &&
      !isXNext &&
      status === "ongoing"
    ) {
      // AI is always "O"
      const move = getAIMove(board);
      if (move !== null) {
        const nextBoard = [...board];
        nextBoard[move] = "O";
        setTimeout(() => {
          setBoard(nextBoard);
          setIsXNext(true);
        }, 350); // Delay for realism
      }
    }
    // eslint-disable-next-line
  }, [board, isXNext, mode, status]);

  // PUBLIC_INTERFACE
  /** Handler for board click */
  function handleSquareClick(idx) {
    if (board[idx] || status !== "ongoing") return;
    if (mode === "ai" && !isXNext) return; // Block if AI's turn
    const nextBoard = [...board];
    nextBoard[idx] = isXNext ? "X" : "O";
    setBoard(nextBoard);
    setIsXNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  /** Handler for starting a new game */
  function handleReset() {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setStatus("ongoing");
    setWinner(null);
  }

  // PUBLIC_INTERFACE
  /** Mode selector handler */
  function handleModeChange(e) {
    setMode(e.target.value);
    handleReset();
  }

  /** Get display status message */
  function getStatusText() {
    if (status === "win") {
      return (
        <>
          <span
            style={{
              color: winner === "X" ? "#1976d2" : "#ffd600",
              fontWeight: 700,
              fontSize: 22,
            }}
            data-testid="winner"
          >
            {winner}
          </span>{" "}
          wins!
        </>
      );
    } else if (status === "draw") {
      return (
        <span style={{ color: "#424242" }} data-testid="draw">
          Draw game.
        </span>
      );
    } else {
      return (
        <span>
          Turn:{" "}
          <span
            style={{
              color: isXNext ? "#1976d2" : "#ffd600",
              fontWeight: 700,
              fontSize: 20,
            }}
            data-testid="turn"
          >
            {isXNext ? "X" : "O"}
          </span>
        </span>
      );
    }
  }

  // Main Render
  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-primary)",
      }}
    >
      <header
        style={{
          padding: "40px 0 0 0",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        <button
          className="theme-toggle"
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <h1
          style={{
            fontSize: 32,
            margin: "0 0 16px 0",
            letterSpacing: "0.04em",
            fontWeight: 700,
            color: "#1976d2",
          }}
        >
          Tic-Tac-Toe Classic
        </h1>
        <div
          style={{
            fontSize: 15,
            color: "#424242",
            fontWeight: 400,
            marginBottom: 4,
          }}
        >
          Modern minimalistic, light-themed React game
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Controls */}
        <div
          style={{
            marginBottom: 22,
            display: "flex",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <label 
            htmlFor="game-mode"
            style={{ fontWeight: 500, fontSize: 15, color: "var(--text-primary)" }}
          >
            Mode:
          </label>
          <select
            id="game-mode"
            value={mode}
            onChange={handleModeChange}
            style={{
              border: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
              borderRadius: 8,
              padding: "6px 14px",
              fontWeight: 600,
              fontSize: 15,
              color: "var(--text-primary)",
              outline: "none",
              cursor: "pointer",
              minWidth: 82,
            }}
          >
            <option value="two">Two Players</option>
            <option value="ai">Play vs AI</option>
          </select>
          <button
            onClick={handleReset}
            style={{
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              padding: "8px 18px",
              fontSize: 15,
              cursor: "pointer",
              marginLeft: 4,
              transition: "background .19s",
              letterSpacing: "0.01em",
              boxShadow: "0 2px 8px rgba(25, 118,210,0.03)",
            }}
            data-testid="reset-btn"
          >
            New Game
          </button>
        </div>
        {/* Board */}
        <Board
          squares={board}
          onSquareClick={handleSquareClick}
          isActive={status === "ongoing"}
          winner={winner}
        />
        {/* Status */}
        <div
          style={{
            marginTop: 24,
            minHeight: 28,
            fontSize: 19,
            fontWeight: 500,
            letterSpacing: "0.03em",
            color: "#1A1A1A",
            textAlign: "center",
            width: "100%",
          }}
          aria-live="polite"
        >
          {getStatusText()}
        </div>
      </main>
      <footer style={{
        textAlign: "center",
        padding: "10px 0",
        fontSize: 13,
        color: "rgba(68,68,68,0.34)",
        letterSpacing: "0.01em"
      }}>
        Built with React • KAVIA minimal UI
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Board component displays the tic-tac-toe board and handles rendering squares.
 */
function Board({ squares, onSquareClick, isActive, winner }) {
  // Render 3x3
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 64px)",
        gridTemplateRows: "repeat(3, 64px)",
        gap: 0,
        background: "var(--bg-secondary)",
        borderRadius: 18,
        boxShadow:
          "0 2px 14px 0 rgba(25,118,210,0.09), 0 1.5px 6px 0 rgba(25, 118,210,0.07)",
        margin: "0 auto",
        border: "2px solid var(--border-color)",
        userSelect: "none",
        maxWidth: 270,
      }}
      data-testid="game-board"
    >
      {squares.map((value, i) => (
        <Square
          key={i}
          value={value}
          onClick={() => onSquareClick(i)}
          isActive={isActive}
          highlight={winner && value === winner}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Square component renders a single square in the tic-tac-toe grid.
 */
function Square({ value, onClick, isActive, highlight }) {
  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={isActive && !value ? 0 : -1}
      disabled={!isActive || !!value}
      style={{
        width: 64,
        height: 64,
        background: "var(--bg-primary)",
        outline: "none",
        border:
          "1.5px solid " +
          (highlight
            ? "#ffd600"
            : "var(--border-color)"),
        fontSize: 32,
        color:
          value === "X"
            ? "#1976d2"
            : value === "O"
            ? "#ffd600"
            : "#282c34",
        fontWeight: 700,
        borderRadius: 0,
        transition:
          "background 0.2s, color 0.2s, border 0.21s",
        cursor: !value && isActive ? "pointer" : "default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
      }}
      aria-label={value ? `Square ${value}` : "Empty"}
      data-testid={`square-${value ? value : "empty"}`}
    >
      {value}
    </button>
  );
}

export default App;
