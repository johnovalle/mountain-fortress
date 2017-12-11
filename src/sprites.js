export let spritesheet = {
  sheet: new Image(),
  start: new Image(),
  end: new Image(),
  itemsToLoad: 0,
  itemsLoaded: 0,
  finishedLoading() {
    console.log("finishedLoading called")
    if(this.itemsToLoad === this.itemsLoaded) {
      console.log("loadeding done", this.callbacks)
      for(let i = 0; i < this.callbacks.length; i++){
        this.callbacks[i]();
      }
    }
  },
  callbacks: [],
  reset() {
    this.itemsToLoad = 0;
    this.itemsLoaded = 0;
    this.callbacks = [];
    this.sheet = new Image(),
    this.start = new Image(),
    this.end = new Image()
  }
}


export const loadSpritesheet = (source, tileSize, sheetSize, callback) => {
  spritesheet.sheet.src = source;
  spritesheet.tileSize = tileSize;
  spritesheet.sheetSize = sheetSize;
  spritesheet.sheetCols = sheetSize / tileSize;
  spritesheet.itemsToLoad++;
  if(callback){
    spritesheet.callbacks.push(callback);
  }
  spritesheet.sheet.onload = () => {
    //callback();
    spritesheet.itemsLoaded++;
    spritesheet.finishedLoading();
  };
}

export const loadImage = (source, target, callback) => { //merge these two
  spritesheet[target].src = source;
  spritesheet.itemsToLoad++;
  if(callback){
    spritesheet.callbacks.push(callback);
  }
  spritesheet[target].onload = () => {
    //callback();
    spritesheet.itemsLoaded++;
    spritesheet.finishedLoading();
  };
}
