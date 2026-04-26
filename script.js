const boardElement = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const resetBtn = document.getElementById('reset-btn');
let board = [];
let score = 0;

function initGame() {
    board = Array(16).fill(0);
    score = 0;
    scoreElement.innerText = score;
    addTile(); 
    addTile();
    render();
    boardElement.focus(); 
}

function addTile() {
    let empty = board.map((v, i) => v === 0 ? i : null).filter(v => v !== null);
    if (empty.length > 0) {
        board[empty[Math.floor(Math.random() * empty.length)]] = Math.random() > 0.1 ? 2 : 4;
    }
}

function render() {
    boardElement.innerHTML = '';
    board.forEach(value => {
        const tile = document.createElement('div');
        tile.className = 'tile';
        if (value > 0) {
            tile.innerText = value;
            tile.setAttribute('data-value', value);
        }
        boardElement.appendChild(tile);
    });
}

function slide(row) {
    let arr = row.filter(v => v !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] *= 2; score += arr[i]; arr.splice(i + 1, 1);
        }
    }
    while (arr.length < 4) arr.push(0);
    return arr;
}

function move(dir) {
    let old = JSON.stringify(board);
    for (let i = 0; i < 4; i++) {
        let row = [];
        if (dir === 'L' || dir === 'R') {
            row = [board[i*4], board[i*4+1], board[i*4+2], board[i*4+3]];
            if (dir === 'R') row.reverse();
            row = slide(row);
            if (dir === 'R') row.reverse();
            for(let j=0; j<4; j++) board[i*4+j] = row[j];
        } else {
            row = [board[i], board[i+4], board[i+8], board[i+12]];
            if (dir === 'D') row.reverse();
            row = slide(row);
            if (dir === 'D') row.reverse();
            for(let j=0; j<4; j++) board[i+j*4] = row[j];
        }
    }
    if (old !== JSON.stringify(board)) {
        addTile();
        scoreElement.innerText = score;
        render();
    }
}

function handleButtonClick(dir) {
    move(dir);
}

window.addEventListener('keydown', (e) => {
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowLeft') move('L');
        if (e.key === 'ArrowRight') move('R');
        if (e.key === 'ArrowUp') move('U');
        if (e.key === 'ArrowDown') move('D');
    }
});

resetBtn.addEventListener('click', initGame);
window.onload = initGame;