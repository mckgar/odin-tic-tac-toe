const gameBoard = (() => {
  let board = [];
  let gameOver;
  let tie = false;
  let playerOne;
  let playerOneAI;
  let playerTwo;
  let playerTwoAI;
  let currentPlayer;
  let playerOneAIDifficulty;
  let playerTwoAIDifficulty;

  const getCurrentPlayer = () => currentPlayer;
  const getBoard = () => {
    let temp = [];
    for(let i = 0; i < board.length; i++) {
      temp[i] = board[i];
    }
    return temp;
  };
  
  const startGame = () => {
    currentPlayer = playerOne;
    gameOver = false;
    tie = false;
    _clearBoard();
    if(playerOneAI) {
      playerOne.makeMove();
    }
  };
  const createPlayers = (playerOneName, oneAi, oneDifficulty, playerTwoName, twoAi, twoDifficulty) => {
    if(oneAi) {
      playerOne = ai(playerOneName, "X", oneDifficulty);
    }
    else {
      playerOne = player(playerOneName, "X");
    }

    if(twoAi) {
      playerTwo = ai(playerTwoName, "O", twoDifficulty);
    }
    else {
      playerTwo = player(playerTwoName, "O");
    }
    playerOneAI = oneAi;
    playerTwoAI = twoAi;
    displayController.displayScores(playerOne, playerTwo);
  }
  const _clearBoard = () => {
    for(let i=0; i<9; i++) {
      board[i] = '_';
    }
  };
  
  const makeMove = (position) => {
    if(legalMove(position.id) && !gameOver) {
      board[position.id] = currentPlayer.getPiece();
      displayController.makeMove(currentPlayer, position);
      if(_checkGameWon()) {
        currentPlayer.wonGame();
        _endGame();
      }
      else if(_checkGameTie()) {
        _endGame();
      }
      else {
        if(currentPlayer.getPiece() == playerOne.getPiece()) {
          currentPlayer = playerTwo;
          if(playerTwoAI) {
            playerTwo.makeMove(playerOne.getPiece(), playerTwoAIDifficulty);
          }
        } 
        else {
          currentPlayer = playerOne;
          if(playerOneAI) {
            playerOne.makeMove(playerTwo.getPiece(), playerOneAIDifficulty);
          }
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
  return {startGame, createPlayers, makeMove, legalMove, getCurrentPlayer, getBoard};
})();

const displayController = (() => {
  const spaces = document.querySelectorAll(".position");
  let startBtn;
  const outcome = document.querySelector("#outcome");
  const playerOneScore = document.querySelector("#player-one-score");
  const playerTwoScore = document.querySelector("#player-two-score");
  const submitBtn = document.querySelector("#submit");

  submitBtn.addEventListener("click", () => {
    gameBoard.createPlayers(
      document.querySelector("#player-one-name").value,
      document.querySelector("#player-one-ai").checked,
      document.querySelector("#player-one-ai-difficulty").value,
      document.querySelector("#player-two-name").value,
      document.querySelector("#player-two-ai").checked,
      document.querySelector("#player-two-ai-difficulty").value
    );
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
    gameBoard.makeMove(space);
  }));

  const makeMove = (player, position) => {
    position.classList.add(player.getPiece());
  };

  const getPosition = (id) => {
    return document.getElementById(id);
  }

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
  return {makeMove, displayWinner, displayTie, displayScores, getPosition};
})();

const player = (name, piece) => {
  let score = 0;
  const getName = () => name;
  const getPiece = () => piece;
  const getScore = () => score;
  const wonGame = () => score++;
  return {getName, getPiece, getScore, wonGame};
}

const ai = (name, piece, difficulty) => {
  const prototype = player(name, piece);

  const makeMove = (opponent) => {
    let move;
    
    if(difficulty == 2) {
      move = __minimax(0, difficulty, gameBoard.getBoard(), opponent, true, prototype.getPiece())[0];
    }
    else if(difficulty == 9) {
      move = __minimax(0, difficulty, gameBoard.getBoard(), opponent, true, prototype.getPiece())[0];
    }
    else {
      move = __randomMove();
    }

    if(gameBoard.legalMove(move)) {
      gameBoard.makeMove(displayController.getPosition(move));
    }
    else {
      console.log("Illegal move at " + move);
    }
  };

  const __randomMove = () => {
    while(true) {
      let move = Math.floor(Math.random() * 9);
      if(gameBoard.legalMove(move)) {
        return move;
      }
    }
  }

  const __minimax = (depth, maxDepth, currentState, opponent, maximizer, currentPlayer) => {
    if(__checkWinner(prototype.getPiece(), currentState)) {
      return [-1, 1];
    }
    else if(__checkWinner(opponent, currentState)) {
      return [-1, -1];
    }
    else if(__checkStalemate(currentState) || depth == maxDepth) {
      return [-1, 0];
    }

    let legalMoves = [];
    for(let i = 0; i < currentState.length; i++) {
      if(currentState[i] == "_") {
        legalMoves.push(i);
      }
    }

    let scores = new Map();
    for(let i of legalMoves) {
      currentState = __testMove(currentState, currentPlayer, i);
      if(currentPlayer == prototype.getPiece()) {
        scores.set(i, __minimax(depth+1, maxDepth, currentState, opponent, false, opponent)[1]); 
      }
      else {
        scores.set(i, __minimax(depth+1, maxDepth, currentState, opponent, true, prototype.getPiece())[1]);
      }
      currentState = __undoTestMove(currentState, i);
    }

    let bestScore;
    let bestMove = -1;
    if(maximizer) {
      bestScore = -Infinity;
      for(let pair of scores.entries()) {
        if(pair[1] > bestScore) {
          bestScore = pair[1];
          bestMove = pair[0];
        }
      }
    }
    else {
      bestScore = Infinity;
      for(let pair of scores.entries()) {
        if(pair[1] < bestScore) {
          bestScore = pair[1];
          bestMove = pair[0];
        }
      }
    }

    return [bestMove, bestScore];
  };

  const __checkWinner = (currentPlayer, board) => {
    return (
      (board[0] == currentPlayer && board[0] == board[1] && board[1] == board[2]) ||
      (board[4] == currentPlayer && board[3] == board[4] && board[4] == board[5]) ||
      (board[6] == currentPlayer && board[6] == board[7] && board[7] == board[8]) ||
      (board[0] == currentPlayer && board[0] == board[3] && board[3] == board[6]) ||
      (board[1] == currentPlayer && board[1] == board[4] && board[4] == board[7]) ||
      (board[2] == currentPlayer && board[2] == board[5] && board[5] == board[8]) ||
      (board[0] == currentPlayer && board[0] == board[4] && board[4] == board[8]) ||
      (board[2] == currentPlayer && board[2] == board[4] && board[4] == board[6])
    )
  };

  const __checkStalemate = (board) => {
    for(let i=0; i<board.length; i++) {
      if(board[i] == '_') {
        return false;
      }
    }
    return true;
  };

  const __testMove = (board, currentPlayer, position) => {
    board[position] = currentPlayer;
    return board;
  };

  const __undoTestMove = (board, position) => {
    board[position] = "_";
    return board;
  };

  return Object.assign({}, prototype, {makeMove});
}