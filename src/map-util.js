//bring these in from config
let mapWidth = 27;
let mapHeight = 27;
let tileSize = 32;
const rowsToShow = 4;
const maxOffsetX = mapWidth - 1 - rowsToShow;
const maxOffsetY = mapHeight - 1 - rowsToShow;


export const indexToXY = (index) => {
  let x = index % mapWidth;
  let y = Math.floor(index / mapWidth);
  return {x, y};
};

export const indexTrueToXY = (index) => {
  let x = (index % mapWidth) * tileSize;
  let y = Math.floor(index / mapWidth) * tileSize;
  return {x, y};
};

export const xyToIndex = (coords) => {
  return (coords.y*mapWidth) + coords.x;
};

export const getTranslation = (coords) => {
  let offsetCoords = {x:0, y:0};
  let extra = 0;
  if(coords.x > maxOffsetX){
    extra = coords.x - maxOffsetX;
  }

  if(coords.x >= rowsToShow ){
    offsetCoords.x = coords.x - (rowsToShow + extra);
  }else{
    offsetCoords.x = 0;
  }
  extra = 0;
  if(coords.y > maxOffsetY){
    extra = coords.y - maxOffsetY;
  }
  if(coords.y >= rowsToShow){
    offsetCoords.y = coords.y - (rowsToShow + extra);
  }else{
    offsetCoords.y = 0;
  }
  return offsetCoords;
};
// just to get this to work, this all needs to be completely rewritten
export const constrainCameraTranslation = (player) => {
  let coords = {x: 0, y: 0};
  if(player.x < rowsToShow * tileSize){
    coords.x = 0;
  }else if (player.x > maxOffsetX * tileSize) {
    coords.x = -(maxOffsetX - rowsToShow) * tileSize//-576; //-(22 - 4) * 32;
  } else {
    coords.x = -(player.x - (rowsToShow * tileSize));
  }

  if(player.y < rowsToShow * tileSize){
    coords.y = 0;
  }else if(player.y > maxOffsetY * tileSize) {
    coords.y = -(maxOffsetY - rowsToShow) * tileSize//-576; //-(22 - 4) * 32;
  } else {
    coords.y = -(player.y - (rowsToShow * tileSize));
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
    entity.index -= mapWidth;
    entity.nextY -= tileSize;
  }
  if(key === "ArrowDown" && currentCoords.y < mapHeight - 1){
    entity.index += mapWidth;
    entity.nextY += tileSize;
  }
  if(key === "ArrowLeft" && currentCoords.x > 0){
    entity.index -= 1;
    entity.nextX -= tileSize;
  }
  if(key === "ArrowRight" && currentCoords.x < mapWidth - 1){
    entity.index += 1;
    entity.nextX += tileSize;
  }
  console.log(entity);

}
