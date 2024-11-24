const arr = Array.from({ length: 9 }, (_, i) =>
    Array.from({ length: 9 }, (_, j) => document.getElementById(i * 9 + j))
);

let board = Array.from({ length: 9 }, () => Array(9).fill(0));
let visualizationSpeed = 100; // Default speed in milliseconds

// Update speed based on slider
document.getElementById('speed').addEventListener('input', (e) => {
    visualizationSpeed = parseInt(e.target.value, 10);
});

// Fill the board with values
function fillBoard(board) {
    board.forEach((row, i) =>
        row.forEach((cell, j) => {
            arr[i][j].innerText = cell !== 0 ? cell : '';
        })
    );
}

// Highlight a cell for visualization
function highlightCell(row, col, isBacktracking = false) {
    arr[row][col].classList.add(isBacktracking ? 'highlight-backtrack' : 'highlight');
    setTimeout(() => {
        arr[row][col].classList.remove('highlight', 'highlight-backtrack');
    }, visualizationSpeed);
}

const getPuzzleBtn = document.getElementById('GetPuzzle');
const solvePuzzleBtn = document.getElementById('SolvePuzzle');
const visualizePuzzleBtn = document.getElementById('VisualizePuzzle');

// Fetch a new puzzle
getPuzzleBtn.addEventListener('click', () => {
    fetch('https://sugoku.onrender.com/board?difficulty=easy')
        .then((response) => response.json())
        .then((response) => {
            board = response.board;
            fillBoard(board);
        })
        .catch((error) => console.error('Error fetching puzzle:', error));
});

// Solve the puzzle without visualization
solvePuzzleBtn.addEventListener('click', () => {
    solveSudoku(board);
    fillBoard(board);
});

// Solve the puzzle with visualization
visualizePuzzleBtn.addEventListener('click', async () => {
    const solved = await visualizeSudokuSolver(board, 0, 0, 9);
    if (solved) {
        console.log("Sudoku Solved!");
    } else {
        console.log("No solution exists.");
    }
});

// Check if placing a number is valid
function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;

        const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const boxCol = 3 * Math.floor(col / 3) + (i % 3);
        if (board[boxRow][boxCol] === num) return false;
    }
    return true;
}

// Solve Sudoku without visualization
function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;

                        if (solveSudoku(board)) return true;

                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Solve Sudoku with visualization
async function visualizeSudokuSolver(board, row, col, n) {
    if (row === n) return true;

    const nextRow = col === n - 1 ? row + 1 : row;
    const nextCol = col === n - 1 ? 0 : col + 1;

    if (board[row][col] !== 0) {
        return await visualizeSudokuSolver(board, nextRow, nextCol, n);
    }

    for (let num = 1; num <= 9; num++) {
        if (isValid(board, row, col, num)) {
            board[row][col] = num;
            fillBoard(board);
            highlightCell(row, col);

            await new Promise((resolve) => setTimeout(resolve, visualizationSpeed));

            if (await visualizeSudokuSolver(board, nextRow, nextCol, n)) return true;

            // Backtracking
            board[row][col] = 0;
            fillBoard(board);
            highlightCell(row, col, true);

            await new Promise((resolve) => setTimeout(resolve, visualizationSpeed));
        }
    }
    return false;
}
