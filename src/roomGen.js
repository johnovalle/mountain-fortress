let mapCols = 27;
let mapRows = 27;
let rawArray = Array(mapCols * mapRows).fill(0);

function generateRoom(array, cols, rows){
  let minWidth = 3;
  let minHeight = 3;
  let maxWidth = Math.ceil(cols / 5);
  let maxHeight = Math.ceil(rows / 5);
  let roomWidth = Math.ceil(Math.random() * maxWidth) + minWidth;
  let roomHeight = Math.ceil(Math.random() * maxHeight) + minHeight;
  console.log(roomWidth, roomHeight);

  let roomStart = getRoomStart(array, cols, rows, roomWidth, roomHeight);;
  let roomEnd = roomStart + roomWidth;
  for(let i = 0; i <= roomWidth; i++){
    let topIndex = i + roomStart;
    array[topIndex] = 1;
    let bottomIndex =  topIndex + (roomHeight * cols);
    array[bottomIndex] = 1;
  }
  for(let i = 1; i < roomHeight; i++){
    let leftIndex = (i * cols) + roomStart;
    array[leftIndex] = 1;
    let rightIndex =  leftIndex + roomWidth; //roomEnd  + (i * cols);
    array[rightIndex] = 1;
  }
  // getRoomStart();
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
    if(coords.x + roomWidth < cols && coords.y + roomHeight < rows){
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
