import Config from "./config";

export const buildEntityMap = (level) => {
  level.entitiesMap = {};
  level.entitiesMap.grid = Array(Config.mapCols * Config.mapRows).fill(0);
  level.entitiesMap.mapCols = Config.mapCols;
  level.entitiesMap.mapRows = Config.mapRows;
  console.log(level.entities);
  for(let i = 0; i < level.entities.length; i++) {

    let entity = level.entities[i];
    console.log(entity);
    level.entitiesMap.grid[entity.index] = entity.key;
  }
};
