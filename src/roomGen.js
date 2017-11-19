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

  let roomStart = 28;
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
