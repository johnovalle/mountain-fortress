let mapWidth = 27;
let mapHeight = 27;
const rowsToShow = 4;
const maxOffsetX = mapWidth - 1 - rowsToShow;
const maxOffsetY = mapHeight - 1 - rowsToShow;


export const indexToXY = (index) => {
  let x = index % 27;
  let y = Math.floor(index / 27);
  return {x, y};
};

export const indexTrueToXY = (index) => {
  let x = (index % 27) * 32;
  let y = Math.floor(index / 27) * 32;
  return {x, y};
};

export const xyToIndex = (coords) => {
  return (coords.y*27) + coords.x;
};

export const getTranslation = (coords) => {
  let offsetCoords = {x:0, y:0};
  let extra = 0;
  if(coords.x > 22){
    extra = coords.x - 22;
  }

  if(coords.x >= 4 ){
    offsetCoords.x = coords.x - (4 + extra);
  }else{
    offsetCoords.x = 0;
  }
  extra = 0;
  if(coords.y > maxOffsetY){
    extra = coords.y - maxOffsetY;
  }
  if(coords.y >= 4){
    offsetCoords.y = coords.y - (4 + extra);
  }else{
    offsetCoords.y = 0;
  }
  return offsetCoords;
};
// just to get this to work, this all needs to be completely rewritten
export const constrainCameraTranslation = (player) => {
  let coords = {x: 0, y: 0};
  if(player.x < 128){
    coords.x = 0;
  }else if (player.x > 704) {
    coords.x = -576; //-(22 - 4) * 32;
  } else {
    coords.x = -(player.x - 128);
  }

  if(player.y < 128){
    coords.y = 0;
  }else if(player.y > 704) {
    coords.y = -576; //-(22 - 4) * 32;
  } else {
    coords.y = -(player.y - 128);
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
    entity.index -= 27;
    entity.nextY -= 32;
  }
  if(key === "ArrowDown" && currentCoords.y < mapHeight - 1){
    entity.index += 27;
    entity.nextY += 32;
  }
  if(key === "ArrowLeft" && currentCoords.x > 0){
    entity.index -= 1;
    entity.nextX -= 32;
  }
  if(key === "ArrowRight" && currentCoords.x < 26){
    entity.index += 1;
    entity.nextX += 32;
  }
  console.log(entity);

}
