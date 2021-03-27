import { useState, useEffect } from 'react';
import Tile from './Tile.js';
import logo from '../logo.svg';
import '../App.css';

function App() {

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  // Function to create initial board
  const createBoard = (size) => {
    let board = [];

    for (let i = 0; i < size; i ++) {
      board.push(new Array(size).fill('b'));
    }

    // create mine locations
    let mines = [];
    while (mines.length < size) {
      let row = getRandomInt(0, size);
      let col = getRandomInt(0, size);
      let mineLocation = `${row},${col}`;
      if (!mines.includes(mineLocation)) {
        mines.push(mineLocation);
      }
    };

    // console.log('mines:', mines)

    // insert mines
    for (let i = 0; i < mines.length; i ++) {
      let loc = mines[i].split(',');
      // console.log(loc);
      let row = Number(loc[0]);
      let col = Number(loc[1]);
      // console.log(row, col)
      board[row][col] = 'm';
    }

    return board;
  }

  // Function to modify board based on click
  const modifier = (board, row, col) => {
    // If clicked on an already detected blank
    if (board[row][col] === 'db' || board[row][col] === 'dm') {
        return;
    }
    // If clicked on a mine
    if (board[row][col] === 'm') {
        board[row][col] = 'dm'
        return;
    }

    let adjacentMines = 0;

    let mines = ['m', 'dm']

    if (mines.includes(board[row-1]?.[col-1])) {
        adjacentMines ++;
    }
    if (mines.includes(board[row-1]?.[col])) {
        adjacentMines ++;
    }
    if (mines.includes(board[row-1]?.[col+1])) {
        adjacentMines ++;
    }
    if (mines.includes(board[row]?.[col-1])) {
        adjacentMines ++;
    }
    if (mines.includes(board[row]?.[col+1])) {
        adjacentMines ++;
    }
    if (mines.includes(board[row+1]?.[col-1])) {
        adjacentMines ++;
    }
    if (mines.includes(board[row+1]?.[col])) {
        adjacentMines ++;
    }
    if (mines.includes(board[row+1]?.[col+1])) {
        adjacentMines ++;
    }

    // Are any adjacent tiles, mines?
    if (adjacentMines > 0) {
        board[row][col] = adjacentMines;
    // If no adjacent tiles are mines
    } else if (adjacentMines === 0) {
        board[row][col] = 'db';
        if (board[row-1]?.[col-1]) {
          modifier(board, row-1, col-1);
        }
        if (board[row-1]?.[col]) {
          modifier(board, row-1, col);
        }
        if (board[row-1]?.[col+1]) {
          modifier(board, row-1, col+1);
        }
        if (board[row]?.[col-1]) {
          modifier(board, row, col-1);
        }
        if (board[row]?.[col+1]) {
          modifier(board, row, col+1);
        }
        if (board[row+1]?.[col-1]) {
          modifier(board, row+1, col-1);
        }
        if (board[row+1]?.[col]) {
          modifier(board, row+1, col);
        }
        if (board[row+1]?.[col+1]) {
          modifier(board, row+1, col+1);
        }
    }
  }


  const [size, setSize] = useState(15);
  const [board, setBoard] = useState(createBoard(size));

  useEffect(() => {
    console.log('size changed');
  }, [size])

  const onClick = (e) => {
    e.preventDefault();
    // console.log(board);
    let row = Number(e.target.className.split(' ')[0]);
    let col = Number(e.target.className.split(' ')[1]);
    console.log(e.target.className)
    let boardCopy = [];
    for (var i = 0; i < size; i++) {
      boardCopy[i] = board[i];
    }

    // Update board based on click
    modifier(boardCopy, row, col);
    setBoard(boardCopy);
  }

  const tiles = board.map((row, index) => {
    return (
      <div className='row' key={index}>
        {
          row.map((elem, i) => {
            return elem === 'db' ? <div className={`${index} ${i} tile detectedBlank`} onClick={onClick} key={i}></div>
                 : elem === 'dm' ? <div className={`${index} ${i} tile detectedMine`} onClick={onClick} key={i}></div>
                 : typeof elem === 'number' ? <div className={`${index} ${i} tile detectedBlank`} onClick={onClick} key={i}>{elem}</div>
                 : <div className={`${index} ${i} tile`} onClick={onClick} key={i}></div>
          })
        }
      </div>
    )
  })

  return (
    <div>
      <h2>Minesweeper by Sunit</h2>
      {tiles}
    </div>
  );
}

export default App;
