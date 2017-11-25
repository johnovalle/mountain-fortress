let mapCols = 27;
let mapRows = 27;
let rawArray = Array(mapCols * mapRows).fill(1);
let generatedRooms = [];

let room1 = { topLeft: { x: 18, y: 13 },
    bottomRight: { x: 23, y: 17 },
    id: 0 };
let room2 = { topLeft: { x: 6, y: 15 },
    bottomRight: { x: 9, y: 19 },
    id: 1 };
let room3 = { topLeft: { x: 3, y: 5 },
    bottomRight: { x: 6, y: 10 },
    id: 2 };

function populateMap(array, cols, rows) {
  let roomsGenerated = 0;
  let tries = 0;
  // while ((roomsGenerated < 7 && tries < 300) || tries > 300) {
  //   tries++;
  //   let room = generateRoom(array, cols, rows);
  //   if (room) {
  //     room.id = roomsGenerated;
  //     generatedRooms[roomsGenerated] = room;
  //     roomsGenerated++;
  //     console.log(generatedRooms);
  //   }
  // }
  //connectRooms(array, cols, rows, generatedRooms);
  drawRoom(array, cols, room1);
  // drawRoom(array, cols, room2);
  drawRoom(array, cols, room3);
  generatedRooms.push( room1, room3);
  connectRooms(array, cols, rows, generatedRooms);
}

function drawRoom(array, cols, room){
  for(let i = room.topLeft.x; i <= room.bottomRight.x; i++) {
    for(let j = room.topLeft.y; j <= room.bottomRight.y; j++) {
      array[i + (j * cols)] = 0;
    }
  }
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
    return {topLeft: indexToXY(roomStart, cols), bottomRight: indexToXY(lastIndex, cols), connected: false};
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
    if (
      coords.x + roomWidth < cols - 1 &&
      coords.y + roomHeight < rows - 1 &&
      coords.x > 0 &&
      coords.y > 0
    ) {
      //console.log(index, coords);
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
    //let path = getPointOnSide(room);
  	//array[xyToIndex(path.point, cols)] = 5;
    // while (!pathFound) {
    //   console.log(tries);



    draw(array);
    let path = connectRoomToRoom(room, rooms.filter((x)=> x.id !== room.id));
    validIndicies = getPathBetweenRooms(array, cols, rows, path);
      // if(validIndicies.length > 0){
      //   pathFound = true;
      // }
      // intelligent?
      //let path = findPath(room, rooms);
    //  tries++;
    //}
    for (let i = 0; i < validIndicies.length; i++) {
      array[validIndicies[i]] = 7;
    }
    draw(array);
  }
}

function connectRoomToRoom(room, rooms){
  let randomRoom = rooms[Math.floor(Math.random() * rooms.length)];

  //get side
  //let side;
  let direction = {x: 0, y: 0};
  let point = {};
  let parallel = true;
  let perpendicularAxes = {};
  let initialDirection;
  let endAxis;
  if (randomRoom.topLeft.x > room.bottomRight.x) {
    //side = "right";
    direction.x = 1;
    point.x = room.bottomRight.x;
  } else if (randomRoom.bottomRight.x < room.topLeft.x) {
    //side = "left";
    direction.x = -1;
    point.x = room.topLeft.x;
  }

  if (randomRoom.topLeft.y > room.bottomRight.y) {
    // below
    direction.y = 1;
    point.y = room.bottomRight.y;
  } else if (randomRoom.bottomRight.y < room.topLeft.y) {
    // above
    direction.y = -1;
    point.y = room.topLeft.y;
  }

  //parallel on x axis
  let parallelAxes = [];

   //check es6
  if((direction.x === -1 || direction.x === 1) && direction.y === 0) {
    parallelAxes = range(Math.max(room.topLeft.y, randomRoom.topLeft.y),
                            Math.min(room.bottomRight.y, randomRoom.bottomRight.y));
    console.log(parallelAxes);
    point.y = parallelAxes[Math.floor(Math.random()*parallelAxes.length)];
  } //parallel on y axis
  else if((direction.y === -1 || direction.y === 1) && direction.x === 0) {
    parallelAxes = range(Math.max(room.topLeft.x, randomRoom.topLeft.x),
                            Math.min(room.bottomRight.x, randomRoom.bottomRight.x));
    console.log(parallelAxes);
    point.x = parallelAxes[Math.floor(Math.random()*parallelAxes.length)];
  } else {
    let startPoints = [];
    let endPoints = [];
    console.log(" not parallel");
    parallel = false;
    perpendicularAxes.x = range(randomRoom.topLeft.x, randomRoom.bottomRight.x);
    perpendicularAxes.y = range(randomRoom.topLeft.y, randomRoom.bottomRight.y);
    initialDirection = Math.random() < 0.5 ? "x" : "y";
    if(initialDirection === "x"){
      startPoints = range(room.topLeft.x, room.bottomRight.x);
      point.x = startPoints[Math.floor(Math.random() * startPoints.length)];
      endPoints = range(randomRoom.topLeft.x, randomRoom.bottomRight.x);
      endAxis = endPoints[Math.floor(Math.random() * endPoints.length)];
    } else {
      startPoints = range(room.topLeft.y, room.bottomRight.y);
      point.y = startPoints[Math.floor(Math.random() * startPoints.length)];
      endPoints = range(randomRoom.topLeft.y, randomRoom.bottomRight.y);
      endAxis = endPoints[Math.floor(Math.random() * endPoints.length)];
    }
  }

  console.log(room, rooms, randomRoom);
  console.log(direction);

  return { point, direction, parallel,
    perpendicularAxes, initialDirection, endAxis};

}

function range(start, end) {
  console.log(start, end);
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

function getPointOnSide(room){
  let side = Math.random();
  let point;
  let direction;
  if (side < 0.25) {
    //top
    point = {
      x: getPointBetween(room.topLeft.x, room.bottomRight.x),
      y: room.topLeft.y
    };
    direction = { x: 0, y: -1 };
  } else if (side < 0.5) {
    //bottom
    point = {
      x: getPointBetween(room.topLeft.x, room.bottomRight.x),
      y: room.bottomRight.y
    };
    direction = { x: 0, y: 1 };
  } else if (side < 0.75) {
    //left
    point = {
      x: room.topLeft.x,
      y: getPointBetween(room.topLeft.y, room.bottomRight.y)
    };
    direction = { x: -1, y: 0 };
  } else {
    //right
    point = {
      x: room.bottomRight.x,
      y: getPointBetween(room.topLeft.y, room.bottomRight.y)
    };
    direction = { x: 1, y: 0 };
  }
  return {point, direction};
}

function getPathBetweenRooms(array, cols, rows, path){
  validIndicies = [];
      // brute force
  let chanceToBend = 0.1;
  let unconnected = true;
  let testIndex = xyToIndex(path.point, cols);
  array[testIndex] = 5;
  console.log(path);
  if(path.parallel){
    while(unconnected){

      path.point.x += path.direction.x;
      path.point.y += path.direction.y;
      let currentIndex = xyToIndex(path.point, cols);
      if(path.point.x > 0 && path.point.y > 0
      && path.point.x < cols && path.point.y < rows){
        if(array[currentIndex] === 1){
          validIndicies.push(currentIndex);
          array[currentIndex] = 5;
          draw(array);
          debugger;
        }else if(array[currentIndex] === 0){
        	console.log("ran into a zero should end");
          unconnected = false;
        }
        chanceToBend += 0.1;

      }else{
        for(let i = 0; i < validIndicies.length; i++){
          array[validIndicies[i]] = 1;
        }
        draw(array);
      	validIndicies = [];
        break;
      }
    }
  } else {
    let turned = false;
    while(unconnected){
      path.point[path.initialDirection] += path.direction[path.initialDirection];
      let currentIndex = xyToIndex(path.point, cols);
      if(path.point[path.initialDirection] === path.endAxis && !turned){
        path.initialDirection = path.initialDirection === "x" ? "y" : "x"; //flip from "x" to "y";
        turned = true;
      }
      if(path.point.x > 0 && path.point.y > 0
      && path.point.x < cols && path.point.y < rows){ //This should never fail now, so it necessary?
        if(array[currentIndex] === 1){
          validIndicies.push(currentIndex);
          array[currentIndex] = 5;
          draw(array);
          debugger;
        }else if(array[currentIndex] === 0){
        	console.log("ran into a zero should end");
          unconnected = false;
        }
      } else {
        for(let i = 0; i < validIndicies.length; i++){
          array[validIndicies[i]] = 1;
        }
        draw(array);
      	validIndicies = [];
        break;
      }
    }
  }

  return validIndicies;
}

function getPointBetween(xy1, xy2) { //inclusive
  return Math.floor(Math.random() * (xy2 - xy1 + 1) + xy1);
}

function Convert1dTo2d(array, cols) {
  let nested = [[]];
  let curRow = 0; // -1 for real
  for (let i = 0; i < array.length; i++) {
    if (i % cols === 0 || i === 0) {
      curRow++;
      nested[curRow] = [];
    }
    nested[curRow].push(array[i]);
  }
  return nested;
}
populateMap(rawArray, mapCols, mapRows);

// bundling this because I don't want to mix this testing code
function draw(map){
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const colorMap = {
    0: "blue",
    1: "yellow",
    2: "green",
    3: "red",
    4: "pink",
    5: "violet",
    6: "orange",
    7: "purple",
    8: "cyan"
  };

  ctx.clearRect(0,0, 864, 864);
  ctx.font = "8px Arial";
  for(var i = 0; i < map.length; i++){
    let tileCords = indexToXY(i, mapCols);
    ctx.fillStyle = colorMap[map[i]];
    ctx.fillRect(tileCords.x * 32, tileCords.y * 32, 32, 32);
    ctx.fillStyle = "black";
    ctx.fillText(i,(tileCords.x * 32) + 5, (tileCords.y * 32) + 15);
  }
};

//console.log(Convert1dTo2d(rawArray, mapCols));
