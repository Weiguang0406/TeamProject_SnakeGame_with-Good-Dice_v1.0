/*
$(".smallbox:even").css("background","#CFA175");

$(".smallbox:odd").css("background","#2C3D50");
*/

// const { nodeName } = require("jquery");

window.onload = function () {
  $(".smallbox:even").css("background", "#2C3D50");
  $(".smallbox:odd").css("background", "#CFA175");
  // Weiguang: setup player using jquery; should be ale to be achieved using js as well.
  // Temporarily comment out above code while testing pre-placed player in div1;

  // $("#player1").appendTo("#div0");
  // $("#player2").appendTo("#div0");

  let moves = 0;
  const locations = { player1: 0, player2: 0 }; // players start from location 0;
  let playerNewLocation;
  let tempNewLocation; // Added new var to hold the temporary location before checking ladder and snake;
  let previousPlayer = "player1"; // Weiguang: Added new var to hold previous player, for indicator feature;
  let stepSound = new Audio("./audio/move-self.mp3"); // Add step sound file
  let stairSound = new Audio("./audio/stairSound1.mp3");
  let snakeSound = new Audio("./audio/snakeSound3.wav");
  let isRolling = false; // Rob: added to prevent double/triple rolls for same player
  // rob: locks out user input with disabled attribute for as long as roll animation preventing multiple turns
  var buttonElement = document.getElementById("rolldice_button");
  buttonElement.addEventListener("click", function () {
    if (isRolling) return;
    isRolling = true;
    buttonElement.setAttribute("disabled", true);
    rollDice();
    setTimeout(function () {
      buttonElement.removeAttribute("disabled");
      isRolling = false;
    }, 1500);
  });

  const rollDice = () => {
    moves += 1;
    console.log(moves);
    var randomNumber = Math.trunc(Math.random() * 6 + 1);
    var cubeElement = document.getElementById("cube");
    // Indicate the player's turn

    $(`#${previousPlayer}indicator`).css("visibility", "hidden");
    moves % 2 === 1
      ? $(`#player1indicator`).css("visibility", "visible")
      : $(`#player2indicator`).css("visibility", "visible");

    // console.dir(cubeElement);
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
            return 17; // 18 conflict with Ladder, move back to 17
            break;
          default:
            return playerNewLocation;
        }
      };
      // Player moves
      const playerMoves = (player) => {
        let message = `${player}'s turn`;
        document.getElementById("movingmessage").textContent = message;
        // let player move step by step using 2 different method:
        // Function: Move forward step by step with step sound:
        const sleepNow = (delay) =>
          new Promise((resolve) => setTimeout(resolve, delay));
        async function moveSelfForward(steps) {
          for (let i = 1; i <= steps; i++) {
            await sleepNow(500);
            $(`#${player}`).appendTo(`#div${locations[`${player}`] + i}`);
            stepSound.play();
          }
        }
        // FUNCTION: Move backward step by step:
        async function moveSelfBackward(steps) {
          for (let i = 1; i <= steps; i++) {
            await sleepNow(500);
            $(`#${player}`).appendTo(`#div${25 - i}`);
            stepSound.play();
          }
        }

        // const moveSelfBackward = (steps) => {
        //   for (let i = 1; i <= steps; i++) {
        //     console.log("i: ", i);
        //     const moveWithSound = () => {
        //       $(`#${player}`).appendTo(`#div${25 - i}`);
        //       stepSound.play();
        //     };
        //     setTimeout(() => moveWithSound(), 500 * i);
        //   }
        // };
        // Assign values:
        previousPlayer = player; //Assign the player to be previous owner for next click;
        tempNewLocation = randomNumber + locations[`${player}`];
        playerNewLocation = snakeOrLadder(tempNewLocation); // check snake or ladders and update the new location accordingly
        // Weiguang commented out:
        // Displaying detailed message:
        // playerNewLocation === tempNewLocation
        //   ? (document.getElementById(
        //       "movingmessage"
        //     ).textContent = `${player} rolled dice of ${randomNumber} and moved to ${playerNewLocation}`)
        //   : (document.getElementById(
        //       "movingmessage"
        //     ).textContent = `${player} rolled dice of ${randomNumber},moved to ${tempNewLocation}, then took the ${
        //       playerNewLocation > tempNewLocation ? "ladder up" : "snake down"
        //     } to ${playerNewLocation}`);
        // console.log(playerNewLocation);

        if (playerNewLocation < 25) {
          // Weiguang rewrite moves: Use promise to make the player move step by step;
          // When done, write the new player location to the Locations object for next turn;
          moveSelfForward(randomNumber)
            .then(() => {
              locations[`${player}`] = playerNewLocation;
            })
            // Weiguang update: Wait 700ms to run snake or ladder and play sound effect;
            .then(() => {
              setTimeout(() => {
                if (playerNewLocation !== tempNewLocation) {
                  $(`#${player}`).appendTo(`#div${playerNewLocation}`);
                  playerNewLocation > tempNewLocation
                    ? stairSound.play()
                    : snakeSound.play();
                }
              }, 700);
            })
            .catch((err) => {
              throw "Error in if condition1";
            });
          console.log(player, locations[`${player}`]);
        } else if (playerNewLocation === 25) {
          moveSelfForward(randomNumber)
            .then(() => {
              document.getElementById(
                "movingmessage"
              ).textContent = `${player} Won! Click button to play again!`;
              buttonElement.innerText = "Play again";
              // reload page in 1s after clicking the the button;
              buttonElement.addEventListener("click", function () {
                setTimeout(function () {
                  window.location.reload();
                }, 1000); // perhaps change to 1500 to match others?
              });
            })
            .catch((err) => {
              throw "Error calculating location in else if condition";
            });
        } else {
          tempNewLocation = 25 - (randomNumber - (25 - locations[`${player}`]));
          playerNewLocation = snakeOrLadder(tempNewLocation); // check snake or ladders
          console.log(tempNewLocation);
          console.log(playerNewLocation);
          moveSelfForward(`${25 - locations[`${player}`]}`)
            .then(() => {
              locations[`${player}`] = playerNewLocation;
            })
            .then(() => {
              moveSelfBackward(`${25 - tempNewLocation}`); // Fixed a logic bug here;
            })
            // Let palyer got on the temp location first then to use anake or ladder;
            .then(() => {
              if (playerNewLocation < tempNewLocation) {
                setTimeout(() => {
                  $(`#${player}`).appendTo(`#div${playerNewLocation}`);
                  snakeSound.play();
                }, 700 * `${25 - tempNewLocation}`);
              }
            })
            .catch((err) => {
              throw "Error calculating location";
            });

          // Weiguang comment out: // Displaying detailed message:
          // playerNewLocation === tempNewLocation
          //   ? (document.getElementById(
          //       "movingmessage"
          //     ).textContent = `${player} rolled dice of ${randomNumber} and moved back to ${playerNewLocation}`)
          //   : (document.getElementById(
          //       "movingmessage"
          //     ).textContent = `${player} rolled dice of ${randomNumber},moved back to ${tempNewLocation}, then took the ${
          //       playerNewLocation > tempNewLocation ? "ladder up" : "snake down"
          //     } to ${playerNewLocation}`);
          // $(`#${player}`).appendTo(`#div${playerNewLocation}`);
          // locations[`${player}`] = playerNewLocation;
        }
      };

      moves % 2 === 1 ? playerMoves("player1") : playerMoves("player2");
    }, 1500);
  };

  // need to add keydown event listner: press the enter or space key to roll the dice;
};

// Weiguang Yang player test code

// $("#player1").appendTo("#div5");
// $("#player2").appendTo("#div6");
