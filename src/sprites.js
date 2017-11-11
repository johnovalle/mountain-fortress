export let spritesheet = {
  sheet: new Image()
}


//takes a call back so run can be excuted from main
export const loadSpritesheet = (source, tileSize, sheetSize, callback) => {
  spritesheet.sheet.src = source;
  spritesheet.tileSize = tileSize;
  spritesheet.sheetSize = sheetSize;
  spritesheet.sheetCols = sheetSize / tileSize;
  spritesheet.sheet.onload = () => {
    //run();
    callback();
  };
}
