function setup() {
    //Create an optional alias called `id` for all the texture atlas 
    //frame id textures.
    id = resources["../textures/gameTextures.json"].textures;

    //Make the background
    background = new Sprite(id["BG.png"]);
    //Position the background
    background.position.set(0, 0);
    app.stage.addChild(background);

    //Make and position some other sprites
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
    app.stage.addChild(btnSpin);

    //Create containers for symbols
    container2 = createContainer(70, -536, 710, 536);
    container1 = createContainer(70, 0, 710, 536);

    betLine = new Sprite(id["Bet_Line.png"]);
    betLine.position.set(40, 268);

    //Displaying info about the state of the cash account
    styleCashMessage = new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 20,
        fill: "yellow",
        align: "left",
    });

    cashMessage = new PIXI.Text(
        `MONEY: $${accountState.totalAmount}\nWIN: ${accountState.wonPerGame}`,
        styleCashMessage);
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
    cashMessageContainer.addChild(cashMessageRectangle)
    cashMessageContainer.addChild(cashMessage);
    app.stage.addChild(cashMessageContainer);

    //Create a win message
    let style = new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 120,
        fill: "yellow",
        align: "center",
      });

    let message = new PIXI.Text("YOU WON!", style);
    message.x = 120;
    message.y = 200;
    gameWinScene = new PIXI.Container();
    gameWinScene.width = 710;
    gameWinScene.height = 336;

    let rectangle = new PIXI.Graphics();
    rectangle.beginFill(0x175E69, 0.9);
    rectangle.x = 75;
    rectangle.y = 110;
    rectangle.drawRect(0, 0, 710, 336);
    gameWinScene.addChild(rectangle)
    gameWinScene.addChild(message);
    
    //Add sprites to containers
    fillContainer(container1, resultMatrix);
    fillContainer(container2, resultMatrix);

    //Add containers to the stage
    app.stage.addChild(container1);
    app.stage.addChild(container2);

    //Game state
    state = stopGame;

    //Call this `gameLoop` function on the next screen refresh
    //(which happens 60 times per second)
    app.ticker.add(() => gameLoop());
}