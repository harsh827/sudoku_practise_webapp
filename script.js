var arr = [[], [], [], [], [], [], [], [], []]
var temp = [[], [], [], [], [], [], [], [], []]

for (var i = 0; i < 9; i++) 
{
    for (var j = 0; j < 9; j++) 
    {
        arr[i][j] = document.getElementById(i * 9 + j);

    }
}

function initializeTemp(temp) 
{

    for (var i = 0; i < 9; i++) 
    {
        for (var j = 0; j < 9; j++) 
        {
            temp[i][j] = false;

        }
    }
}


function setTemp(board, temp) 
{

    for (var i = 0; i < 9; i++) 
    {
        for (var j = 0; j < 9; j++) 
        {
            if (board[i][j] != 0) 
            {
                temp[i][j] = true;
            }

        }
    }
}


function setColor(temp) 
{

    for (var i = 0; i < 9; i++) 
    {
        for (var j = 0; j < 9; j++) 
        {
            if (temp[i][j] == true) 
            {
                arr[i][j].style.color = "#DC3545";
            }

        }
    }
}

function resetColor() 
{

    for (var i = 0; i < 9; i++) 
    {
        for (var j = 0; j < 9; j++) 
        {

            arr[i][j].style.color = "green";


        }
    }
}

var board = [[], [], [], [], [], [], [], [], []]


let button = document.getElementById('generate-sudoku')
let solve = document.getElementById('solve')

console.log(arr)
function changeBoard(board) 
{
    for (var i = 0; i < 9; i++) 
    {
        for (var j = 0; j < 9; j++) 
        {
            if (board[i][j] != 0) 
            {

                arr[i][j].innerText = board[i][j]
            }

            else
                arr[i][j].innerText = ''
        }
    }
}


button.onclick = function () 
{
    var xhrRequest = new XMLHttpRequest()
    xhrRequest.onload = function () 
    {
        var response = JSON.parse(xhrRequest.response)
        console.log(response)
        initializeTemp(temp)
        resetColor()

        board = response.board
        setTemp(board, temp)
        setColor(temp)
        changeBoard(board)
    }
    xhrRequest.open('get', 'https://sugoku.herokuapp.com/board?difficulty=easy')
    //we can change the difficulty of the puzzle the allowed values of difficulty are easy, medium, hard and random
    xhrRequest.send()
}

//if there is 0 in current location
function isPossible(board, sr, sc, val) 
{
    //if that no already present return false
    for (var row = 0; row < 9; row++) 
    {
        if (board[row][sc] == val) 
        {
            return false;
        }
    }

    //if that no already present  return false
    for (var col = 0; col < 9; col++) 
    {
        if (board[sr][col] == val) 
        {
            return false;
        }
    }

    //computing sub-grid cordinates
    var r = sr - sr % 3;
    var c = sc - sc % 3;


     //if no already present in sub-grid,return false
    for (var cr = r; cr < r + 3; cr++) 
    {
        for (var cc = c; cc < c + 3; cc++) 
        {
            if (board[cr][cc] == val) 
            {
                return false;
            }
        }
    }
    return true;

}


function solveSudokuHelper(board, sr, sc) 
{
    
    //row=9,means sudoku solved
    if (sr == 9)  
    {
        changeBoard(board);//to display final board
        return;
    }

    //if col=9,,go to next row
    if (sc == 9) 
    {
        solveSudokuHelper(board, sr + 1, 0)
        return;
    }

    //skip pre filled cell,move to next column sc+1
    if (board[sr][sc] != 0)
    {
        solveSudokuHelper(board, sr, sc + 1);
        return;
    }

    //if reach here,there is 0 in current location
    
    //try to check all values from 1-9

    for (var i = 1; i <= 9; i++) 
    {
        //i=number
        if (isPossible(board, sr, sc, i)) 
        {
            board[sr][sc] = i; //placing value in board
            solveSudokuHelper(board, sr, sc + 1);
            board[sr][sc] = 0; //if value not safe again making it 0 
        }
    }
}

//takes input board which is 2d array
function solveSudoku(board) 
{
    solveSudokuHelper(board, 0, 0)
}

solve.onclick = function () 
{
    solveSudoku(board)

}
