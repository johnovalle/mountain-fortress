import Config from "./config";
import { tileDictionary } from "./tiles";

export const indexToXY = (index) => {
  let x = index % Config.mapCols;
  let y = Math.floor(index / Config.mapCols);
  return {x, y};
};

export const indexTrueToXY = (index) => {
  let x = (index % Config.mapCols) * Config.tileSize;
  let y = Math.floor(index / Config.mapCols) * Config.tileSize;
  return {x, y};
};

export const xyToIndex = (coords) => {
  return (coords.y*Config.mapCols) + coords.x;
};

export const getTranslation = (coords) => {
  let offsetCoords = {x:0, y:0};
  let extra = 0;
  if(coords.x > Config.maxOffsetX){
    extra = coords.x - Config.maxOffsetX;
  }

  if(coords.x >= Config.rowsToShow ){
    offsetCoords.x = coords.x - (Config.rowsToShow + extra);
  }else{
    offsetCoords.x = 0;
  }
  extra = 0;
  if(coords.y > Config.maxOffsetY){
    extra = coords.y - Config.maxOffsetY;
  }
  if(coords.y >= Config.rowsToShow){
    offsetCoords.y = coords.y - (Config.rowsToShow + extra);
  }else{
    offsetCoords.y = 0;
  }
  return offsetCoords;
};
// just to get this to work, this all needs to be completely rewritten
export const constrainCameraTranslation = (player) => {
  let coords = {x: 0, y: 0};
  if(player.x < Config.rowsToShow * Config.tileSize){
    coords.x = 0;
  }else if (player.x > Config.maxOffsetX * Config.tileSize) {
    coords.x = -(Config.maxOffsetX - Config.rowsToShow) * Config.tileSize//-576; //-(22 - 4) * 32;
  } else {
    coords.x = -(player.x - (Config.rowsToShow * Config.tileSize));
  }

  if(player.y < Config.rowsToShow * Config.tileSize){
    coords.y = 0;
  }else if(player.y > Config.maxOffsetY * Config.tileSize) {
    coords.y = -(Config.maxOffsetY - Config.rowsToShow) * Config.tileSize//-576; //-(22 - 4) * 32;
  } else {
    coords.y = -(player.y - (Config.rowsToShow * Config.tileSize));
  }
  return coords;
};
// This needs to be moved to entities
export const moveEntity = (entity, key) => {
  let currentCoords = indexToXY(entity.index);
  // console.log("before move entity", key, currentCoords);
  //send an action to dispatcher telling the draw to refresh
  entity.nextY = entity.y;
  entity.nextX = entity.x;
  if(key === "ArrowUp" && currentCoords.y > 0){
    entity.index -= Config.mapCols;
    entity.nextY -= Config.tileSize;
  }
  if(key === "ArrowDown" && currentCoords.y < Config.mapRows - 1){
    entity.index += Config.mapCols;
    entity.nextY += Config.tileSize;
  }
  if(key === "ArrowLeft" && currentCoords.x > 0){
    entity.index -= 1;
    entity.nextX -= Config.tileSize;
  }
  if(key === "ArrowRight" && currentCoords.x < Config.mapCols - 1){
    entity.index += 1;
    entity.nextX += Config.tileSize;
  }
  // console.log(entity);
};

export const checkIndex = (entity, key) => { //Think about drying this up
  let currentCoords = indexToXY(entity.index);
  let newIndex;
  if(key === "ArrowUp" && currentCoords.y > 0){
    newIndex = entity.index - Config.mapCols;
  }
  if(key === "ArrowDown" && currentCoords.y < Config.mapRows - 1){
    newIndex = entity.index + Config.mapCols;
  }
  if(key === "ArrowLeft" && currentCoords.x > 0){
    newIndex = entity.index - 1;
  }
  if(key === "ArrowRight" && currentCoords.x < Config.mapCols - 1){
    newIndex = entity.index + 1;
  }
   //This wont handle entities at the moment, should I check against two maps or fuse them?
  return { target: tileDictionary[Config.currentMap.grid[newIndex]], index: newIndex };
};

export const getIndicesInViewport = () => {
  let viewport = Object.assign({}, Config.translateOffset);
  //X and Y meaing both the pixel position and the coordinate position is confusing and source of bugs fix
  viewport.x = Math.abs(viewport.x) / Config.tileSize;
  viewport.y = Math.abs(viewport.y) / Config.tileSize;
  let indices = []; // this should have a length of 81;

  for(let i = 0; i < Config.currentMap.grid.length; i++) {
    let tileCords = indexToXY(i);
    if(tileCords.x >= viewport.x && tileCords.x <= viewport.x + (Config.rowsToShow * 2)
       && tileCords.y >= viewport.y && tileCords.y <= viewport.y + (Config.rowsToShow * 2)) {
      indices.push(i);
    }
  }

  return indices;
}
