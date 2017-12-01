import Model from "./model";
import { Game } from './game';

const controllerMaps = {
  start: {
    "Enter": () => { return {action: Model.changeScene.bind(Model), args: ["play"]}; }
  },
  play: {
    "Enter": () => { return {action: Model.changeScene.bind(Model), args: ["gameOver"]}; },
    "ArrowUp": () => { return {action: Game.movePlayer.bind(Game), args: ["ArrowUp"]}; },
    "ArrowDown": () => { return {action: Game.movePlayer.bind(Game), args: ["ArrowDown"]}; },
    "ArrowLeft": () => { return {action: Game.movePlayer.bind(Game), args: ["ArrowLeft"]}; },
    "ArrowRight": () => { return {action: Game.movePlayer.bind(Game), args: ["ArrowRight"]}; },
  },
  gameOver: {
    "Enter": () => { return {action: Model.changeScene.bind(Model), args: ["start"]}; }
  }
};
export default controllerMaps;
// I'd like to create this dynamically, not entirely convinced that it makes sense
// The binding `Model.changeScene.bind(Model)` seems really quirky, gotta look into why the context is getting obliterated when it's not so late.
