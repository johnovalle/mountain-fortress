import Config from "./config";
import {ctx} from "./canvas";
import {spritesheet} from "./sprites";
import {buildEntityMap} from "./entities";
import * as MapUtil from "./map-util";
import Model from "./model";
import Dispatcher from "./dispatcher";

export const draw = (state) => {
  ctx.clearRect(0, 0, Config.canvasWidth, Config.canvasHeight);
  ctx.save();
  if(state.currentScene.map) { //Temporary
    let currentCoords = MapUtil.indexToXY(Model.state.player.index);
    let translateOffset = MapUtil.getTranslation(currentCoords);
    ctx.translate(translateOffset.x * -spritesheet.tileSize, translateOffset.y * -spritesheet.tileSize);
    drawMap(state.currentScene.map);
    drawEntities(state.currentScene);
  }
  ctx.restore();
}

const drawEntities = (level) => { //Temporary
  buildEntityMap(level);
  console.log("entitiesMap", level.entitiesMap);
  drawMap(level.entitiesMap);
}

const drawMap = (map) => {
  for(let i = 0, len = map.grid.length;  i < len; i++){
    let tile = map.grid[i];
    if(tile !== 0 || map.isBG){
      let x = (i % map.mapCols) * spritesheet.tileSize; // index / width of drawing area in tiles * tile size
      let y = Math.floor(i / map.mapCols) * spritesheet.tileSize;
      let sx = (tile % spritesheet.sheetCols) * spritesheet.tileSize // tile value against width of tilesheet in tiles * tile size on sheet
      let sy = Math.floor(tile / spritesheet.sheetCols) * spritesheet.sheetSize;
      ctx.drawImage(spritesheet.sheet, sx, sy, spritesheet.tileSize, spritesheet.tileSize, x, y, spritesheet.tileSize, spritesheet.tileSize);
    }
  }
};

// Let's see where this goes...
const drawer = {
  redraw(){
    draw(Model.state);
  }
};
Dispatcher.addListener(drawer);
Dispatcher.addAction(drawer, {name: "Change Scene", trigger: drawer.redraw});
Dispatcher.addAction(drawer, {name: "Player Moved", trigger: drawer.redraw});
