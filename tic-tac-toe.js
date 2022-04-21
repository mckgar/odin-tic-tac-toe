const gameBoard = (() => {
  let board = [];
  let gameOver;
  let tie = false;
  let currentPlayer;

  const getCurrentPlayer = () => currentPlayer;
  
  const startGame = (player) => {
    currentPlayer = player;
    gameOver = false;
    _clearBoard();
  };
  const _clearBoard = () => {
    for(let i=0; i<9; i++) {
      board[i] = '_';
    }
  };
  const makeMove = (player, position) => {
    if(legalMove(position.id) && !gameOver) {
      board[position.id] = player.getPiece();
      displayController.makeMove(player, position);
      if(_checkGameWon()) {
        player.wonGame();
        _endGame();
      }
      else if(_checkGameTie()) {
        _endGame();
      }
      else {
        if(player.getPiece() == playerOne.getPiece()) {
          currentPlayer = playerTwo;
        } 
        else {
          currentPlayer = playerOne;
        }
      }
    }
  };
  const legalMove = (position) => {
    return board[position] == '_';
  };
  const _checkGameWon = () => {
    return (
      (board[0] != '_' && board[0] == board[1] && board[1] == board[2]) ||
      (board[4] != '_' && board[3] == board[4] && board[4] == board[5]) ||
      (board[6] != '_' && board[6] == board[7] && board[7] == board[8]) ||
      (board[0] != '_' && board[0] == board[3] && board[3] == board[6]) ||
      (board[1] != '_' && board[1] == board[4] && board[4] == board[7]) ||
      (board[2] != '_' && board[2] == board[5] && board[5] == board[8]) ||
      (board[0] != '_' && board[0] == board[4] && board[4] == board[8]) ||
      (board[2] != '_' && board[2] == board[4] && board[4] == board[6])
    )
  };
  const _checkGameTie = () => {
    for(let i=0; i<9; i++) {
      if(board[i] == '_') {
        return false;
      }
    }
    tie = true;
    return true;
  };
  const _endGame = () => {
    gameOver = true;
    if(tie) {
      displayController.displayTie();
    }
    else {
      displayController.displayWinner(currentPlayer);
    }
  };
  const toString = () => {
    let string = "";
    for(let i = 0; i < board.length; i++) {
      string += board[i];
      if((i+1)%3==0) {
        string += "\n"
      }
    }
    return string;
  };
  return {startGame, makeMove, legalMove, getCurrentPlayer, toString};
})();

const displayController = (() => {
  const spaces = document.querySelectorAll(".position");
  const startBtn = document.querySelector("#start");
  const outcome = document.querySelector("#outcome");

  startBtn.addEventListener("click", () => {
    spaces.forEach(space => {
      space.classList.remove("X");
      space.classList.remove("O");
      outcome.textContent = "";
    })
    gameBoard.startGame(playerOne);
  });

  spaces.forEach(space => space.addEventListener("click", () => {
    gameBoard.makeMove(gameBoard.getCurrentPlayer(), space);
  }));

  const makeMove = (player, position) => {
    position.classList.add(player.getPiece());
  };

  const displayWinner = (player) => {
    outcome.textContent = `${player.getName()} has won!`;
  };
  const displayTie = () => {
    outcome.textContent = "Tie!"
  }
  return {makeMove, displayWinner, displayTie};
})();

const player = (name, piece) => {
  let score = 0;
  const getName = () => name;
  const getPiece = () => piece;
  const getScore = () => score;
  const wonGame = () => score++;
  return {getName, getPiece, getScore, wonGame};
}

const playerOne = player("tester1", "X");
const playerTwo = player("tester2", "O");