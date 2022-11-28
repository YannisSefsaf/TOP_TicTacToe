const cells = document.querySelectorAll(".cell");
const grid = document.querySelector(".grid");
const form = document.querySelector(".form");
const formIntro = document.querySelector(".form__intro");
const reset = document.querySelector(".reset");
const para = document.querySelector(".para");
const overlay = document.querySelector(".overlay");
const btnPlayGame = document.querySelector(".startGame");
const userOne = document.querySelector("#username1");
const userTwo = document.querySelector("#username2");
const myPlayer = userOne.value;
const myComputer = userTwo.value;
const userNameOne = document.querySelector(".player--one");
const userNameTwo = document.querySelector(".player--two");
const userNameOneSign = document.querySelector(".player--one--sign");
const userNameTwoSign = document.querySelector(".player--two--sign");
const outcome = document.querySelector(".outcome");

btnPlayGame.addEventListener("click", (e) => {
  e.preventDefault();
  let JoueurUn = Player(userOne.value, "x");
  let JoueurDeux = Player(userTwo.value, "o");
  formIntro.classList.add("hidden");
  overlay.classList.add("hidden");
  grid.classList.remove("hidden");
  userNameOne.textContent = userOne.value;
  userNameTwo.textContent = userTwo.value;
  userNameOneSign.textContent = JoueurUn.getSign();
  userNameTwoSign.textContent = JoueurDeux.getSign();
  const playGame = game(JoueurUn.getPlayer(), JoueurDeux.getPlayer());
  playGame.play();
});

const resetGame = () => {
  cells.forEach((cell) => (cell.innerHTML = ""));
  let JoueurUn = Player(userOne.value, "x");
  let JoueurDeux = Player(userTwo.value, "o");
  form.classList.add("hidden");
  overlay.classList.add("hidden");
  userNameOne.textContent = userOne.value;
  userNameTwo.textContent = userTwo.value;
  userNameOneSign.textContent = JoueurUn.getSign();
  userNameTwoSign.textContent = JoueurDeux.getSign();
  const playGame = game(JoueurUn.getPlayer(), JoueurDeux.getPlayer());
  let gameboard = gameBoard.resetGameBoard();
  playGame.play();
};

reset.addEventListener("click", resetGame);

// GAMEBOARD OBJECT // MODULE

const gameBoard = (() => {
  let gameboard = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const getGameBoard = () => gameboard;
  const resetGameBoard = () => (gameboard = [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  return { getGameBoard, resetGameBoard };
})();

// PLAYER OBJECT // Factory Function

const Player = (player, sign) => {
  const getPlayer = () => player;
  const getSign = () => sign;
  return { getPlayer, getSign };
};

// GAME OBJECT

const game = (player, computer, sign) => {
  const playerOne = Player(userOne.value, "x");
  const playerTwo = Player(userTwo.value, "o");
  const { getPlayer, getSign } = Player(player, sign);
  outcome.textContent = `It's ${playerOne.getPlayer()}'s turn!`;
  const play = () => {
    playRound();
  };
  const playRound = () => {
    cells.forEach((cell) =>
      cell.addEventListener(
        "click",
        (e) => {
          let gameboard = gameBoard.getGameBoard();
          let cellNum = e.target.getAttribute("data-attribute");
          const countX = {};
          const countO = {};
          gameboard.forEach((element) => {
            countX[element] = (countX[element] || 0) + 1;
          });
          gameboard.forEach((element) => {
            countO[element] = (countO[element] || 0) + 1;
          });
          if (
            !(gameboard[cellNum - 1] === "x") &&
            !(gameboard[cellNum - 1] === "o")
          ) {
            if (
              countX[playerOne.getSign()] > countO[playerTwo.getSign()] ||
              (countX[playerOne.getSign()] === 1 &&
                countO[playerTwo.getSign()] === undefined)
            ) {
              outcome.textContent = `It's ${playerOne.getPlayer()}'s turn!`;
              gameboard[cellNum - 1] = `${playerTwo.getSign()}`;
              gameboard.forEach((element) => {
                countO[element] = (countO[element] || 0) + 1;
              });
              cells[cellNum - 1].innerHTML = gameboard[cellNum - 1];
            } else {
              outcome.textContent = `It's ${playerTwo.getPlayer()}'s turn!`;
              gameboard[cellNum - 1] = `${playerOne.getSign()}`;
              gameboard.forEach((element) => {
                countX[element] = (countX[element] || 0) + 1;
              });
              cells[cellNum - 1].innerHTML = gameboard[cellNum - 1];
            }

            if (countO.o + countX.x === 13) {
              form.classList.remove("hidden");
              overlay.classList.remove("hidden");
              para.innerHTML = "Draw!";
            }
            if (winningCombos()) {
              outcome.textContent = "";
              if (countX[playerOne.getSign()] > countO[playerTwo.getSign()]) {
                para.innerHTML = `${playerOne.getPlayer()} won!`;
              } else {
                para.innerHTML = `${playerTwo.getPlayer()} won!`;
              }
              form.classList.remove("hidden");
              overlay.classList.remove("hidden");
            }
          }
          return true;
        },
        { once: true }
      )
    );
  };
  return {
    getPlayer,
    play,
    playRound,
    player,
    computer,
  };
};

const winningCombos = () => {
  let gameboard = gameBoard.getGameBoard();
  if (
    (gameboard[0] === gameboard[1] && gameboard[1] === gameboard[2]) ||
    (gameboard[3] === gameboard[4] && gameboard[4] === gameboard[5]) ||
    (gameboard[6] === gameboard[7] && gameboard[7] === gameboard[8]) ||
    (gameboard[0] === gameboard[3] && gameboard[3] === gameboard[6]) ||
    (gameboard[1] === gameboard[4] && gameboard[4] === gameboard[7]) ||
    (gameboard[2] === gameboard[5] && gameboard[5] === gameboard[8]) ||
    (gameboard[0] === gameboard[4] && gameboard[4] === gameboard[8]) ||
    (gameboard[2] === gameboard[4] && gameboard[4] === gameboard[6])
  ) {
    return true;
  }
};
