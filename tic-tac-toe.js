const gameBoard = (() => {
  let board = [];
  let initialGame = true;
  let currentPlayer;
  
  const startGame = () => {
    _clearBoard();
  };
  const _clearBoard = () => {
    for(let i=0; i<9; i++) {
      board[i] = '_';
    }
  };
  const makeMove = (player, position) => {
    if(legalMove(postion)) {
      board[position] = player.getPiece();
      if(_checkGameWon()) {
        player.wonGame();
        _endGame();
      }
      else if(_checkGameTie()) {
        _endGame();
      }
      else {
        if(player.getPiece() == 'X') {
          currentPlayer = 'O';
        } 
        else {
          currentPlayer = 'X';
        }
      }
    }
  };
  const legalMove = (position) => {
    return board[position] == '_';
  };
  const _checkGameWon = () => {
    return (
      board[0] == board[1] == board[2] ||
      board[3] == board[4] == board[5] ||
      board[6] == board[7] == board[8] ||
      board[0] == board[3] == board[6] ||
      board[1] == board[4] == board[7] ||
      board[2] == board[5] == board[8] ||
      board[0] == board[4] == board[8] ||
      board[2] == board[4] == board[6]
    )
  };
  const _checkGameTie = () => {
    for(let i=0; i<9; i++) {
      return !(board[i] == '_');
    }
    return true;
  };
  return {startGame, makeMove, legalMove};
})();

const player = (name, piece) => {
  let score = 0;
  const getName = () => name;
  const getPiece = () => piece;
  const getScore = () => score;
  const wonGame = () => score++;
  return {getName, getPiece, getScore, wonGame};
}