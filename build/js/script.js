"use strict";

var type = "WebGL";

if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas";
} //Alieses


var Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite; //Create a Pixi Application

var app = new Application({
  width: 960,
  height: 536,
  antialias: false,
  transparent: false,
  resolution: 1
}); //Data

var symbols = ["SYM1.png", "SYM3.png", "SYM4.png", "SYM5.png", "SYM6.png", "SYM7.png"];
var resultMatrix = [["SYM1.png", "SYM6.png", "SYM3.png"], ["SYM3.png", "SYM5.png", "SYM1.png"], ["SYM4.png", "SYM7.png", "SYM6.png"]];
var betLinePositions = [[40, 88], [40, 268], [40, 448]];
var accountState = {
  totalAmount: 100,
  wonPerGame: 0
}; //Add the canvas that Pixi automatically created and added to HTML document

var loadingMessage = document.querySelector('#loading-message');
var gameContainer = document.querySelector('#game');
gameContainer.removeChild(loadingMessage);
gameContainer.appendChild(app.view); //load a JSON file with texture atlas and run the `setup` function when it's done

loader.add("../textures/gameTextures.json").on("progress", loadProgressHandler).load(setup);

function loadProgressHandler() {} //Define variables that might be used in more 
//than one function


var betLine,
    background,
    btnSpin,
    btnSpinD,
    sym1,
    sym3,
    sym4,
    sym5,
    sym6,
    sym7,
    id,
    state,
    container1,
    container2,
    loopCounter = 0,
    styleCashMessage,
    cashMessageContainer,
    cashMessage,
    gameWinScene,
    cashMessageRectangle,
    timerID;

function setup() {
  //Create an optional alias called `id` for all the texture atlas 
  //frame id textures.
  id = resources["../textures/gameTextures.json"].textures; //Make the background

  background = new Sprite(id["BG.png"]); //Position the background

  background.position.set(0, 0);
  app.stage.addChild(background); //Make and position some other sprites

  btnSpinD = new Sprite(id["BTN_Spin_d.png"]);
  btnSpinD.position.set(824, 218);
  app.stage.addChild(btnSpinD);
  btnSpin = new Sprite(id["BTN_Spin.png"]);
  btnSpin.position.set(824, 218);
  btnSpin.interactive = true;
  btnSpin.buttonMode = true;
  btnSpin.defaultCursor = 'pointer';
  btnSpin.on('mousedown', playGameHandler);
  btnSpin.on('touchstart', playGameHandler);
  app.stage.addChild(btnSpin); //Create containers for symbols

  container2 = createContainer(70, -536, 710, 536);
  container1 = createContainer(70, 0, 710, 536);
  betLine = new Sprite(id["Bet_Line.png"]); //Displaying info about the state of the cash account

  styleCashMessage = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 20,
    fill: "yellow",
    align: "left"
  });
  cashMessage = new PIXI.Text("MONEY: $".concat(accountState.totalAmount, "\nWIN: $").concat(accountState.wonPerGame), styleCashMessage);
  cashMessage.x = 810;
  cashMessage.y = 380;
  cashMessageContainer = new PIXI.Container();
  cashMessageContainer.width = 150;
  cashMessageContainer.height = 100;
  cashMessageRectangle = new PIXI.Graphics();
  cashMessageRectangle.beginFill(0x0e383f, 0.8);
  cashMessageRectangle.x = 800;
  cashMessageRectangle.y = 370;
  cashMessageRectangle.drawRect(0, 0, 150, 100);
  cashMessageContainer.addChild(cashMessageRectangle);
  cashMessageContainer.addChild(cashMessage);
  app.stage.addChild(cashMessageContainer); //Create a win message

  var style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 120,
    fill: "yellow",
    align: "center"
  });
  var message = new PIXI.Text("YOU WON!", style);
  message.x = 120;
  message.y = 200;
  gameWinScene = new PIXI.Container();
  gameWinScene.width = 710;
  gameWinScene.height = 336;
  var rectangle = new PIXI.Graphics();
  rectangle.beginFill(0x175E69, 0.9);
  rectangle.x = 75;
  rectangle.y = 110;
  rectangle.drawRect(0, 0, 710, 336);
  gameWinScene.addChild(rectangle);
  gameWinScene.addChild(message); //Add sprites to containers

  fillContainer(container1, resultMatrix);
  fillContainer(container2, resultMatrix); //Add containers to the stage

  app.stage.addChild(container1);
  app.stage.addChild(container2); //Game state

  state = stopGame; //Call this `gameLoop` function on the next screen refresh
  //(which happens 60 times per second)

  app.ticker.add(function () {
    return gameLoop();
  });
} //Update cash message function


function updateCashMessage() {
  cashMessageContainer.removeChild(cashMessage);
  cashMessage = new PIXI.Text("MONEY: $".concat(accountState.totalAmount, "\nWIN: $").concat(accountState.wonPerGame), styleCashMessage);
  cashMessage.x = 810;
  cashMessage.y = 380;
  cashMessageContainer.addChild(cashMessage);
} //Game launch button handler


function playGameHandler() {
  app.stage.removeChild(betLine);
  app.stage.removeChild(gameWinScene);
  accountState.totalAmount -= 5;
  updateCashMessage();
  state = play;
} //Play the game


function play(delta) {
  btnSpin.visible = false;

  if (loopCounter == 4) {
    loopCounter = 0;
    container1.y = 0;
    container2.y = -536;
    state = stopGame; //changeResultMatrix(resultMatrix);

    app.stage.removeChild(container1);
    container1 = createContainer(70, 0, 710, 536);
    fillContainer(container1, resultMatrix);
    app.stage.addChild(container1);
    var winRow = checkWin();

    if (winRow > -1) {
      betLine.position.set(betLinePositions[winRow][0], betLinePositions[winRow][1]);
      app.stage.addChild(betLine);
      app.stage.addChild(gameWinScene);
      accountState.totalAmount += 10;
      accountState.wonPerGame = 10;
      updateCashMessage();
      timerID = setTimeout(function () {
        app.stage.removeChild(gameWinScene);
      }, 3000);
    }

    accountState.wonPerGame = 0;

    if (accountState.totalAmount > 4) {
      btnSpin.visible = true;
    }

    return;
  }

  if (container1.y > 536) {
    container1.y = -536;
  }

  if (container2.y > 536) {
    container2.y = -536;
    loopCounter += 1;
  }

  container1.y += 70;
  container2.y += 70;
} //Stop game function


function stopGame() {
  return;
} //Start the game loop


function gameLoop(delta) {
  state();
} //Create container function


function createContainer(positionX, positionY, width, height) {
  var container = new PIXI.particles.ParticleContainer();
  container.position.set(positionX, positionY, width, height);
  container.width = width;
  container.height = height;
  return container;
} //This function fills the container with values


function fillContainer(container, resultMatrix) {
  var coordinates = [[[0, 14], [240, 14], [480, 14]], [[0, 194], [240, 194], [480, 194]], [[0, 374], [240, 374], [480, 374]]];

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      resultMatrix[i][j] = symbols[randomInt(0, 5)];
      var symb = new Sprite(id[resultMatrix[i][j]]);
      symb.position.set(coordinates[i][j][0], coordinates[i][j][1]);
      container.addChild(symb);
    }
  }
} //The `randomInt` helper function


function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
} //Check results function


function checkWin() {
  for (var rowNumber = 0; rowNumber < 3; rowNumber++) {
    if (checkWinRow(rowNumber)) {
      return rowNumber;
    }
  }

  return -1;
} //Check results one row function


function checkWinRow(rowNumber) {
  var rM = resultMatrix;
  var rN = rowNumber;

  if (rM[rN][0] === "SYM1.png" && rM[rN][0] === rM[rN][1] && rM[rN][1] === rM[rN][2]) {
    return false;
  } else if (rM[rN][0] === rM[rN][1] && rM[rN][1] === rM[rN][2]) {
    return true;
  } else if (rM[rN].indexOf("SYM1.png") > -1) {
    if (rM[rN][0] === rM[rN][1] || rM[rN][1] === rM[rN][2] || rM[rN][0] === rM[rN][2]) {
      return true;
    }

    return false;
  }

  return false;
}