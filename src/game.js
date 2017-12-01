import * as Canvas from "./canvas";
import Model from "./model";
import Dispatcher from "./dispatcher";
import ControllerMaps from "./controllerMaps";
import {loadSpritesheet} from "./sprites";
import {draw} from "./draw";
import { buildMap, getRandomAvailable } from "./roomGen";
import Config from "./config";
import * as MapUtil from "./map-util";
import * as Entity from './entities';
import { map1 } from './maps';
Canvas.attachCanvas(document.body);

Model.addScene("start", ()=>{ console.log("enter start scene"); }, ControllerMaps.start );
Model.addScene("gameOver", ()=>{ console.log("enter game over scene"); }, ControllerMaps.gameOver );
Model.addScene("play", () => { console.log("enter play scene");
  let level1 = createLevel();
  Model.scenes.play.currentLevel = level1;
  Dispatcher.sendMessage({action: "Change Map", payload: [Model.scenes.play.currentLevel.map]});
  let playerStart = getRandomAvailable(Model.scenes.play.currentLevel.map);
  Model.state.player = Entity.buildPlayer(level1, 5, playerStart); //{index: 28, x: 1, y:1}
  //Model.scenes.play.currentLevel.entities.push({name: 'player', index: playerStart.index, x: playerStart.x * 64, y: playerStart.y * 64, key: 5 });
  //Model.state.player = Model.scenes.play.currentLevel.entities[0];
}, ControllerMaps.play );

addEventListener("keydown", (event) => {
    Dispatcher.sendMessage({action: "Key Press", payload: [event.key]});
});

// move this
let levelCounter = 1;
const createLevel = () => {
  let level = {
    name: "level" + levelCounter,
    map: buildMap(27, 27, {0: [0,1,2], 1: [3,4]}), //map1
    entities: []
  }
  Entity.buildEntityMap(level);
  let stairIndex = getRandomAvailable(level.map)
  Entity.buildStairs(level, 7, stairIndex); //{index: 29, x: 2, y:1}

  Model.levels[level.name] = level;
  levelCounter++;
  return level;
};

Model.changeScene("start");

// console.log(Model);
// This isn't exactly right but for now I'll assume all sheets within a given project will have the same tileSize
loadSpritesheet("mountain-fortress.png", 32, 256, () => {
  run();
})

//might make sense to run update on every frame as well
const run = () => {
  if(!Model.state.lastMoveFinished){
        update(Model.state);
  }
  draw(Model.state);
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

  for(let i = 0; i < state.currentScene.currentLevel.entities.length; i++){
      let entity = state.currentScene.currentLevel.entities[i];
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
export const Game = {
  state: Model.state,
  movePlayer(key) {
    // console.log("move player", key);
    if (!this.state.playerMoved && this.state.lastMoveFinished) {
      //check the new position and return a values
      //if value is empty go there
      //if there is something there handle it (stairs, monster, item);

      let targetAtIndex = MapUtil.checkIndex(this.state.player, key);
      if(targetAtIndex.passible){
        MapUtil.moveEntity(this.state.player, key);
        this.state.playerMoved = true;
        this.state.lastMoveFinished = false;
        if (targetAtIndex.type = "stairs") {

        }
        Dispatcher.sendMessage({action: "Player Moved", payload: [this.state.currentScene]});
      }else{
        //handle items, stairs, monsters
      }


    }
  }
};
