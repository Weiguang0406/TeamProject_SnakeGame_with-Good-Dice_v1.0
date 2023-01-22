/*
$(".smallbox:even").css("background","#CFA175");

$(".smallbox:odd").css("background","#2C3D50");
*/

// const { nodeName } = require("jquery");

window.onload = function () {
  $(".smallbox:even").css("background", "#2C3D50");
  $(".smallbox:odd").css("background", "#CFA175");
  // Weiguang: setup player using jquery; should be ale to be achieved using js as well.
  // var player1Img = document.createElement("img");
  // player1Img.src = "imgs/avatar_body1.png";

  // let player2Img = document.createElement("img");
  // player2Img.src = "imgs/avatar_body2.png";
  // let gridboard = document.getElementById("gridboard");

  // gridboard.appendChild(player1Img);
  // gridboard.appendChild(player2Img);

  // player1Img.setAttribute("id", "player1");
  // player2Img.setAttribute("id", "player2");

  // Temporarily comment out above code while testing pre-placed player in div1;

  $("#player1").appendTo("#div1");
  $("#player2").appendTo("#div1");
  $("#player1").css("visibility", "hidden"); // players invisible as default;
  $("#player2").css("visibility", "hidden");
  // let player1PreLocation = 0;
  // let player2PreLocation = 0;
  let moves = 0;
  const locations = { player1: 0, player2: 0 }; // players start from location 0;
  let playerNewLocation;
  // Weiguang

  var buttonElement = document.getElementById("rolldice_button");
  const rollDice = () => {
    moves += 1;
    console.log(moves);
    var randomNumber = Math.trunc(Math.random() * 6 + 1);
    var cubeElement = document.getElementById("cube");

    // let player2NewLocation = randomNumber + locations.player2;
    console.dir(cubeElement);
    switch (randomNumber) {
      case 1:
        cubeElement.style.WebkitTransform =
          "rotateX(90deg) rotateY(180deg) rotateZ(180deg)";

        break;
      case 2:
        cubeElement.style.WebkitTransform =
          "rotateX(90deg) rotateY(90deg) rotateZ(90deg)";
        break;
      case 3:
        cubeElement.style.WebkitTransform =
          "rotateX(0deg) rotateY(0deg) rotateZ(0deg)";
        break;
      case 4:
        cubeElement.style.WebkitTransform =
          "rotateX(0deg) rotateY(90deg) rotateZ(0deg)";
        break;
      case 5:
        cubeElement.style.WebkitTransform =
          "rotateX(0deg) rotateY(180deg) rotateZ(0deg)";
        break;
      case 6:
        cubeElement.style.WebkitTransform =
          "rotateX(90deg) rotateY(0deg) rotateZ(0deg)";
        break;
    }
    cubeElement.style["animation-name"] = "rotate";
    cubeElement.style["animation-timing-function"] = "linear";
    cubeElement.style["animation-duration"] = "1.5s";
    setTimeout(function () {
      cubeElement.style.animationName = "none";

      // check snake or ladders and return new location:
      const snakeOrLadder = (playerNewLocation) => {
        switch (playerNewLocation) {
          case 13:
            return 2;
            break;
          case 5:
            return 7;
            break;
          case 20:
            return 12;
            break;
          case 18:
            return 24;
            break;
          case 21:
            return 17;
            break;
          default:
            return playerNewLocation;
        }
      };
      // Player moves
      const playerMoves = (player) => {
        let message = `${player}'s turn`;
        document.getElementById("message").textContent = message;
        console.log(player);
        $(`#${player}`).css("visibility", "visible"); // make the user visible before move
        playerNewLocation = randomNumber + locations[`${player}`];
        console.log(playerNewLocation);
        playerNewLocation = snakeOrLadder(playerNewLocation); // check snake or ladders and update the new location accordingly
        console.log(playerNewLocation);
        if (playerNewLocation < 25) {
          $(`#${player}`).appendTo(`#div${playerNewLocation}`);
          //Player 1: Test move after the dice animition}
          locations[`${player}`] = playerNewLocation;
        } //Player 1: wining condition;
        else if (playerNewLocation === 25) {
          $(`#${player}`).appendTo(`#div${playerNewLocation}`);
          document.querySelector(
            ".header"
          ).innerText = `${player} wins! Game over! Refresh the page to play again`;
          buttonElement.innerText = "Play again";
          // reload page in 1s after clicking the the button;
          buttonElement.addEventListener("click", function () {
            setTimeout(function () {
              window.location.reload();
            }, 1000);
          });
        } else {
          playerNewLocation =
            25 - (randomNumber - (25 - locations[`${player}`]));
          playerNewLocation = snakeOrLadder(playerNewLocation); // check snake or ladders
          $(`#${player}`).appendTo(`#div${playerNewLocation}`);
          locations[`${player}`] = playerNewLocation;
        }
        document.getElementById(
          "movingmessage"
        ).textContent = `${player} moved to ${locations[`${player}`]}`;
      };

      // const player2Turn = () => {
      //   $("#player2").css("visibility", "visible");
      //   if (player2NewLocation < 25) {
      //     $("#player2").appendTo(`#div${player2NewLocation}`);
      //     //Player 2: Test move after the dice animition
      //     player2PreLocation = player2NewLocation;
      //   } else if (player2NewLocation === 25) {
      //     $("#player2").appendTo(`#div${player2NewLocation}`);
      //     //Player 1: Test move after the dice animition}
      //     document.querySelector(".header").innerText =
      //       "Player2 wins! Game over! Refresh the page to play again";
      //   } else {
      //     player2NewLocation = 25 - (randomNumber - (25 - player2PreLocation));
      //     $("#player2").appendTo(`#div${player2NewLocation}`);
      //     player2PreLocation = player2NewLocation;
      //   }
      // };
      moves % 2 === 1 ? playerMoves("player1") : playerMoves("player2");
    }, 1500);
  };
  // call the rolldile main function;
  buttonElement.addEventListener("click", rollDice);
  // need to add keydown event listner: press the enter or space key to roll the dice;
};

// Weiguang Yang player test code

// $("#player1").appendTo("#div5");
// $("#player2").appendTo("#div6");
