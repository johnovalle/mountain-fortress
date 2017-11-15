import * as Canvas from "./canvas";
import Model from "./model";
import Dispatcher from "./dispatcher";
import ControllerMaps from "./controllerMaps";
import {loadSpritesheet} from "./sprites";
import {draw} from "./draw";
import {map1} from "./maps";
import Config from "./config";
import * as MapUtil from "./map-util";
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
Model.scenes.play.entities = [{name: 'player', index: 364, x: 416, y: 416, key: 5 }] //364
console.log("XY",MapUtil.indexTrueToXY(364));
Model.state.player = Model.scenes.play.entities[0];
// end Temp

Model.changeScene("start");

console.log(Model);

loadSpritesheet("mountain-fortress.png", 32, 256, ()=>{
  run();
})

const run = () => {
  if(!Model.state.lastMoveFinished){
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
    }

    for(let i = 0; i < state.currentScene.entities.length; i++){
        let entity = state.currentScene.entities[i];
        if(entity.x != entity.nextX){
            if(entity.x < entity.nextX) {
              entity.x += moveAniSpeed;
              Dispatcher.sendMessage({action: "Update CameraX", payload: moveAniSpeed}); //This is not the best way to do this but let's just see if it works
            } else {
              entity.x -= moveAniSpeed;
              Dispatcher.sendMessage({action: "Update CameraX", payload: -moveAniSpeed});
            }

        }
        if(entity.y != entity.nextY){
          if(entity.y < entity.nextY) {
            entity.y += moveAniSpeed;
            Dispatcher.sendMessage({action: "Update CameraY", payload: moveAniSpeed});
          } else {
            entity.y -= moveAniSpeed;
            Dispatcher.sendMessage({action: "Update CameraY", payload: -moveAniSpeed});
          }
        }
    }
    animationCounter += moveAniSpeed;
    if(animationCounter === 32){
        animationCounter = 0;
        state.lastMoveFinished = true;
    }
}
