export let spritesheet = {
  sheet: new Image()
}


export const loadSpritesheet = (source, tileSize, sheetSize, callback) => {
  spritesheet.sheet.src = source;
  spritesheet.tileSize = tileSize;
  spritesheet.sheetSize = sheetSize;
  spritesheet.sheetCols = sheetSize / tileSize;
  spritesheet.sheet.onload = () => {
    callback();
  };
}
