"use strict";var type="WebGL";PIXI.utils.isWebGLSupported()||(type="canvas");var Application=PIXI.Application,loader=PIXI.loader,resources=PIXI.loader.resources,Sprite=PIXI.Sprite,app=new Application({width:960,height:536,antialias:!1,transparent:!1,resolution:1}),symbols=["SYM1.png","SYM3.png","SYM4.png","SYM5.png","SYM6.png","SYM7.png"],resultMatrix=[["SYM1.png","SYM6.png","SYM3.png"],["SYM3.png","SYM5.png","SYM1.png"],["SYM4.png","SYM7.png","SYM6.png"]],accountState={totalAmount:100,wonPerGame:0},loadingMessage=document.querySelector("#loading-message"),gameContainer=document.querySelector("#game");function loadProgressHandler(){}gameContainer.removeChild(loadingMessage),gameContainer.appendChild(app.view),loader.add("../textures/gameTextures.json").on("progress",loadProgressHandler).load(setup);var betLine,background,btnSpin,btnSpinD,sym1,sym3,sym4,sym5,sym6,sym7,id,state,container1,container2,styleCashMessage,cashMessageContainer,cashMessage,gameWinScene,cashMessageRectangle,timerID,loopCounter=0;function setup(){id=resources["../textures/gameTextures.json"].textures,(background=new Sprite(id["BG.png"])).position.set(0,0),app.stage.addChild(background),(btnSpinD=new Sprite(id["BTN_Spin_d.png"])).position.set(824,218),app.stage.addChild(btnSpinD),(btnSpin=new Sprite(id["BTN_Spin.png"])).position.set(824,218),btnSpin.interactive=!0,btnSpin.buttonMode=!0,btnSpin.defaultCursor="pointer",btnSpin.on("mousedown",playGameHandler),btnSpin.on("touchstart",playGameHandler),app.stage.addChild(btnSpin),container2=createContainer(70,-536,710,536),container1=createContainer(70,0,710,536),(betLine=new Sprite(id["Bet_Line.png"])).position.set(40,268),styleCashMessage=new PIXI.TextStyle({fontFamily:"Arial",fontSize:20,fill:"yellow",align:"left"}),(cashMessage=new PIXI.Text("MONEY: $".concat(accountState.totalAmount,"\nWIN: ").concat(accountState.wonPerGame),styleCashMessage)).x=810,cashMessage.y=380,(cashMessageContainer=new PIXI.Container).width=150,cashMessageContainer.height=100,(cashMessageRectangle=new PIXI.Graphics).beginFill(931903,.8),cashMessageRectangle.x=800,cashMessageRectangle.y=370,cashMessageRectangle.drawRect(0,0,150,100),cashMessageContainer.addChild(cashMessageRectangle),cashMessageContainer.addChild(cashMessage),app.stage.addChild(cashMessageContainer);var e=new PIXI.TextStyle({fontFamily:"Arial",fontSize:120,fill:"yellow",align:"center"}),n=new PIXI.Text("YOU WON!",e);n.x=120,n.y=200,(gameWinScene=new PIXI.Container).width=710,gameWinScene.height=336;e=new PIXI.Graphics;e.beginFill(1531497,.9),e.x=75,e.y=110,e.drawRect(0,0,710,336),gameWinScene.addChild(e),gameWinScene.addChild(n),fillContainer(container1,resultMatrix),fillContainer(container2,resultMatrix),app.stage.addChild(container1),app.stage.addChild(container2),state=stopGame,app.ticker.add(function(){return gameLoop()})}function updateCashMessage(){cashMessageContainer.removeChild(cashMessage),(cashMessage=new PIXI.Text("MONEY: $".concat(accountState.totalAmount,"\nWIN: ").concat(accountState.wonPerGame),styleCashMessage)).x=810,cashMessage.y=380,cashMessageContainer.addChild(cashMessage)}function playGameHandler(){app.stage.removeChild(betLine),app.stage.removeChild(gameWinScene),accountState.totalAmount-=5,updateCashMessage(),state=play}function play(e){if(btnSpin.visible=!1,4==loopCounter)return loopCounter=0,container1.y=0,container2.y=-536,state=stopGame,app.stage.removeChild(container1),fillContainer(container1=createContainer(70,0,710,536),resultMatrix),app.stage.addChild(container1),checkWin(resultMatrix)&&(app.stage.addChild(betLine),app.stage.addChild(gameWinScene),accountState.totalAmount+=10,accountState.wonPerGame+=1,updateCashMessage(),timerID=setTimeout(function(){app.stage.removeChild(gameWinScene)},3e3)),void(4<accountState.totalAmount&&(btnSpin.visible=!0));536<container1.y&&(container1.y=-536),536<container2.y&&(container2.y=-536,loopCounter+=1),container1.y+=70,container2.y+=70}function stopGame(){}function gameLoop(e){state()}function createContainer(e,n,a,t){var i=new PIXI.particles.ParticleContainer;return i.position.set(e,n,a,t),i.width=a,i.height=t,i}function fillContainer(e,n){for(var a=[[[0,14],[240,14],[480,14]],[[0,194],[240,194],[480,194]],[[0,374],[240,374],[480,374]]],t=0;t<3;t++)for(var i=0;i<3;i++){n[t][i]=symbols[randomInt(0,5)];var s=new Sprite(id[n[t][i]]);s.position.set(a[t][i][0],a[t][i][1]),e.addChild(s)}}function randomInt(e,n){return Math.floor(Math.random()*(n-e+1))+e}function checkWin(e){return("SYM1.png"!==e[1][0]||e[1][0]!==e[1][1]||e[1][1]!==e[1][2])&&(e[1][0]===e[1][1]&&e[1][1]===e[1][2]||-1<e[1].indexOf("SYM1.png")&&(e[1][0]===e[1][1]||e[1][1]===e[1][2]||e[1][0]===e[1][2]))}