import { tileDictionary } from "./tiles";

let generatedRooms = [];
let nodeList = {};



export function buildMap(cols, rows, tiles) {
  generatedRooms = [];
  nodeList = {};
  let mapBase = Array(cols * rows).fill(1);
  populateMap(mapBase, cols, rows);
  replaceTiles(mapBase, tiles);
  return {mapCols: cols, mapRows: rows, isBG: true, grid: mapBase }; //refactor here and in other places now that map is being generated;
}


function populateMap(array, cols, rows) {
  let roomsGenerated = 0;
  let tries = 0;
  while ((roomsGenerated < 7 && tries < 300) || tries > 300) {
    tries++;
    let room = generateRoom(array, cols, rows);
    if (room) {
      room.id = roomsGenerated;
      generatedRooms[roomsGenerated] = room;
      nodeList[room.id] = [room];
      room.node = room.id;
      roomsGenerated++;
    }
  }
  connectRooms(array, cols, rows, generatedRooms);
}

function drawRoom(array, cols, room){
  for(let i = room.topLeft.x; i <= room.bottomRight.x; i++) {
    for(let j = room.topLeft.y; j <= room.bottomRight.y; j++) {
      array[i + (j * cols)] = 0;
    }
  }
}

function replaceTiles(baseMap, tiles) {
    for (let i = 0; i < baseMap.length; i++) {
      let random = getRandomInArray(tiles[baseMap[i]])
      baseMap[i] = tiles[baseMap[i]][random];
    }
}

function getRandomInArray(array){
  return Math.floor(Math.random() * array.length);
}

function getEmptyIndex(map){
  let empties = [];
  for (let i = 0; i < map.length; i++) {
    let tile = map[i];
    if(tileDictionary[tile].type === "floor") {
      empties.push(i);
    } //or passible?
  }
  return empties;
}
 //should take an array of entities and filter against their indices
export function getRandomAvailable(map){
  let empties = getEmptyIndex(map.grid);
  let index = empties[getRandomInArray(empties)];
  let xy = indexToXY(index, map.mapCols);
  return Object.assign({index}, xy);
}

function generateRoom(array, cols, rows){
  let minWidth = 3;
  let minHeight = 3;
  let maxWidth = Math.ceil(cols / 6);
  let maxHeight = Math.ceil(rows / 6);
  let roomWidth = Math.ceil(Math.random() * maxWidth) + minWidth;
  let roomHeight = Math.ceil(Math.random() * maxHeight) + minHeight;
  let minDistAppart = 2;

  let roomStart = getRoomStart(array, cols, rows, roomWidth, roomHeight);
  let roomEnd = roomStart + roomWidth;
  let success = true;
  let validIndicies = [];
  let lastIndex;
  for(let i = 0; i < roomWidth; i++){
    for(let j = 0; j < roomHeight; j++){
      let index = roomStart + i + (j * cols);
      if(array[index] === 1) {
        if(i === 0 && array[index-minDistAppart] !== 1) { //left row down touching
          success = false;
          break;
        } else if (i === roomWidth - 1 && array[index+minDistAppart] !== 1) { //right row down touching
          success = false;
          break;
        }  else if (j === 0 && array[(index - (cols * minDistAppart))] !== 1) { //top row touching
          success = false;
          break;
        }  else if (j === roomHeight - 1 && array[(index + (cols * minDistAppart))] !== 1) { //bottom row touching
          success = false;
          break;
        }
        validIndicies.push(index);
        lastIndex = index;
      } else {
        success = false;
        break;
      }
    }
  }

  if (success) {
    for(let i = 0; i < validIndicies.length; i++){
      array[validIndicies[i]] = 0;
    }
    return {topLeft: indexToXY(roomStart, cols), bottomRight: indexToXY(lastIndex, cols)};
  }else{
    return false;
  }
}

const indexToXY = (index, cols) => {
  let x = index % cols;
  let y = Math.floor(index / cols);
  return { x, y };
};

function getRoomStart(array, cols, rows, roomWidth, roomHeight) {
  let start = null;
  let foundStart = false;
  let tries = 0;
  while (!foundStart) {
    let index = Math.floor(Math.random() * array.length);
    let coords = indexToXY(index, cols);

    // makes sure room doesn't start or end on map edge
    if ( coords.x + roomWidth < cols - 1 && coords.y + roomHeight < rows - 1
      && coords.x > 0 && coords.y > 0) {
      foundStart = true;
      start = index;
    }
    tries++;
    if (tries > 20) {
      foundStart = true; // or break?
    }
  }
  return start;
}

const xyToIndex = (coords, cols) => {
  return coords.y * cols + coords.x;
};

function connectRooms(array, cols, rows, rooms) {
  for (let i = 0; i < rooms.length; i++) {
    let room = rooms[i];
    let willBend = Math.random() > 0.51;
    let pathFound = false;
    let validIndicies = [];
    let tries = 0;
    let path;

    if(nodeList[room.node].length < generatedRooms.length){
      path = connectRoomToRoom(room, rooms.filter((x) => x.node !== room.node));
    }else{
      path = connectRoomToRoom(room, rooms.filter((x) => x.id !== room.id));
    }
    validIndicies = getPathBetweenRooms(array, cols, rows, path);

    for (let i = 0; i < validIndicies.length; i++) {
      array[validIndicies[i]] = 0;
    }
  }
}

function connectRoomToRoom(room, rooms){
  let randomRoom = rooms[Math.floor(Math.random() * rooms.length)];

  let direction = {x: 0, y: 0};
  let point = {};
  let parallel = true;
  let initialDirection;
  let endAxis;
  if (randomRoom.topLeft.x > room.bottomRight.x) { //"right";
    direction.x = 1;
    point.x = room.bottomRight.x;
  } else if (randomRoom.bottomRight.x < room.topLeft.x) { // "left";
    direction.x = -1;
    point.x = room.topLeft.x;
  }

  if (randomRoom.topLeft.y > room.bottomRight.y) { // below
    direction.y = 1;
    point.y = room.bottomRight.y;
  } else if (randomRoom.bottomRight.y < room.topLeft.y) { // above
    direction.y = -1;
    point.y = room.topLeft.y;
  }

  //parallel on x axis
  let parallelAxes = [];

   //need to make sure the starting point is not already used or adjecent to another corridor.
  if((direction.x === -1 || direction.x === 1) && direction.y === 0) {
    parallelAxes = range(Math.max(room.topLeft.y, randomRoom.topLeft.y),
                            Math.min(room.bottomRight.y, randomRoom.bottomRight.y));
    point.y = parallelAxes[Math.floor(Math.random()*parallelAxes.length)];
    initialDirection = "x";
  } //parallel on y axis
  else if((direction.y === -1 || direction.y === 1) && direction.x === 0) {
    parallelAxes = range(Math.max(room.topLeft.x, randomRoom.topLeft.x),
                            Math.min(room.bottomRight.x, randomRoom.bottomRight.x));
    point.x = parallelAxes[Math.floor(Math.random()*parallelAxes.length)];
    initialDirection = "y";
  } else { // not parallel
    let startPoints = [];
    let endPoints = [];
    parallel = false;
    initialDirection = Math.random() < 0.5 ? "x" : "y";

    if(initialDirection === "x"){
      startPoints = range(room.topLeft.y, room.bottomRight.y);
      point.y = startPoints[Math.floor(Math.random() * startPoints.length)];
      endPoints = range(randomRoom.topLeft.x, randomRoom.bottomRight.x);
      endAxis = endPoints[Math.floor(Math.random() * endPoints.length)];

    } else {
      startPoints = range(room.topLeft.x, room.bottomRight.x);
      point.x = startPoints[Math.floor(Math.random() * startPoints.length)];
      endPoints = range(randomRoom.topLeft.y, randomRoom.bottomRight.y);
      endAxis = endPoints[Math.floor(Math.random() * endPoints.length)];
    }
  }
  mergeNodes(room, randomRoom); //This shouldn't be here, it should happen after the rooms are connected;

  return { point, direction, parallel,
    initialDirection, endAxis,
    destination: randomRoom};
}

function mergeNodes(room1, room2){
  if(room1.node !== room2.node){
    let oldNode = room2.node;
    for(let i = 0; i < nodeList[oldNode].length; i++){
      nodeList[oldNode][i].node = room1.node;
    }

    nodeList[room1.node] = nodeList[room1.node].concat(nodeList[oldNode]);
    delete nodeList[oldNode];
  }
}

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

function getPathBetweenRooms(array, cols, rows, path){
  let validIndicies = [];
  let unconnected = true;
  let turned = false;
  while(unconnected){
    path.point[path.initialDirection] += path.direction[path.initialDirection];

    if(!path.parallel && path.point[path.initialDirection] === path.endAxis && !turned){
      path.initialDirection = path.initialDirection === "x" ? "y" : "x"; //flip from "x" to "y";
      turned = true;
    }

    let currentIndex = xyToIndex(path.point, cols);
    if(path.point.x > 0 && path.point.y > 0
    && path.point.x < cols && path.point.y < rows){
      validIndicies.push(currentIndex);
      // array[currentIndex] = 5;
      if(isPointInRoom(path.point, path.destination)){
        unconnected = false;
      }

    } else {
    	validIndicies = [];
      break;
    }
  }
  return validIndicies;
}

function isPointInRoom(point, room){
  if (point.x >= room.topLeft.x && point.x <= room.bottomRight.x
    && point.y >= room.topLeft.y && point.y <= room.bottomRight.y) {
    return true;
  }

  return false;
}

function getPointBetween(xy1, xy2) { //inclusive
  return Math.floor(Math.random() * (xy2 - xy1 + 1) + xy1);
}
