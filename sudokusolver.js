sudokuBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
];//The initial board I will build upon
function resetBoard() {
    sudokuBoard = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
];
}//Resets the board back to zero if necessary.

function fillBase() {
    let usedNumbers = [0];
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j<3; j++) {
            let added = false;
            while(!added) {
                let random = Math.floor(Math.random() * 9) + 1;
                if (!usedNumbers.includes(random)) {
                    sudokuBoard[j][i] = random;
                    added = true;
                    usedNumbers.push(random);
                }
            }
        }
    }//Fills the top left 3x3 cell
    usedNumbers = [0];
    for(let i = 3; i < 6; i++) {
        for(let j = 3; j < 6; j++) {
            let added = false;
            while(!added) {
                let random = Math.floor(Math.random() * 9) + 1;
                if (!usedNumbers.includes(random)) {
                    sudokuBoard[j][i] = random;
                    added = true;
                    usedNumbers.push(random);
                }
            }
        }
    }//Fills the middle 3x3 cell
    usedNumbers = [0];
    for(let i = 6; i < 9; i++) {
        for(let j = 6; j < 9; j++) {
            let added = false;
            while(!added) {
                let random = Math.floor(Math.random() * 9) + 1;
                if (!usedNumbers.includes(random)) {
                    sudokuBoard[j][i] = random;
                    added = true;
                    usedNumbers.push(random);
                }
            }
        }
    }//Fills the bottom right 3x3 cell
}//I fill in these 3 cells because they are entirely unrelated to each other, so I can just fill them with random numbers
function validValue([y,x], val) {
    for(let i = 0; i < 9; i++) {
        if(sudokuBoard[i][x] === val || sudokuBoard[y][i] === val) {
            return false;
        }
    }//Checks thru the column and row that the cell is within, returning false if the same value is found
    const secRow = Math.floor(y/3);
    const secCol = Math.floor(x/3);
    for(let i = secRow * 3; i < secRow * 3 + 3; i++) {
        for(let j = secCol * 3; j < secCol * 3 + 3; j++) {
            if(sudokuBoard[i][j] === val) {
                return false;
            }
        }
    }//Checks thru the 3x3 cell that the given cell is within, and returning false if the same value is found
    return true;
}//Checks the given cell to see if the given value is valid based on the column, row, and 3x3 cell
function findEmpty() {
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            if(sudokuBoard[i][j] === 0) {
                return [i,j];
            }
        }
    }
    return [-1,-1];
}//Returns the first empty cell found, and if none is found then gives a set invalid value
function solve() {
    const [y,x] = findEmpty();
    if(y === -1 && x === -1) {
        return true;
    }//If the sudoku is full, it must be solved.  
    for(let val = 1; val < 10; val++) {
        if(validValue([y,x], val)) {   
            sudokuBoard[y][x] = val;
            if(solve()) {
                return true;
            }
            sudokuBoard[y][x] = 0;
        }
    }
    return false;
}//Recursive function that checks for valid values, and backtracks to the problem value if one makes the sudoku unsolvable
function print() {
    for(let i = 0; i < 9; i++) {
        console.log(sudokuBoard[i].join(" "));
    }
}//Prints the board to the console.
function removeXDigits(digits) {
    while(digits !== 0) {
        let i = Math.floor(Math.random() * 9);
        let j = Math.floor(Math.random() * 9);
        if(sudokuBoard[i][j] !== 0) {
            digits--;
            sudokuBoard[i][j] = 0;
        }
    }
}//Removes the given amount of digits randomly from the board.  
async function solveSlow() {
    const [y,x] = findEmpty();
    if(y === -1 && x === -1) {
        return true;
    }
    for(let val = 1; val < 10; val++) {
        if(validValue([y,x], val)) {   
            sudokuBoard[y][x] = val;
            const cellID = `R${y+1}C${x+1}`;
            document.getElementById(cellID).value = val;
            await new Promise(resolve => setTimeout(resolve, 50));
            if(await solveSlow()) {
                return true;
            }
            sudokuBoard[y][x] = 0;
        }
    }
    return false;
}//The same solve function from before, except it is asynchronous and uses await and promises to make sure the functions dont overlap, but wait on one to finish before another begins
function generateSudoku() {
    resetBoard();
    fillBase();
    solve();
    removeXDigits(40);
    for(let i = 1; i < 10; i++) {
        for(let j = 1; j < 10; j++) {
            const cellID = `R${i}C${j}`;
            let cell = document.getElementById(cellID);
            cell.value = sudokuBoard[i-1][j-1];
            if(sudokuBoard[i-1][j-1] === 0) {
                cell.value = '';
            }
        }
    }
}//When the generate sudoku button is pressed, this runs and fills in the table with a sudoku with 40 missing digits
function solveInstantly() {
    solve();
    for(let i = 1; i < 10; i++) {
        for(let j = 1; j < 10; j++) {
            const cellID = `R${i}C${j}`;
            let cell = document.getElementById(cellID);
            cell.value = sudokuBoard[i-1][j-1];
        }
    }
}//If the check box is not checked, this runs and puts the solution into the table all at once
function solveSwitch() {
    const switched = document.getElementById("steps").checked;
    calibrateBoard();
    if(switched) {
        solveSlow();
    }
    else {
        solveInstantly();
    }
}//Checks if the show steps checkbox is checked, and if it is then run the slow solution, and if not run the instant solution
function constructTable() {
    if(document.getElementById("sudoku-board") !== null) {
        const board = document.getElementById("sudoku-board");
        for (let row = 1; row <= 9; row++) {
            const tr = document.createElement("tr");
            for (let col = 1; col <= 9; col++) {
                const td = document.createElement("td");
                const cellID = `R${row}C${col}`;
                td.innerHTML = `
                <label for="${cellID}" class="sr-only"> Row ${row} Cell ${col}</label>
                <input type="text" autocomplete="off" id="${cellID}" class="sudokucell" maxlength="1">
                `;
                tr.appendChild(td);
            }
        board.appendChild(tr);
        }
}
}//This constructs the table to avoid cumbersome HTML
document.addEventListener('DOMContentLoaded', constructTable);//When the HTML element is loaded, the table will be generated
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.sudokucell').forEach(cell => {//Assigns these listeners to each cell of the sudoku board
    cell.addEventListener('input', function() {
        this.value = this.value.replace(/[^1-9]/g, '');
    });//Uses RegEx to make sure that anything entered into the table is 1-9 which is the only valid sudoku values
    cell.addEventListener('input', function() {
        cell.classList.remove("wrong");
    });//Removes the wrong class when the input is next updated
    cell.addEventListener('input', function() {
        const y = cell.id[1] - '0';
        const x = cell.id[3] - '0';
        solve();
        if(sudokuBoard[y-1][x-1] !== parseInt(this.value)) {
            this.value = '';
            cell.classList.add("wrong");
        }
    });//Stores the valid solution of the board so I can make sure that it is both a valid value and will lead to a solution, if it does not then it is wrong and the wrong class is added to the cell
})
});
function calibrateBoard() {
    for(let i = 1; i < 10; i++) {
        for(let j = 1; j < 10; j++) {
            let cellID = `R${i}C${j}`;
            let value = parseInt(document.getElementById(cellID).value) || 0;
            sudokuBoard[i-1][j-1] = value;
        }
    }
}//Makes sure that the board on the website matches the board stored in javascript, so the player can start solving the sudoku themselves then hit the solve button and watch it be solved later