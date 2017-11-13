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

// This needs to be moved to entities
export const moveEntity = (entity, key) => {
  let currentCoords = indexToXY(entity.index);
  console.log("move entity", key, currentCoords);
  //send an action to dispatcher telling the draw to refresh
  if(key === "ArrowUp" && currentCoords.y > 0){
    entity.index -= 27;
  }
  if(key === "ArrowDown" && currentCoords.y < mapHeight - 1){
    entity.index += 27;
  }
  if(key === "ArrowLeft" && currentCoords.x > 0){
    entity.index -= 1;
  }
  if(key === "ArrowRight" && currentCoords.x < 26){
    entity.index += 1;
  }
}