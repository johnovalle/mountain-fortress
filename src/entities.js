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
  for(let i = 0; i < level.entities.length; i++) {

    let entity = level.entities[i];
    console.log(entity);
    level.entitiesMap.grid[entity.index] = entity.key;
  }
};

const buildEntity = (level, key, location) => { //lets assume the index is clear and not check here
  let entity = Object.assign({}, Entity, { key, index: location.index, x: location.x * Config.tileSize, y: location.y * Config.tileSize });
  entity.nextX = entity.x;
  entity.nextY = entity.y;
  entity.id = idCounter;
  entity.type = tileDictionary[entity.key].type;

  idCounter++;
  level.entitiesMap[entity.index] = entity.key;
  level.entities.push(entity);

  return entity;
};

export const buildStairs = (level, key, location, targetLevel = null, targetIndex = null) => {
  let stairs = buildEntity(level, key, location);
  stairs.targetLevel = targetLevel;
  stairs.targetIndex = targetIndex;
  return stairs;
};

export const buildPlayer = (level, key, location) => {
  let player = buildEntity(level, key, location);
  player.name = "player";
  player.hp = 10;
  player.maxHp = 10;
  player.xp = 0;
  player.level = 1;
  player.damageModifier = 1;
  player.weapon = {name: "hand", damage: [1,4], verb: "punch", subtype: "weapon"}
  player.armor = {name: "cloth", protection: 0}
  return player;
};

export const removeEntityFromLevel = (level, entity) => {
  level.entitiesMap[entity.index] = 0;
  let index;
  for(let i = 0; i < level.entities.length; i++){
    let e = level.entities[i];
    if(e.id === entity.id){
      index = i;
      break;
    }
  }
  level.entities.splice(index,1);
};

export const getEntityAtIndex = (level, index) => {
  for(let i = 0; i < level.entities.length; i++){
    let entity = level.entities[i];
    if(entity.index === index){
      return entity;
    }
  }
  return null;
};
