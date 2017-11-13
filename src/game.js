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
Model.scenes.start.map = map1;
Config.currentLevel.mapCols = map1.mapCols;
Config.currentLevel.mapRows = map1.mapRows;
Model.scenes.start.entities = [{name: 'player', index: 364, x: 0, y: 0, key: 5 }] //364
Model.state.player = Model.scenes.start.entities[0];
// end Temp

Model.changeScene("start");

console.log(Model);

loadSpritesheet("mountain-fortress.png", 32, 256, ()=>{
  run();
})

const run = () => {
  draw(Model.state);
  //requestAnimationFrame(run);
};
