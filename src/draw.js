import Config from "./config";
import {ctx} from "./canvas";
import {spritesheet} from "./sprites";
import {buildEntityMap} from "./entities";
import * as MapUtil from "./map-util";
import Model from "./model";
import Dispatcher from "./dispatcher";

let currentCoords = null;
let translateOffset = {x: 0, y: 0};

export const draw = (state) => {
  ctx.clearRect(0, 0, Config.canvasWidth, Config.canvasHeight);
  ctx.save();
  if(state.currentScene.currentLevel && state.currentScene.currentLevel.map) { //Temporary
    //console.log(translateOffset);
    //ctx.translate(translateOffset.x * -spritesheet.tileSize, translateOffset.y * -spritesheet.tileSize);
    ctx.translate(translateOffset.x, translateOffset.y);
    drawMap(state.currentScene.currentLevel.map);
    drawEntities(state.currentScene.currentLevel);
  }
  ctx.restore();
}

const setCameraOffset = () => {
  //console.log("this got called");
  currentCoords = MapUtil.indexToXY(Model.state.player.index); //only get this on scene/level change
  translateOffset = MapUtil.getTranslation(currentCoords); // ''
  translateOffset.x *= -Config.tileSize;
  translateOffset.y *= -Config.tileSize;
  // I don't know if I really want to put this here but just for the sake of simplicity
  Config.translateOffset = translateOffset;
}

//TODO DRY up these two methods
const drawEntities = (level) => { //Temporary
  //buildEntityMap(level);
  //console.log("entitiesMap", level.entitiesMap);
  // drawMap(level.entitiesMap);
  // need to draw entities by X and Y values so that I can animate them,
  // probably also need to store the offset as X and Y so the screen shift will also be smooth
  for(let i = 0; i <  level.entities.length; i++){
    let entity = level.entities[i];
    //console.log(entity.x, entity.y);
    // these properties can be stored on the entity itself rather than be calculated everytime
    let sx = (entity.key % spritesheet.sheetCols) * spritesheet.tileSize;
    let sy = Math.floor(entity.key / spritesheet.sheetCols) * spritesheet.tileSize;
    ctx.drawImage(spritesheet.sheet, sx, sy, spritesheet.tileSize, spritesheet.tileSize,
                                    entity.x, entity.y, Config.tileSize, Config.tileSize);
  }
}

const drawMap = (map) => {
  for(let i = 0, len = map.grid.length;  i < len; i++){
    let tile = map.grid[i];
    if(tile !== 0 || map.isBG){
      let x = (i % map.mapCols) * Config.tileSize; // index / width of drawing area in tiles * tile size
      let y = Math.floor(i / map.mapCols) * Config.tileSize;
      let sx = (tile % spritesheet.sheetCols) * spritesheet.tileSize // tile value against width of tilesheet in tiles * tile size on sheet
      let sy = Math.floor(tile / spritesheet.sheetCols) * spritesheet.tileSize;
      ctx.drawImage(spritesheet.sheet, sx, sy, spritesheet.tileSize, spritesheet.tileSize,
                                      x, y, Config.tileSize, Config.tileSize);
    }
  }
};

// Let's see where this goes...
const drawer = {
  redraw(){
    if(Model.state.currentScene.currentLevel){
      setCameraOffset();
    }

    draw(Model.state);
  },
  updateCamera(xA, yA){
    translateOffset.x += xA;
    translateOffset.y += yA;
    translateOffset = MapUtil.constrainCameraTranslation(Model.state.player);
    Config.translateOffset = translateOffset
  },
};
Dispatcher.addListener(drawer);
Dispatcher.addAction(drawer, {name: "Change Scene", trigger: drawer.redraw});
Dispatcher.addAction(drawer, {name: "Update Camera", trigger: drawer.updateCamera});
