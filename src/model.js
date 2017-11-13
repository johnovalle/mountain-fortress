import Dispatcher from './dispatcher';
import {moveEntity} from './map-util';

const model = {
  state: {
    currentScene: null
  },
  scenes: {},
  levels: {}, //This might not even need to be here
  addScene(name, onEnter, controlMap) {
    //console.log(this);
    if(!this.scenes[name]){
      this.scenes[name] = Object.assign({}, Scene, {
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
    console.log("this", this);
    this.state.currentScene = this.scenes[scene];
    this.state.currentScene.onEnter();
  },
  handleKeyPress(key) {
    console.log(key)
    console.log("this", this, this.state);
    let request;
    if(typeof this.state.currentScene.controlMap[key] === "function"){
      request = this.state.currentScene.controlMap[key]();
    }
    if(request){
        request.action(...request.args);
    }
  }, // this should be somewhere else
  movePlayer(key){
    console.log("move player", key);
    moveEntity(this.state.player, key);
  }
};

const Scene = {
  id: null,
  entities: null,
  onEnter: null,
  controllerMap: null
};
let SceneId = 0;

Dispatcher.addAction(model, {name: "Key Press", trigger: model.handleKeyPress.bind(model)});


export default model;
