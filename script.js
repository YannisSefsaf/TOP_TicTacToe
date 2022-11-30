// const Player
const Player = (player, sign) => {
  const getPlayer = () => player;
  const getSign = () => sign;
  return { getPlayer, getSign };
};

// const gameBoard
const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const setCell = (index, sign) => {
    board[index] = sign;
  };

  const getCell = (index) => board[index];

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { setCell, getCell, reset };
})();

// const displayController
const displayController = (() => {
  // grid and cells //
  const grid = document.querySelector(".grid");
  const cells = document.querySelectorAll(".cell");
  const turn = document.querySelector(".turn");

  // player and result forms & overlay //
  const formIntro = document.querySelector(".form__intro");
  const formResult = document.querySelector(".form__result");
  const result = document.querySelector(".result");
  const overlay = document.querySelector(".overlay");
  const resetButton = document.querySelector(".resetBtn");
  const userOne = document.querySelector("#username1");
  const userTwo = document.querySelector("#username2");
  let userNameOne;
  let userNameTwo;

  // start button
  const playGameButton = document.querySelector(".startGame");

  // BUTTON EVENT LISTENERS //

  playGameButton.addEventListener("click", (e) => {
    e.preventDefault();
    setPlayers();
    gameController.updatePlayers();
    showGameBoard();
    activateCells();
    setTurnMessage(`It's ${getPlayerOne()}'s turn`);
  });

  resetButton.addEventListener("click", () => {
    showGameBoardAfterReset();
    gameBoard.reset();
    gameController.reset();
    updateGameboard();
    setTurnMessage(`It's ${getPlayerOne()}'s turn`);
  });

  // BOARD LOGIC //

  const activateCells = () => {
    cells.forEach((cell) =>
      cell.addEventListener("click", (e) => {
        if (!gameController.getIsOver() && e.target.textContent === "") {
          gameController.playRound(
            parseInt(e.target.getAttribute("data-attribute") - 1)
          );
          updateGameboard();
        }
      })
    );
  };

  const updateGameboard = () => {
    for (let i = 0; i < cells.length; i++) {
      cells[i].textContent = gameBoard.getCell(i);
    }
  };

  // Players //

  const setPlayers = () => {
    userNameOne = userOne.value;
    userNameTwo = userTwo.value;
  };

  const getPlayerOne = () => {
    return userNameOne;
  };

  const getPlayerTwo = () => {
    return userNameTwo;
  };

  // SHOW & HIDE BOARD AND FORMS //

  const showGameBoard = () => {
    formIntro.classList.add("hidden");
    overlay.classList.add("hidden");
    grid.classList.remove("hidden");
  };

  const showGameBoardAfterReset = () => {
    turn.classList.remove("hidden");
    formResult.classList.add("hidden");
    overlay.classList.add("hidden");
  };

  const hideGameBoard = () => {
    turn.classList.add("hidden");
    formResult.classList.remove("hidden");
    overlay.classList.remove("hidden");
  };

  // TURNS AND RESULTS FORMS AND MESSAGES

  const showResultForm = (winner) => {
    hideGameBoard();
    if (winner === "Draw") {
      setResultMessage("It's a draw!");
    } else {
      setResultMessage(`${winner} has won!`);
    }
  };

  const setResultMessage = (message) => {
    result.textContent = message;
  };

  const setTurnMessage = (message) => {
    turn.textContent = message;
  };

  return {
    showResultForm,
    setResultMessage,
    setTurnMessage,
    getPlayerOne,
    getPlayerTwo,
  };
})();

// const gameController

const gameController = (() => {
  // get players from form //
  let playerOne = displayController.getPlayerOne();
  let playerTwo = displayController.getPlayerTwo();
  let playerX = Player(playerOne, "X");
  let playerO = Player(playerTwo, "O");

  const updatePlayers = () => {
    playerOne = displayController.getPlayerOne();
    playerTwo = displayController.getPlayerTwo();
  };

  let round = 1;
  let isOver = false;

  const playRound = (index) => {
    playerX = Player(playerOne, "X");
    playerO = Player(playerTwo, "O");
    gameBoard.setCell(index, getCurrentPlayerSign());
    if (checkWinner(index)) {
      displayController.showResultForm(getCurrentPlayerName());
      isOver = true;
    }
    if (!checkWinner(index) && round === 9) {
      displayController.showResultForm("Draw");
      isOver = true;
    }
    round++;
    displayController.setTurnMessage(`It's ${getCurrentPlayerName()}'s turn`);
  };

  const getCurrentPlayerSign = () => {
    return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
  };

  const getCurrentPlayerName = () => {
    return round % 2 === 1 ? playerX.getPlayer() : playerO.getPlayer();
  };

  const checkWinner = (index) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winConditions
      .filter((combination) => combination.includes(index))
      .some((possibleCombination) =>
        possibleCombination.every(
          (index) => gameBoard.getCell(index) === getCurrentPlayerSign()
        )
      );
  };

  const getIsOver = () => {
    return isOver;
  };

  const reset = () => {
    round = 1;
    isOver = false;
  };

  return { playRound, getIsOver, reset, updatePlayers };
})();
