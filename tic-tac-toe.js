const gameBoard = (() => {
  let board = [];
  let gameOver;
  let tie = false;
  let playerOne;
  let playerTwo;
  let currentPlayer;

  const getCurrentPlayer = () => currentPlayer;
  
  const startGame = () => {
    currentPlayer = playerOne;
    gameOver = false;
    tie = false;
    _clearBoard();
  };
  const createPlayers = (playerOneName, playerTwoName) => {
    playerOne = player(playerOneName, "X");
    playerTwo = player(playerTwoName, "O");
    displayController.displayScores(playerOne, playerTwo);
  }
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
    displayController.displayScores(playerOne, playerTwo);
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
  return {startGame, createPlayers, makeMove, legalMove, getCurrentPlayer, toString};
})();

const displayController = (() => {
  const spaces = document.querySelectorAll(".position");
  let startBtn;
  const outcome = document.querySelector("#outcome");
  const playerOneScore = document.querySelector("#player-one-score");
  const playerTwoScore = document.querySelector("#player-two-score");
  const submitBtn = document.querySelector("#submit");

  submitBtn.addEventListener("click", () => {
    gameBoard.createPlayers(document.querySelector("#player-one-name").value,
    document.querySelector("#player-two-name").value);
    document.querySelector(".setup").removeChild(document.querySelector(".player-creation"));
    const newStartBtn = document.createElement("button");
    newStartBtn.id = "start";
    newStartBtn.textContent = "Start New Game";
    document.querySelector(".setup").appendChild(newStartBtn);
    startBtn = document.querySelector("#start");

    startBtn.addEventListener("click", () => {
      spaces.forEach(space => {
        space.classList.remove("X");
        space.classList.remove("O");
        outcome.textContent = "";
      })
      gameBoard.startGame();
    });
    gameBoard.startGame();
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
  };
  const displayScores = (playerOne, playerTwo) => {
    playerOneScore.textContent = `${playerOne.getName()}: ${playerOne.getScore()}`;
    playerTwoScore.textContent = `${playerTwo.getName()}: ${playerTwo.getScore()}`;
  };
  return {makeMove, displayWinner, displayTie, displayScores};
})();

const player = (name, piece) => {
  let score = 0;
  const getName = () => name;
  const getPiece = () => piece;
  const getScore = () => score;
  const wonGame = () => score++;
  return {getName, getPiece, getScore, wonGame};
}