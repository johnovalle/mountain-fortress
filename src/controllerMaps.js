import Model from "./model";
import { Game } from './game';

const controllerMaps = {
  start: {
    "Enter": () => { return {action: Model.changeScene.bind(Model), args: ["play"]}; },
    "m": () => { return {action: Game.toggleMusic.bind(Game), args: []}; }
  },
  play: {
    //"Enter": () => { return {action: Model.changeScene.bind(Model), args: ["gameOver"]}; },
    "ArrowUp": () => { return {action: Game.movePlayer.bind(Game), args: ["up"]}; },
    "ArrowDown": () => { return {action: Game.movePlayer.bind(Game), args: ["down"]}; },
    "ArrowLeft": () => { return {action: Game.movePlayer.bind(Game), args: ["left"]}; },
    "ArrowRight": () => { return {action: Game.movePlayer.bind(Game), args: ["right"]}; },
    "8": () => { return {action: Game.movePlayer.bind(Game), args: ["up"]}; },
    "2": () => { return {action: Game.movePlayer.bind(Game), args: ["down"]}; },
    "4": () => { return {action: Game.movePlayer.bind(Game), args: ["left"]}; },
    "6": () => { return {action: Game.movePlayer.bind(Game), args: ["right"]}; },
    "7": () => { return {action: Game.movePlayer.bind(Game), args: ["up-left"]}; },
    "9": () => { return {action: Game.movePlayer.bind(Game), args: ["up-right"]}; },
    "1": () => { return {action: Game.movePlayer.bind(Game), args: ["down-left"]}; },
    "3": () => { return {action: Game.movePlayer.bind(Game), args: ["down-right"]}; },
    "5": () => { return {action: Game.movePlayer.bind(Game), args: ["wait"]}; },
    "w": () => { return {action: Game.movePlayer.bind(Game), args: ["up"]}; },
    "x": () => { return {action: Game.movePlayer.bind(Game), args: ["down"]}; },
    "a": () => { return {action: Game.movePlayer.bind(Game), args: ["left"]}; },
    "d": () => { return {action: Game.movePlayer.bind(Game), args: ["right"]}; },
    "q": () => { return {action: Game.movePlayer.bind(Game), args: ["up-left"]}; },
    "e": () => { return {action: Game.movePlayer.bind(Game), args: ["up-right"]}; },
    "z": () => { return {action: Game.movePlayer.bind(Game), args: ["down-left"]}; },
    "c": () => { return {action: Game.movePlayer.bind(Game), args: ["down-right"]}; },
    "s": () => { return {action: Game.movePlayer.bind(Game), args: ["wait"]}; },
    "m": () => { return {action: Game.toggleMusic.bind(Game), args: []}; }
  },
  gameOver: {
    "Enter": () => { return {action: Model.changeScene.bind(Model), args: ["start"]}; }
  }
};
export default controllerMaps;
// I'd like to create this dynamically, not entirely convinced that it makes sense
// The binding `Model.changeScene.bind(Model)` seems really quirky, gotta look into why the context is getting obliterated when it's not so late.
