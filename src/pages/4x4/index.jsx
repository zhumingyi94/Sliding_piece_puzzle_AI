import Head from 'next/head'
import React, { useState, useEffect } from 'react';

// Shuffle an array using Fisher-Yates algorithm
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Check if a puzzle is solvable
const isSolvable = (puzzle) => {
  let inversions = 0;
  const puzzleSize = puzzle.length * puzzle[0].length;
  const puzzleArray = puzzle.flat();

  for (let i = 0; i < puzzleSize - 1; i++) {
    for (let j = i + 1; j < puzzleSize; j++) {
      if (puzzleArray[i] && puzzleArray[j] && puzzleArray[i] > puzzleArray[j]) {
        inversions++;
      }
    }
  }

  // For 4x4 puzzle, check if the sum of inversions and row of the empty tile is even
  const emptyTileIndex = puzzleArray.indexOf(0);
  const emptyTileRow = Math.floor(emptyTileIndex / puzzle[0].length) + 1;

  return (inversions % 2 === 0 && emptyTileRow % 2 === 0) || (inversions % 2 !== 0 && emptyTileRow % 2 !== 0);
};

// Create a 4x4 puzzle
const createPuzzle = () => {
  const size = 4;
  const puzzle = Array.from({ length: size }, () => Array.from({ length: size }, (_, i) => i + 1));

  // Set the bottom-right tile as an empty tile (0)
  puzzle[size - 1][size - 1] = 0;

  // Shuffle the puzzle until it's solvable
  do {
    shuffleArray(puzzle.flat());
  } while (!isSolvable(puzzle));

  return puzzle;
};

const Home = () => {
  const [puzzle, setPuzzle] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    setPuzzle(createPuzzle());
  }, []);

  const handleTileClick = (row, col) => {
    if (isTileMovable(row, col)) {
      const newPuzzle = [...puzzle];
      const emptyRow = newPuzzle.findIndex((r) => r.includes(0));
      [newPuzzle[emptyRow][col], newPuzzle[row][col]] = [newPuzzle[row][col], newPuzzle[emptyRow][col]];
      setPuzzle(newPuzzle);
      setMoves(moves + 1);
    }
  };

  const isTileMovable = (row, col) => {
    const emptyRow = puzzle.findIndex((r) => r.includes(0));
    const emptyCol = puzzle[emptyRow].indexOf(0);
    const rowDiff = Math.abs(emptyRow - row);
    const colDiff = Math.abs(emptyCol - col);

    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  };

  const isPuzzleSolved = () => {
    const flatPuzzle = puzzle.flat().slice(0, -1);
    return flatPuzzle.every((tile, index) => tile === index + 1);
  };

  const resetPuzzle = () => {
    setPuzzle(createPuzzle());
    setMoves(0);
  };

  return (
    <div>
      <Head>
        <title>4x4 Sliding Puzzle</title>
        <meta name="description" content="A 4x4 sliding puzzle game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <h1>4x4 Sliding Puzzle</h1>
      <p>Moves: {moves}</p>
      <div className="puzzle">
        {puzzle.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((tile, colIndex) => (
              <div
                key={colIndex}
                className={`tile ${tile === 0 ? 'empty' : ''}`}
                onClick={() => handleTileClick(rowIndex, colIndex)}
              >
                {tile !== 0 && tile}
              </div>
            ))}
          </div>
        ))}
      </div>
      {isPuzzleSolved() && (
        <button onClick={resetPuzzle}>Play Again</button>
      )}
      <style jsx>{`
        .puzzle {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .row {
          display: flex;
        }
        .tile {
          width: 50px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #ddd;
          font-size: 24px;
          cursor: pointer;
        }
        .tile.empty {
          background-color: transparent;
          cursor: default;
        }
      `}</style>
    </div>
  );
};

export default Home;
