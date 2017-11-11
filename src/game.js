import * as Canvas from "./canvas";
import Model from "./model";
import Dispatcher from "./dispatcher";
import ControllerMaps from "./controllerMaps";
import {loadSpritesheet} from "./sprites";
import {draw} from "./draw";
import {map1} from "./maps";
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

Model.changeScene("start");

console.log(Model);

loadSpritesheet("mountain-fortress.png", 32, 256, ()=>{
  run();
})

const run = () => {
  draw(Model.state);
  requestAnimationFrame(run);
};
