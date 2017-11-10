import Dispatcher from './dispatcher';

const model = {
  state: {},
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
  }
};

const Scene = {
  id: null,
  entities: null,
  onEnter: null,
  controllerMap: null
}
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
}

Dispatcher.addAction(model, {name: "Move", trigger(payload) { console.log(payload); } });

export default model;
