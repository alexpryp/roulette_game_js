//Update cash message function
function updateCashMessage() {
    cashMessageContainer.removeChild(cashMessage);
    cashMessage = new PIXI.Text(
        `MONEY: $${accountState.totalAmount}\nWIN: $${accountState.wonPerGame}`,
        styleCashMessage);
    cashMessage.x = 810;
    cashMessage.y = 380;
    cashMessageContainer.addChild(cashMessage);
}

//Game launch button handler
function playGameHandler() {
    app.stage.removeChild(betLine);
    app.stage.removeChild(gameWinScene);
    accountState.totalAmount -= 5;
    updateCashMessage();
    state = play;
}

//Play the game
function play(delta) {
    btnSpin.visible = false;

    if (loopCounter == 4) {
        loopCounter = 0;
        container1.y = 0;
        container2.y = -536;
        state = stopGame;

        //changeResultMatrix(resultMatrix);
        app.stage.removeChild(container1);
        container1 = createContainer(70, 0, 710, 536);
        fillContainer(container1, resultMatrix);
        app.stage.addChild(container1);

        let winRow = checkWin();
        if (winRow > -1) {
            betLine.position.set(betLinePositions[winRow][0], betLinePositions[winRow][1]);
            app.stage.addChild(betLine);
            app.stage.addChild(gameWinScene);
            accountState.totalAmount += 10;
            accountState.wonPerGame = 10;
            updateCashMessage();
            timerID = setTimeout(()=>{
                app.stage.removeChild(gameWinScene);
            }, 3000)
        }
        accountState.wonPerGame = 0;

        if(accountState.totalAmount > 4) {
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
}

//Stop game function
function stopGame() {
    return;
}

//Start the game loop
function gameLoop(delta){
    state();
}

//Create container function
function createContainer(positionX, positionY, width, height) {
    let container = new PIXI.particles.ParticleContainer();
    container.position.set(positionX, positionY, width, height);
    container.width = width;
    container.height = height;

    return container;
}

//This function fills the container with values
function fillContainer(container, resultMatrix) {
    let coordinates = [
        [[0, 14], [240, 14], [480, 14]],
        [[0, 194], [240, 194], [480, 194]],
        [[0, 374], [240, 374], [480, 374]]
    ];

    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            resultMatrix[i][j] = symbols[randomInt(0, 5)];
            let symb = new Sprite(id[resultMatrix[i][j]]);
            symb.position.set(coordinates[i][j][0], coordinates[i][j][1]);
            container.addChild(symb);
        }
    }
}

//The `randomInt` helper function
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Check results function
function checkWin() {
    for(let rowNumber = 0; rowNumber < 3; rowNumber++) {
        if (checkWinRow(rowNumber) ) {
            return rowNumber;
        }
    }
    return -1;
}

//Check results one row function
function checkWinRow(rowNumber) {
    let rM = resultMatrix;
    let rN = rowNumber;
    if ( rM[rN][0] === "SYM1.png" && rM[rN][0] === rM[rN][1] && rM[rN][1] === rM[rN][2] ) {
        return false;
    } else if ( rM[rN][0] === rM[rN][1] && rM[rN][1] === rM[rN][2] ) {
        return true;
    } else if ( rM[rN].indexOf("SYM1.png") > -1 ) {
        if ( rM[rN][0] === rM[rN][1] || rM[rN][1] === rM[rN][2] || rM[rN][0] === rM[rN][2] ) {
            return true;
        }
        return false;
    }
    return false;
}