import * as Canvas from "./canvas";
import Model from "./model";
import Dispatcher from "./dispatcher";
import ControllerMaps from "./controllerMaps";
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

Model.changeScene("start");
console.log(Model);
