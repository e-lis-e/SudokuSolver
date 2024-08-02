document.addEventListener('DOMContentLoaded', function () {
    const gridSize = 9;
    const solveButton = document.getElementById("solve");
    solveButton.addEventListener('click', solveSudoku);

    const gridSudoku = document.getElementById("grid");

    //create grid
    for(let row = 0; row < gridSize; row++){
        const newRow = document.createElement("tr");
        for(let col = 0; col < gridSize; col++){
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.className = "cell";
            input.id = `cell-${row}-${col}`;
            cell.appendChild(input);
            newRow.appendChild(cell);
        }
        gridSudoku.appendChild(newRow);
    }
});

async function solveSudoku(){
    const gridSize = 9;
    const sudokuArray = [];

    //fill de array with inputs
    for(let row = 0; row < gridSize; row++){
        sudokuArray[row] = [];
        for(let col = 0; col < gridSize; col++){
            const cellId = `cell-${row}-${col}`;
            const cellValue = document.getElementById(cellId).value;
            sudokuArray[row][col] = cellValue !== "" ? parseInt (cellValue) : 0;

        }
    }

    //indentify input
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cellId = `cell-${row}-${col}`; 
            const cell = document.getElementById(cellId)

            if(sudokuArray[row][col] !== 0) {
                cell.classList.add("user-input");
            }
        }
    }

    //solve the puzzle + display solution]
    if(solveSudokuHelper(sudokuArray)) {
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cellId = `cell-${row}-${col}`;
                const cell = document.getElementById(cellId);

                //fill solved values + animation
                if(!cell.classList.contains("user-input")){
                    cell.value = sudokuArray[row][col];
                    cell.classList.add("solved");
                    await sleep(20);
                }
            }
        }
    } else {
        alert("No solution exists for the given puzzle");
    }
}


function solveSudokuHelper(board) {
    const gridSize = 9;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if(board[row][col] === 0){
                for (let num = 0; num <= 9; num++) {
                    if(isValidMove(board, row, col, num)){
                        board[row][col] = num;

                        //attempt to solve the puzzle recursively
                        if(solveSudokuHelper(board)) {
                            return true; //solved
                        }

                        board[row][col] = 0; //backtrack
                    }
                }
                return false; //invalid
            }
            
            
        }
        
    }

    return true;
}

function isValidMove(board, row, col, num){
    const gridSize = 9;

    //check row and col for conflict
    for (let i = 0; i < gridSize; i++) {
        if(board[row][i] === num || board[i][col] === num) {
            return false; //conflict
        }
    }

    //check the subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if(board[i][j] === num){
                return false;
            }
        }
        
    }
    return true
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}