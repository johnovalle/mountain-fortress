let mapCols = 27;
let mapRows = 27;
let rawArray = Array(mapCols * mapRows).fill(0);
// currently drawing the rooms in but actually I think it makes more sense to carve them by setting the fill to 1;
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
  for(let i = 0; i <= roomWidth; i++){
    let topIndex = i + roomStart;
    let bottomIndex =  topIndex + (roomHeight * cols);
    if(array[topIndex] === 0 && array[bottomIndex] === 0){
      validIndicies.push(topIndex);
      validIndicies.push(bottomIndex);
    } else {
      success = false;
      break;
    }

  }
  for(let i = 1; i < roomHeight; i++){
    let leftIndex = (i * cols) + roomStart;
    let rightIndex =  leftIndex + roomWidth; //roomEnd  + (i * cols);

    if(array[leftIndex] === 0 && array[rightIndex] === 0){
      validIndicies.push(leftIndex);
      validIndicies.push(rightIndex);
    } else {
      success = false;
      break;
    }

  }
  if (success) {
    for(let i = 0; i < validIndicies.length; i++){
      array[validIndicies[i]] = 1;
    }
    return {topLeft: roomStart, bottomRight: roomStart + (roomHeight * 27) + roomWidth};
  }else{
    return false;
  }
}


const indexToXY = (index, cols) => { // duplicate refactor
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
    console.log(index, coords);
    if(coords.x + roomWidth < cols && coords.y + roomHeight < rows && array[index] === 0){
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
