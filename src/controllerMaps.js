import Model from "./model";

const controllerMaps = {
  start: {
    "Enter": () => { return {action: Model.changeScene.bind(Model), args: ["play"]}; }
  },
  play: {
    "Enter": () => { return {action: Model.changeScene.bind(Model), args: ["gameOver"]}; },
    "ArrowUp": () => { return {action: Model.movePlayer.bind(Model), args: ["ArrowUp"]}; },
    "ArrowDown": () => { return {action: Model.movePlayer.bind(Model), args: ["ArrowDown"]}; },
    "ArrowLeft": () => { return {action: Model.movePlayer.bind(Model), args: ["ArrowLeft"]}; },
    "ArrowRight": () => { return {action: Model.movePlayer.bind(Model), args: ["ArrowRight"]}; },
  },
  gameOver: {
    "Enter": () => { return {action: Model.changeScene.bind(Model), args: ["start"]}; }
  }
};
export default controllerMaps;
// I'd like to create this dynamically, not entirely convinced that it makes sense
// The binding `Model.changeScene.bind(Model)` seems really quirky, gotta look into why the context is getting obliterated when it's not so late.
