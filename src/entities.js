import Config from "./config";

export const buildEntityMap = (level) => {
  level.entitiesMap = {};
  level.entitiesMap.grid = Array(Config.currentLevel.mapCols * Config.currentLevel.mapRows).fill(0);
  level.entitiesMap.mapCols = Config.currentLevel.mapCols;
  level.entitiesMap.mapRows = Config.currentLevel.mapRows;
  console.log(level.entities);
  for(let i = 0; i < level.entities.length; i++) {

    let entity = level.entities[i];
    console.log(entity);
    level.entitiesMap.grid[entity.index] = entity.key;
  }
};
