import Dispatcher from './dispatcher';
import {moveEntity, checkIndex} from './map-util';
import { tileDictionary } from './tiles';
import * as Entity from './entities';
import { buildMap, getRandomAvailable } from "./roomGen";

const model = {
  state: {
    currentScene: null,
    lastMoveFinished: true,
    playerMoved: false
  },
  scenes: {},
  levels: {}, //This might not even need to be here
  levelCounter: 1,
  restart() {
    this.levelCounter = 1;
    this.levels = {};
  },
  addScene(name, onEnter, controlMap) {
    //console.log(this);
    if(!this.scenes[name]){
      this.scenes[name] = Object.assign({}, Scene, {
        name,
        id: SceneId,
        entities: [],
        onEnter,
        controlMap
      });
      SceneId++;
    }else{
      console.error(`Scene with the name ${name} already exists`);
    }
  },
  changeScene(scene){
    // this should send an event to dispatcher to redraw the screen
    //console.log("this", this);
    // sconsole.log("change scene");
    this.state.currentScene = this.scenes[scene];
    this.state.currentScene.onEnter();
    Dispatcher.sendMessage({action: "Change Scene", payload: [this.state.currentScene]});
  },
  createLevel(previousLevel, connectingStairs) {
    let level = {
      name: "level" + this.levelCounter,
      map: buildMap(27, 27, {0: [0,1,2], 1: [3,4]}), //map1
      entities: [],
      baseDifficulty: this.levelCounter,
      tick: 0
    }
    this.levels[level.name] = level;

    Entity.buildEntityMap(level);
    if (previousLevel) {
      let stairUpIndex = getRandomAvailable(level.map, level.entities);
      Entity.buildStairs(level, 6, stairUpIndex, previousLevel.name, connectingStairs.index);
      connectingStairs.targetLevel = level.name;
      connectingStairs.targetIndex = stairUpIndex.index;
    }

    if (this.levelCounter < 10) {
      let stairDownIndex = getRandomAvailable(level.map, level.entities);
      Entity.buildStairs(level, 7, stairDownIndex); //{index: 29, x: 2, y:1}
    }

    Entity.populateLevel(level);

    this.levels[level.name] = level;
    this.levelCounter++;
    return level;
  },
  handleKeyPress(key) {
    //console.log(key)
    // console.log("this", this, this.state);
    let request;
    if(typeof this.state.currentScene.controlMap[key] === "function"){
      request = this.state.currentScene.controlMap[key]();
    }
    if(request){
        request.action(...request.args);
    }
  },
};

const Scene = {
  id: null,
  entities: null,
  onEnter: null,
  controllerMap: null
};
let SceneId = 0;

Dispatcher.addListener(model);
Dispatcher.addAction(model, {name: "Key Press", trigger: model.handleKeyPress.bind(model)});


export default model;
