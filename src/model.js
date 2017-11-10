import Dispatcher from './dispatcher';

const model = {
  state: {
    currentScene: null
  },
  scenes: {},
  levels: {}, //This might not even need to be here
  addScene(name, onEnter, controllerMap) {
    //console.log(this);
    if(!this.scenes[name]){
      this.scenes[name] = Object.assign({}, Scene, {
        id: SceneId,
        entities: [],
        onEnter,
        controllerMap
      });
      SceneId++;
    }else{
      console.error(`Scene with the name ${name} already exists`);
    }
  },
  changeScene(scene){
    this.state.currentScene = this.scenes[scene];
    this.state.currentScene.onEnter();
  },
  handleKeyPress(key) {
    console.log(key)
    let request;
    if(typeof this.state.currentScene.controlMap[key] === "function"){
      request = this.state.currentScene.controlMap[key]();
    }
    if(request){
        request.action(...request.args);
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

const addScene = (name, onEnter, controllerMap) => {
  if(!game.scenes[name]){
    game.scenes[name] = Object.assign({}, Scene, {
      id: SceneId,
      entities: [],
      onEnter,
      controllerMap
    });
    SceneId++;
  }else{
    console.error(`Scene with the name ${name} already exists`);
  }
};

Dispatcher.addAction(model, {name: "Key Press", trigger: model.handleKeyPress});


export default model;
