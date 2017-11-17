import Config from "./config";

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
  console.log("before move entity", key, currentCoords);
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
  console.log(entity);

}
