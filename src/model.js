import Dispatcher from './dispatcher';
import {moveEntity} from './map-util';

const model = {
  state: {
    currentScene: null,
    lastMoveFinished: true,
    playerMoved: false
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
    //console.log("this", this);
    // sconsole.log("change scene");
    this.state.currentScene = this.scenes[scene];
    this.state.currentScene.onEnter();
    Dispatcher.sendMessage({action: "Change Scene", payload: [this.state.currentScene]});
  },
  handleKeyPress(key) {
    // console.log(key)
    // console.log("this", this, this.state);
    let request;
    if(typeof this.state.currentScene.controlMap[key] === "function"){
      request = this.state.currentScene.controlMap[key]();
    }
    if(request){
        request.action(...request.args);
    }
  }, // this should be somewhere else
  movePlayer(key){
    // console.log("move player", key);
    if (!this.state.playerMoved && this.state.lastMoveFinished) {
      moveEntity(this.state.player, key);
      this.state.playerMoved = true;
      this.state.lastMoveFinished = false;
      Dispatcher.sendMessage({action: "Player Moved", payload: [this.state.currentScene]});
    }
  }
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
