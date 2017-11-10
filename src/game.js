import * as Canvas from "./canvas";
import Model from "./model";
import Dispatcher from "./dispatcher";
Canvas.attachCanvas(document.body);

//console.log(Model);

Model.addScene("start", ()=>{ console.log("enter start scene"); }, null);
Model.addScene("gameOver", ()=>{ console.log("enter start scene"); }, null);
Model.addScene("play", ()=>{ console.log("enter start scene"); }, null);

addEventListener("keydown", (event) => {
    Dispatcher.sendMessage({action: "Key Press", payload: event.key});
});

Dispatcher.addListener(Model);
// Dispatcher.sendMessage({action: "Key Press", payload: "ArrowUp"});

Model.changeScene("start");
console.log(Model);
