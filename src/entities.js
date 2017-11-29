import Config from "./config";
import { tileDictionary } from "./tiles";
const Entity = {
  x: 0,
  y: 0,
  type: null
};

let idCounter = 1;

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

const buildEntity = (level, key, index) => { //lets assume the index is clear and not check here
  let entity = Object.assign({}, Entity, {key, index});
  entity.id = idCounter;
  entity.type = tileDictionary[entity.key].type;

  idCounter++;
  level.entitiesMap[index] = entity.key;
  level.entities.push(entity);

  return entity;
};

export const buildStairs = (level, key, index, targetLevel, targetIndex) => {
  let stairs = buildEntity(level, key, index);
  stairs.targetLevel = targetLevel;
  // stairs.targetIndex = targetIndex; //set targetIndex on first use of stairs
  return stairs;
};
