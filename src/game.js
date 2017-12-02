import * as Canvas from "./canvas";
import Model from "./model";
import Dispatcher from "./dispatcher";
import ControllerMaps from "./controllerMaps";
import {loadSpritesheet} from "./sprites";
import {draw} from "./draw";
import { getRandomAvailable } from "./roomGen";
import Config from "./config";
import * as MapUtil from "./map-util";
import * as Entity from './entities';
import { map1 } from './maps';

var animationCounter = 0;

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
  loadGame(){
    loadSpritesheet("mountain-fortress.png", 32, 256, () => {
      this.run();
    })
  },
  start(){
    Canvas.attachCanvas(document.body);

    Model.addScene("start", ()=>{ console.log("enter start scene"); }, ControllerMaps.start );
    Model.addScene("gameOver", ()=>{ console.log("enter game over scene"); }, ControllerMaps.gameOver );
    Model.addScene("play", () => { console.log("enter play scene");
      let level1 = Model.createLevel();
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
    Model.changeScene("start");
  },
  run() {
    //might make sense to run update on every frame as well
    if(!Model.state.lastMoveFinished){
          this.update(Model.state);
    }
    draw(Model.state);
    requestAnimationFrame(this.run.bind(this));
  },
  update(state) {
    animateEntityMovement(state);
  },
  movePlayer(key) {
    // console.log("move player", key);
    if (!this.state.playerMoved && this.state.lastMoveFinished) {
      //check the new position and return a values
      //if value is empty go there
      //if there is something there handle it (stairs, monster, item);

      let targetAtIndex = MapUtil.checkIndex(this.state.player, key);
      if(targetAtIndex.target.passible){
        MapUtil.moveEntity(this.state.player, key);
        this.state.playerMoved = true;
        this.state.lastMoveFinished = false;
        let entityAtIndex = Entity.getEntityAtIndex(this.state.currentScene.currentLevel, targetAtIndex.index);
        //console.log(this.state.currentScene.currentLevel.entities, entityAtIndex)
        if (entityAtIndex && entityAtIndex.type === "stairs") {

          this.useStairs(this.state.player, entityAtIndex);
        }
        Dispatcher.sendMessage({action: "Player Moved", payload: [this.state.currentScene]});
      }else{
        //handle items, stairs, monsters
      }
    }
  },
  useStairs(entity, stairs) {
    let currentLevel = this.state.currentScene.currentLevel;
    let nextLevel;
    if(stairs.targetLevel === null){
      nextLevel = Model.createLevel(currentLevel, stairs);
    } else {
      nextLevel = Model.levels[stairs.targetLevel];
    }
    //  let nextLevel = model.levels[stairs.target];
    entity.index = stairs.targetIndex;
    nextLevel.entities.push(entity);
    Object.assign(entity, MapUtil.indexTrueToXY(entity.index)); //check
    entity.nextX = entity.x;
    entity.nextY = entity.y;

    //
    //  let message = "You go ";
    //  if(stairs.type === "stairsUp"){ //there are only two types of stairs
    //    message += "up the stairs"; //to level?
    //  } else {
    //    message += "down the stairs";
    //  }
    //  messageLog.messages.push(message);
    this.goToLevel(stairs.targetLevel);
    Entity.removeEntityFromLevel(currentLevel, entity);
  },
  goToLevel(level) {
    this.state.currentScene.currentLevel = Model.levels[level];
    Entity.buildEntityMap(this.state.currentScene.currentLevel);
    //console.log(Model);
    Dispatcher.sendMessage({action: "Change Map", payload: [this.state.currentScene.currentLevel.map]});
    Dispatcher.sendMessage({action: "Player Moved", payload: [this.state.currentScene]});
    //model.scenes.play.level.entitiesMap = model.entitiesMaps[level];
  }

};
