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
let accountState = {
    totalAmount: 100,
    wonPerGame: 0
};

//Add the canvas that Pixi automatically created and added to HTML document
let loadingMessage = document.querySelector('#loading-message');
let gameContainer = document.querySelector('#game');
gameContainer.removeChild(loadingMessage);
gameContainer.appendChild(app.view);

//load a JSON file with texture atlas and run the `setup` function when it's done
loader
    .add("../textures/gameTextures.json")
    .on("progress", loadProgressHandler)
    .load(setup);

function loadProgressHandler() {

}

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
