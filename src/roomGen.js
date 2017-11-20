let mapCols = 27;
let mapRows = 27;
let rawArray = Array(mapCols * mapRows).fill(1);

function populateMap(array, cols, rows){
  let roomsGenerated = 0;
  let tries = 0;
  while((roomsGenerated < 7 && tries < 200) || tries > 200){
    tries++;
    let room = generateRoom(array, cols, rows);
    if(room){
      generatedRooms[roomsGenerated] = room;
      roomsGenerated++;
    }
  }
}
let generatedRooms = {

}

function generateRoom(array, cols, rows){
  var minWidth = 3;
  var minHeight = 3;
  var maxWidth = Math.ceil(cols / 5);
  var maxHeight = Math.ceil(rows / 5);
  var roomWidth = Math.ceil(Math.random() * maxWidth) + minWidth;
  var roomHeight = Math.ceil(Math.random() * maxHeight) + minHeight;

  var roomStart = getRoomStart(array, cols, rows, roomWidth, roomHeight);
  var roomEnd = roomStart + roomWidth;
  let success = true;
  let validIndicies = [];
  let lastIndex;
  for(let i = 0; i < roomWidth; i++){
    for(let j = 0; j < roomHeight; j++){
      let index = roomStart + i + (j * cols);
      if(array[index] === 1) {
        if(i === 0 && array[index-1] !== 1) { //left row down touching
          success = false;
          break;
        } else if (i === roomWidth - 1 && array[index+1] !== 1) { //right row down touching
          success = false;
          break;
        }  else if (j === 0 && array[(index - cols)] !== 1) { //top row touching
          success = false;
          break;
        }  else if (j === roomHeight - 1 && array[(index + cols)] !== 1) { //bottom row touching
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
    return {topLeft: roomStart, bottomRight: lastIndex};
  }else{
    return false;
  }
}

const indexToXY = (index, cols) => {
  let x = index % cols;
  let y = Math.floor(index / cols);
  return {x, y};
};

function getRoomStart(array, cols, rows, roomWidth, roomHeight){
  let start = null;
  let foundStart = false;
  let tries = 0;
  while(!foundStart) {
    let index = Math.floor(Math.random() * array.length);
    let coords = indexToXY(index, cols);

    // makes sure room doesn't start or end on map edge
    if(coords.x + roomWidth < cols - 1 && coords.y + roomHeight < rows - 1 && coords.x > 0 && coords.y > 0){
      console.log(index, coords);
      foundStart = true;
      start = index;
    }
    tries++;
    if(tries > 20){
      foundStart = true; // or break?
    }
  }
  return start;
}
