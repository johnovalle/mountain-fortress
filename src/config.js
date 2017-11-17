export default {
  canvasHeight: 288,
  canvasWidth: 288,
  moveAniSpeed: 4,
  tileSize: 32,
  mapCols: 0,
  mapRows: 0,
  rowsToShow: 4, //There should probably also be a colsToShow in cause I want to display a non-square play area
  maxOffsetX: 0,
  maxOffsetY: 0,
  setMaxOffsetX(){
    this.maxOffsetX = this.mapCols - 1 - this.rowsToShow;
  },
  setMaxOffsetY(){
    this.maxOffsetY = this.mapRows - 1 - this.rowsToShow;
  }
};
