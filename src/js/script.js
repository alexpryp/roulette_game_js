let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}

//Alieses
let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

//Create a Pixi Application
let app = new Application({
    width: 960, 
    height: 536,
    antialias: false, 
    transparent: false, 
    resolution: 1
});

//Data
let symbols = ["SYM1.png", "SYM3.png", "SYM4.png", "SYM5.png", "SYM6.png", "SYM7.png"];
let resultMatrix = [
    ["SYM1.png", "SYM6.png", "SYM3.png"],
    ["SYM3.png", "SYM5.png", "SYM1.png"],
    ["SYM4.png", "SYM7.png", "SYM6.png"],
];

//Add the canvas that Pixi automatically created for you to the HTML document
document.querySelector('#game').appendChild(app.view);

//load a JSON file with texture atlas and run the `setup` function when it's done
loader
    .add("../textures/gameTextures.json")
    .load(setup);

//Define variables that might be used in more 
//than one function
let betLine, 
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
    container1, 
    container2, 
    loopCounter,
    gameWinScene,
    timerID;

loopCounter = 0;

function setup() {
    //Create an optional alias called `id` for all the texture atlas 
    //frame id textures.
    id = resources["../textures/gameTextures.json"].textures;

    //Make the background using the alias
    background = new Sprite(id["BG.png"]);
    //Position the background
    background.position.set(0, 0);
    app.stage.addChild(background);

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
    //gameWinScene.tint = 0x777777;
    
    //Add sprites to containers
    fillContainer(container1, resultMatrix);
    fillContainer(container2, resultMatrix);

    //Add containers to the stage
    app.stage.addChild(container1);
    app.stage.addChild(container2);

    //Game state
    state = function stop () {};

    //Game launch button handler
    function playGameHandler() {
        app.stage.removeChild(betLine);
        app.stage.removeChild(gameWinScene);
        state = play;
    }

    //Play the game
    function play(delta) {
        btnSpin.visible = false;

        if (loopCounter == 4) {
            loopCounter = 0;
            container1.y = 0;
            container2.y = -536;
            state = stop;

            //changeResultMatrix(resultMatrix);
            app.stage.removeChild(container1);
            container1 = createContainer(70, 0, 710, 536);
            fillContainer(container1, resultMatrix);
            app.stage.addChild(container1);

            if (checkWin( resultMatrix )) {
                app.stage.addChild(betLine);
                app.stage.addChild(gameWinScene);
                timerID = setTimeout(()=>{
                    app.stage.removeChild(gameWinScene);
                }, 3000)
                console.log("WIN");
            } else {
                console.log("LOSS");
            }

            btnSpin.visible = true;

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

    //Start the game loop
    gameLoop();
}
  
function gameLoop(delta){
    requestAnimationFrame(gameLoop);
    state(delta);
}

//Create container function
function createContainer(positionX, positionY, width, height) {
    container = new PIXI.particles.ParticleContainer();
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
function checkWin( resultMatrix ) {
    let rM = resultMatrix;
    if ( rM[1][0] === "SYM1.png" && rM[1][0] === rM[1][1] && rM[1][1] === rM[1][2] ) {
        return false;
    } else if ( rM[1][0] === rM[1][1] && rM[1][1] === rM[1][2] ) {
        return true;
    } else if ( rM[1].indexOf("SYM1.png") > -1 ) {
        if ( rM[1][0] === rM[1][1] || rM[1][1] === rM[1][2] || rM[1][0] === rM[1][2] ) {
            return true;
        }
        return false;
    }
    return false;
}