import * as Canvas from "./canvas";
import Model from "./model";
Canvas.attachCanvas(document.body);

console.log(Model);

Model.addScene("start", ()=>{ return "x"}, null);
Model.addScene("gameOver", ()=>{ return "y"}, null);
Model.addScene("play", ()=>{ return "z"}, null);
console.log(Model);
