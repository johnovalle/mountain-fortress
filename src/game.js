import * as Canvas from "./canvas";
import Model from "./model";
import Dispatcher from "./dispatcher";
import ControllerMaps from "./controllerMaps";
import {loadSpritesheet} from "./sprites";
import {draw} from "./draw";
import {map1} from "./maps";
import Config from "./config";
Canvas.attachCanvas(document.body);

//console.log(Model);

Model.addScene("start", ()=>{ console.log("enter start scene"); }, ControllerMaps.start );
Model.addScene("gameOver", ()=>{ console.log("enter game over scene"); }, ControllerMaps.gameOver );
Model.addScene("play", ()=>{ console.log("enter play scene"); }, ControllerMaps.play );

addEventListener("keydown", (event) => {
    Dispatcher.sendMessage({action: "Key Press", payload: event.key});
});

Dispatcher.addListener(Model);
// Dispatcher.sendMessage({action: "Key Press", payload: "ArrowUp"});

// Temp!!!
Model.scenes.play.map = map1;
Config.currentLevel.mapCols = map1.mapCols;
Config.currentLevel.mapRows = map1.mapRows;
Model.scenes.play.entities = [{name: 'player', index: 364, x: 0, y: 0, key: 5 }] //364
Model.state.player = Model.scenes.play.entities[0];
// end Temp

Model.changeScene("start");

console.log(Model);

loadSpritesheet("mountain-fortress.png", 32, 256, ()=>{
  run();
})

const run = () => {
  if(!game.state.lastMoveFinished){
        update(Model.state);
        draw(Model.state);
  }
  requestAnimationFrame(run);
};

// Refactor before proceeding
var animationCounter = 0;
var moveAniSpeed =  2;
function update(state){
    // this probably should be in it's own function
    if(state.playerMoved){
        state.playerMoved = false;
        moveEntities(state);
    }

    for(let i = 0; i < state.entities.length; i++){
        let entity = state.entities[i];
        if(entity.x != entity.nextX){
            entity.x += moveAniSpeed * entity.lastMoveX; //change the direction
        }
        if(entity.y != entity.nextY){
            entity.y += moveAniSpeed * entity.lastMoveY;
        }
    }
    animationCounter += moveAniSpeed;
    if(animationCounter === 32){
        animationCounter = 0;
        state.lastMoveFinished = true;
    }
}
