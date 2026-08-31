const grid = document.getElementById('game-grid');
const statusMessage = document.getElementById('status-message');
const resetButton = document.getElementById('reset-button');
const newGameButton = document.getElementById('new-game-button');
const scoreXElement = document.getElementById('score-x');
const scoreOElement = document.getElementById('score-o');

let board = Array(9).fill(null);
let isXNext = true;
let gameActive = true;
let scoreX = 0;
let scoreO = 0;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const renderGrid = () => {
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.id = `cell-${i}`;
    cell.classList.add(
      'cell',
      'h-24', 'w-full', 'rounded-lg', 'bg-[#21262d]',
      'flex', 'items-center', 'justify-center',
      'text-6xl', 'font-extrabold', 'cursor-pointer',
      'transition-colors', 'duration-150', 'hover:bg-[#30363d]'
    );
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    grid.appendChild(cell);
  }
};

const updateStatus = (message, colorClass = 'text-gray-300') => {
  statusMessage.innerHTML = `<span class="${colorClass}">${message}</span>`;
  statusMessage.classList.remove('bg-indigo-900/50', 'bg-rose-900/50', 'bg-green-900/50', 'bg-gray-700/50');

  if (message.includes('Wins')) {
    statusMessage.classList.add('bg-green-900/50', 'text-green-300');
  } else if (message.includes('Draw')) {
    statusMessage.classList.add('bg-gray-700/50', 'text-gray-300');
  } else {
    const turnClass = isXNext ? 'bg-indigo-900/50' : 'bg-rose-900/50';
    statusMessage.classList.add(turnClass);
  }
};

const checkResult = () => {
  let roundWon = false;
  let winningLine = [];

  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      winningLine = [a, b, c];
      break;
    }
  }

  if (roundWon) {
    const winner = isXNext ? 'O' : 'X';
    gameActive = false;

    if (winner === 'X') {
      scoreX++;
      scoreXElement.textContent = scoreX;
      updateStatus(`Player X Wins!`, 'text-indigo-400');
    } else {
      scoreO++;
      scoreOElement.textContent = scoreO;
      updateStatus(`Player O Wins!`, 'text-rose-400');
    }

    winningLine.forEach(index => {
      document.getElementById(`cell-${index}`).classList.add('bg-green-500', 'text-white', 'scale-105');
    });

    return;
  }

  if (!board.includes(null)) {
    gameActive = false;
    updateStatus(`It's a Draw!`, 'text-gray-300');
    document.querySelectorAll('.cell').forEach(cell => cell.classList.add('bg-gray-700'));
    return;
  }

  isXNext = !isXNext;
  updateStatus(`Player ${isXNext ? 'X' : 'O'}'s turn`);
};

function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(clickedCell.dataset.index);

  if (board[clickedCellIndex] !== null || !gameActive) return;

  const currentPlayer = isXNext ? 'X' : 'O';

  board[clickedCellIndex] = currentPlayer;

  clickedCell.textContent = currentPlayer;
  clickedCell.classList.remove('hover:bg-[#30363d]');
  clickedCell.classList.add(
    currentPlayer === 'X' ? 'text-indigo-400' : 'text-rose-400',
    'bg-[#30363d]',
    'cursor-default'
  );

  checkResult();
}

const handleResetBoard = () => {
  board = Array(9).fill(null);
  gameActive = true;

  renderGrid();
  updateStatus(`Player ${isXNext ? 'X' : 'O'}'s turn`);
};

const handleNewMatch = () => {
  scoreX = 0;
  scoreO = 0;
  scoreXElement.textContent = '0';
  scoreOElement.textContent = '0';
  isXNext = true;

  handleResetBoard();
  updateStatus(`Player X's turn`);
};

resetButton.addEventListener('click', handleResetBoard);
newGameButton.addEventListener('click', handleNewMatch);

renderGrid();
updateStatus(`Player X's turn`);