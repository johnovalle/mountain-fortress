import Config from "./config";
import { tileDictionary, monsterDictionary, itemDictionary } from "./tiles";
import { rollDice, fullDice, firstDieFull, getNumInRange, getRandomInArray } from './utility';
import { getRandomAvailable } from "./roomGen";

const Entity = {
  x: 0,
  y: 0,
  type: null
};

let idCounter = 1;

const generatedItems = [];

export const buildEntityMap = (level) => {
  level.entitiesMap = {};
  level.entitiesMap.grid = Array(Config.mapCols * Config.mapRows).fill(0);
  level.entitiesMap.mapCols = Config.mapCols;
  level.entitiesMap.mapRows = Config.mapRows;
  for(let i = 0; i < level.entities.length; i++) {

    let entity = level.entities[i];
    //console.log(entity);
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
  player.weapon = {name: "hand", damage: [1,4], verb: "punch", subtype: "weapon", threat: 0}
  player.armor = {name: "cloth", protection: 0, threat: 0}
  return player;
};

export const buildMonster = (level, key, index) => {
  let entity = buildEntity(level, key, index);
  let monsterRef = monsterDictionary[entity.key];
  let monster = Object.assign(entity, monsterRef);
  monster.hp = firstDieFull(...monsterRef.hp);
  monster.maxHp = monster.hp;
  return monster;
};

export const buildItem = (level, key, index) => {
  let item = buildEntity(level, key, index);
  item.itemProps = itemDictionary[item.key];
  //add damageModifier to monster table
  console.log(item);
  return item;
};

export const populateLevel = (level) => {
  // level gets a random number of monsters between the min and maxHp
  // should be more for higher levels
  // the monsters on high levels shold be higher level
  // some monsters such as the dragon do not generate
  let numMonsters = getNumInRange(Config.minimumMonsters, Config.maximumMonsters) + Math.floor(level.baseDifficulty / 2);
  let possibleMonsters = getPossibleMonsters(level);
  for(let i = 0; i < numMonsters; i++){

    buildMonster(
      level,
      getRandomInArray(possibleMonsters),
      getRandomAvailable(level.map, level.entities)
    );
  }
  let numItems = Math.floor(numMonsters / 3);
  let possibleItems = getPossibleItems(level);
  for(let i = 0; i < numItems; i++){
    let key = getRandomInArray(possibleItems);
    let item = itemDictionary[key];
    if(item.subtype === "weapon" || item.subtype === "armor") {
      generatedItems.push(key);
      let itemKey = possibleItems.indexOf(key);
      possibleItems.splice(itemKey,1);
    }
    buildItem(
      level,
      key,
      getRandomAvailable(level.map, level.entities)
    );
  }
  // items generated should be numMonsters / 3 (monsters will also drop food sometimes later);
  // no more than one weapon or armor should generate on a level,
  // weapons and armor worse than those that have been generated should not generate.
  // maybe should always generate weapons and armor in order or close to it?
};

export const generateMonster = (level, viewport) => {
  let possibleMonsters = getPossibleMonsters(level);
  let mon = buildMonster(
    level,
    getRandomInArray(possibleMonsters),
    getRandomAvailable(level.map, level.entities, viewport)
  );
  console.log("generated: ", mon);
};

const getPossibleMonsters = (level) => {
  return Object.keys(monsterDictionary).filter((monKey) => {
    let monster = monsterDictionary[monKey];
    return monster.threat <= level.baseDifficulty && monster.threat >= Math.floor(level.baseDifficulty / 2);
  });
}

const getPossibleItems = (level) => {
  return Object.keys(itemDictionary).filter((iKey) => {
    let item = itemDictionary[iKey];
    return item.threat <= level.baseDifficulty 
      && item.threat >= Math.floor(level.baseDifficulty / 2) 
      && generatedItems.indexOf(iKey) === -1;
  });
}

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

export const getEntitiesAtIndex = (level, index) => {
  let entities = [];
  for(let i = 0; i < level.entities.length; i++){
    let entity = level.entities[i];
    if(entity.index === index){
      entities.push(entity);
    }
  }
  return entities;
};
