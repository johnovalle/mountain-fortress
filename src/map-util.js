import Config from "./config";
import { tileDictionary } from "./tiles";
import { getEntitiesAtIndex } from './entities';
import { getRandomInArray } from './utility';

export const indexToXY = (index) => {
  let x = index % Config.mapCols;
  let y = Math.floor(index / Config.mapCols);
  return {x, y, index};
};

export const indexTrueToXY = (index) => {
  let x = (index % Config.mapCols) * Config.tileSize;
  let y = Math.floor(index / Config.mapCols) * Config.tileSize;
  return {x, y, index};
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
  if(key === "up" && currentCoords.y > 0){
    entity.index -= Config.mapCols;
    entity.nextY -= Config.tileSize;
  }
  if(key === "down" && currentCoords.y < Config.mapRows - 1){
    entity.index += Config.mapCols;
    entity.nextY += Config.tileSize;
  }
  if(key === "left" && currentCoords.x > 0){
    entity.index -= 1;
    entity.nextX -= Config.tileSize;
  }
  if(key === "right" && currentCoords.x < Config.mapCols - 1){
    entity.index += 1;
    entity.nextX += Config.tileSize;
  }
  if(key === "up-left" && currentCoords.y > 0 && currentCoords.x > 0){
    entity.index -= Config.mapCols + 1;
    entity.nextY -= Config.tileSize;
    entity.nextX -= Config.tileSize;
  }
  if(key === "up-right" && currentCoords.y > 0 && currentCoords.x < Config.mapCols - 1){
    entity.index -= Config.mapCols - 1;
    entity.nextY -= Config.tileSize;
    entity.nextX += Config.tileSize;
  }
  if(key === "down-left" && currentCoords.y < Config.mapRows - 1 && currentCoords.x > 0){
    entity.index += Config.mapCols - 1;
    entity.nextY += Config.tileSize;
    entity.nextX -= Config.tileSize;
  }
  if(key === "down-right" && currentCoords.y < Config.mapRows - 1 && currentCoords.x < Config.mapCols - 1){
    entity.index += Config.mapCols + 1;
    entity.nextY += Config.tileSize;
    entity.nextX += Config.tileSize;
  }
  if(key === "wait"){
    // entity.index;
    // entity.nextX += Config.tileSize;
  }
  // console.log(entity);
};

export const checkIndex = (entity, key) => { //Think about drying this up
  let currentCoords = indexToXY(entity.index);
  let newIndex;
  if(key === "up" && currentCoords.y > 0){
    newIndex = entity.index - Config.mapCols;
  }
  if(key === "down" && currentCoords.y < Config.mapRows - 1){
    newIndex = entity.index + Config.mapCols;
  }
  if(key === "left" && currentCoords.x > 0){
    newIndex = entity.index - 1;
  }
  if(key === "right" && currentCoords.x < Config.mapCols - 1){
    newIndex = entity.index + 1;
  }
  if(key === "up-left" && currentCoords.y > 0 && currentCoords.x > 0 ){
    newIndex = entity.index - Config.mapCols - 1;
  }
  if(key === "up-right" && currentCoords.y > 0 && currentCoords.x < Config.mapCols - 1){
    newIndex = entity.index - Config.mapCols + 1;
  }
  if(key === "down-left" && currentCoords.y < Config.mapRows - 1 && currentCoords.x > 0){
    newIndex = entity.index + Config.mapCols - 1;
  }
  if(key === "down-right"&& currentCoords.y < Config.mapRows - 1 && currentCoords.x < Config.mapCols - 1){
    newIndex = entity.index + Config.mapCols + 1;
  }
  if(key === "wait" && currentCoords.x < Config.mapCols - 1){
    newIndex = entity.index;
  }
   //This wont handle entities at the moment, should I check against two maps or fuse them?
  return { target: tileDictionary[Config.currentMap.grid[newIndex]], index: newIndex };
};

export const getIndicesInViewport = () => { //takes a var to grab extra map cells around the the viewport
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

export const getValidDirection = (level, entity) => { //maybe this should be in entities
  let currentCoords = indexToXY(entity.index);
  let directionsMap = {};
  directionsMap[entity.index - Config.mapCols] = { key: "up" };
  directionsMap[entity.index + Config.mapCols] = { key:"down" };
  directionsMap[entity.index - 1] = { key: "left" };
  directionsMap[entity.index + 1] = { key: "right" };
  directionsMap[entity.index - Config.mapCols - 1] = { key: "up-left" };
  directionsMap[entity.index - Config.mapCols + 1] = { key:"up-right" };
  directionsMap[entity.index + Config.mapCols - 1] = { key: "down-left" };
  directionsMap[entity.index + Config.mapCols + 1] = { key: "down-right" };

  let directions = checkForValidPoints(level, directionsMap);
  return directionsMap[getRandomInArray(directions)];
}

const checkForValidPoints = (level, pointMap) => {
  return Object.keys(pointMap).filter((index) => {
    let valid = true;
    index = parseInt(index);
    if (tileDictionary[Config.currentMap.grid[index]].passible) {
      pointMap[index].entities = getEntitiesAtIndex(level, index); //this should not happen unless tile.passbile on map
      for (let i = 0; i < pointMap[index].entities.length; i++) {
        if(pointMap[index].entities[i].type === 'monster') {
          valid = false;
        }
      }
      return valid;
    }
    return false;
  });
}

function getPoints(a,b,multiplier){
  var dist = Math.abs(a.x - b.x);
  var points = [];
  for(var i = 1; i < dist; i++){
    points.push({x: a.x+i*multiplier.x, y: a.y+i*multiplier.y, dist: dist});
  }
  return points;
}

function getAllPointsAtRange(originPoint, dist){
  let a = {x: originPoint.x, y: originPoint.y - dist, dist: dist};
  let b = {x: originPoint.x + dist, y: originPoint.y, dist: dist};
  let c = {x: originPoint.x, y: originPoint.y + dist, dist: dist};
  let d = {x: originPoint.x - dist, y: originPoint.y, dist: dist};

  let points = [a,b,c,d]
                .concat(getPoints(a,b, {x: 1, y: 1}))
                .concat(getPoints(b,c, {x: -1, y: 1}))
                .concat(getPoints(c,d, {x: -1, y: -1}))
                .concat(getPoints(d,a, {x: 1, y: -1}));
  return points;
}

export function getAllPoints(originPoint, dist){
  let points = [];
  for(var i = 1; i < dist; i++){
    let x = getAllPointsAtRange(originPoint, i);
    points = points.concat(x);
  }
  return points;
}

export const getDirectionTowardsPoint = (level, origin, dest) => {
  let direction = { x: 0, y: 0 };
  let xDif, yDif;
  xDif = dest.x - origin.x;
  if (xDif > 0) {
    direction.x = 1;
  } else if(xDif < 0) {
    direction.x = -1;
  }

  yDif = dest.y - origin.y;
  if (yDif > 0) {
    direction.y = 1;
  } else if(yDif < 0) {
    direction.y = -1;
  }
  let directionsMap = getDirectionIndices(origin, direction);
  let directions = checkForValidPoints(level, directionsMap);
  return directionsMap[getRandomInArray(directions)];
};

const getDirectionIndices = (origin, direction) => { //min 1, max 3 possiblities
  let possibleIndices = {};
  //some diagonals should get sent even if they are parallel but should prefer the parallel route...
  //similarly it should prefer diagonal routes when available
  //pass pack two arrays, primary and secondary routes, if there are no valid primary routes evaluate secondary routes
  if (direction.x !== 0 && direction.y !== 0){
    //diagonal, skip for now
    // { x: origin.x + direction.x,
    //  y: origin.y + direction.y }
    if(direction.y === -1 && direction.x === -1) {
      possibleIndices[origin.index - Config.mapCols - 1] = { key: "up-left" }
    }
    if(direction.y === -1 && direction.x === 1) {
      possibleIndices[origin.index - Config.mapCols + 1] = { key: "up-right" }
    }
    if(direction.y === 1 && direction.x === -1) {
      possibleIndices[origin.index + Config.mapCols - 1] = { key: "down-left" }
    }
    if(direction.y === 1 && direction.x === 1) {
      possibleIndices[origin.index + Config.mapCols + 1] = { key: "down-right" }
    }
  }
  if (direction.y === -1) {
    //possibleCoords.push({x: origin.x + direction.x, y: origin.y});
    possibleIndices[origin.index - Config.mapCols] = { key: "up" }
  }
  if (direction.y === 1) {
    //possibleCoords.push({x: origin.x, y: origin.y + direction.y});
    possibleIndices[origin.index + Config.mapCols] = { key:"down" };
  }
  if (direction.x === -1) {
    //possibleCoords.push({x: origin.x + direction.x, y: origin.y});
    possibleIndices[origin.index - 1] = { key: "left" }
  }
  if (direction.x === 1) {
    //possibleCoords.push({x: origin.x, y: origin.y + direction.y});
    possibleIndices[origin.index + 1] = { key: "right" };
  }
  //return possibleCoords;
  return possibleIndices;
};

//need to make  dictionary with the 9 possible direction to clean up some of this duplication
