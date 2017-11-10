import * as Canvas from "./canvas";
import Model from "./model";
import Dispatcher from "./dispatcher";
Canvas.attachCanvas(document.body);

//console.log(Model);

Model.addScene("start", ()=>{ return "x"}, null);
Model.addScene("gameOver", ()=>{ return "y"}, null);
Model.addScene("play", ()=>{ return "z"}, null);

Dispatcher.addListener(Model);
Dispatcher.sendMessage({action: "Move", payload: "Arrow Up"});
console.log(Model);
