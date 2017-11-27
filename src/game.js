import * as Canvas from "./canvas";
import Model from "./model";
import Dispatcher from "./dispatcher";
import ControllerMaps from "./controllerMaps";
import {loadSpritesheet} from "./sprites";
import {draw} from "./draw";
// import {map1} from "./maps";
import { buildMap, getRandomAvailable } from "./roomGen";
import Config from "./config";
import * as MapUtil from "./map-util";
Canvas.attachCanvas(document.body);

Model.addScene("start", ()=>{ console.log("enter start scene"); }, ControllerMaps.start );
Model.addScene("gameOver", ()=>{ console.log("enter game over scene"); }, ControllerMaps.gameOver );
Model.addScene("play", ()=>{ console.log("enter play scene"); }, ControllerMaps.play );

addEventListener("keydown", (event) => {
    Dispatcher.sendMessage({action: "Key Press", payload: [event.key]});
});

// Temp!!!
Model.scenes.play.map = buildMap(27, 27, {0: [0,1,2], 1: [3,4]});
Dispatcher.sendMessage({action: "Change Map", payload: [Model.scenes.play.map]});
let playerStart = getRandomAvailable(Model.scenes.play.map);
console.log(playerStart);
Model.scenes.play.entities = [{name: 'player', index: playerStart.index, x: playerStart.x, y: playerStart.y, key: 5 }] //364
Model.state.player = Model.scenes.play.entities[0];
// end Temp

Model.changeScene("start");

// console.log(Model);
// This isn't exactly right but for now I'll assume all sheets within a given project will have the same tileSize
loadSpritesheet("mountain-fortress.png", 32, 256, () => {
  run();
})

const run = () => {
  if(!Model.state.lastMoveFinished){
        update(Model.state);
        draw(Model.state);
  }
  requestAnimationFrame(run);
};

var animationCounter = 0;
function update(state){
  animateEntityMovement(state);
}

const animateEntityMovement = (state) => {
  if(state.playerMoved){
      state.playerMoved = false;
  }

  for(let i = 0; i < state.currentScene.entities.length; i++){
      let entity = state.currentScene.entities[i];
      let moveX, moveY;
      if(entity.x != entity.nextX){
          if(entity.x < entity.nextX) {
            entity.x += Config.moveAniSpeed;
            moveX = Config.moveAniSpeed;
          } else {
            entity.x -= Config.moveAniSpeed;
            moveX = -Config.moveAniSpeed;
          }
      }

      if(entity.y != entity.nextY){
        if(entity.y < entity.nextY) {
          entity.y += Config.moveAniSpeed;
          moveY = Config.moveAniSpeed;
        } else {
          entity.y -= Config.moveAniSpeed;
          moveY = -Config.moveAniSpeed;
        }
      }
      if(entity.name === 'player') {
        Dispatcher.sendMessage({action: "Update Camera", payload: [moveX, moveY]});
      }
  }
  animationCounter += Config.moveAniSpeed;
  if(animationCounter === Config.tileSize){
      animationCounter = 0;
      state.lastMoveFinished = true;
  }
}
