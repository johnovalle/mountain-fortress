import * as Canvas from "./canvas";
import Model from "./model";
import Dispatcher from "./dispatcher";
import ControllerMaps from "./controllerMaps";
import { loadSpritesheet, loadImage } from "./sprites";
import { draw } from "./draw";
import { getRandomAvailable } from "./roomGen";
import Config from "./config";
import * as MapUtil from "./map-util";
import * as Entity from './entities';
import { map1 } from './maps';
import { rollDice } from './utility';
import { messageLog } from './messageLog';
import { addSong } from './audio';

var animationCounter = 0;

const animateEntityMovement = (state) => {
  if(state.playerMoved){
      state.playerMoved = false;
  }

  for(let i = 0; i < state.currentScene.currentLevel.entities.length; i++){
      let entity = state.currentScene.currentLevel.entities[i];
      let moveX, moveY;
      if(entity.x != entity.nextX){
          if(entity.x < entity.nextX) {
            entity.x += Config.moveAniSpeed;
            moveX = Config.moveAniSpeed;
          } else {
            entity.x -= Config.moveAniSpeed;
            moveX = -Config.moveAniSpeed;
          }
      }

      if(entity.y != entity.nextY){
        if(entity.y < entity.nextY) {
          entity.y += Config.moveAniSpeed;
          moveY = Config.moveAniSpeed;
        } else {
          entity.y -= Config.moveAniSpeed;
          moveY = -Config.moveAniSpeed;
        }
      }
      if(entity.name === 'player') {
        Dispatcher.sendMessage({action: "Update Camera", payload: [moveX, moveY]});
      }
  }
  animationCounter += Config.moveAniSpeed;
  if(animationCounter === Config.tileSize){
      animationCounter = 0;
      state.lastMoveFinished = true;
  }
}

const playerXpTable = { //this should be computed using a config value
  1: 200,
  2: 400,
  3: 800,
  4: 1600,
  5: 3200,
  6: 6400,
  7: 12800,
  8: 25600,
  9: 51200,
  10: 102400
};
let titleTheme = addSong('title.mp3');
let dungeonTheme = addSong('crawl.mp3', true);

export const Game = {
  state: Model.state,
  loadGame(){
    loadImage("blackdragonCover1.png", "start");
    loadSpritesheet("mountain-fortress-e.png", 64, 512, () => {
      this.run();
    });
    //These need to be bundled in an asset loader

  },
  gameTick: 0, //total elapsed turns
  lastTick: 0,
  musicEnabled: true, //this should be in model
  currentTrack: null,
  toggleMusic(){
    this.musicEnabled = !this.musicEnabled;
    if(this.musicEnabled) {
      this.currentTrack.play();
    }else {
      this.currentTrack.pause();
    }
  },
  start(){
    Canvas.attachCanvas(document.body); //should only do this the first time
    this.lastTick = 0;
    this.gameTick = 0;


    Model.addScene("start", ()=> { console.log("enter start scene");
      this.currentTrack = titleTheme;
      if (this.musicEnabled) {
        this.currentTrack.play();
      }
    }, ControllerMaps.start );
    Model.addScene("gameOver", ()=> { console.log("enter game over scene");
      Model.state.playerMoved = false;
      Model.state.lastMoveFinished = true;
      Model.restart();
      Entity.reset();
      this.currentTrack.pause();
      this.currentTrack.currenTime = 0;
    }, ControllerMaps.gameOver );
    Model.addScene("play", () => { console.log("enter play scene");
      this.currentTrack.pause();
      this.currentTrack.currenTime = 0;
      this.currentTrack = dungeonTheme;
      if (this.musicEnabled) {
        this.currentTrack.play();
      }
      let level1 = Model.createLevel();
      Model.scenes.play.currentLevel = level1;
      Dispatcher.sendMessage({action: "Change Map", payload: [Model.scenes.play.currentLevel.map]});
      let playerStart = getRandomAvailable(Model.scenes.play.currentLevel.map, Model.scenes.play.currentLevel.entities);
      Model.state.player = Entity.buildPlayer(level1, 5, playerStart); //{index: 28, x: 1, y:1}
      messageLog.reset();
      messageLog.currentStats.hp = Model.state.player.hp;
      messageLog.currentStats.maxHp = Model.state.player.maxHp;
      messageLog.currentStats.playerLevel = Model.state.player.level;
      messageLog.currentStats.weapon = Model.state.player.weapon;
      messageLog.currentStats.armor = Model.state.player.armor;
      messageLog.currentStats.damageModifier = Model.state.player.damageModifier;
      messageLog.currentStats.xp = Model.state.player.xp;

      messageLog.currentStats.nextXp = playerXpTable[Model.state.player.level];
      messageLog.currentStats.dungeonLevel = level1.baseDifficulty;
      //Model.scenes.play.currentLevel.entities.push({name: 'player', index: playerStart.index, x: playerStart.x * 64, y: playerStart.y * 64, key: 5 });
      //Model.state.player = Model.scenes.play.currentLevel.entities[0];
    }, ControllerMaps.play );

    addEventListener("keydown", (event) => {
        Dispatcher.sendMessage({action: "Key Press", payload: [event.key]});
    });
    Model.changeScene("start");
  },
  run() {
    //might make sense to run update on every frame as well
    if(!Model.state.lastMoveFinished){
          this.update(Model.state);
    }
    draw(Model.state);
    requestAnimationFrame(this.run.bind(this));
  },
  update(state) {
    if(this.state.currentScene.currentLevel.tick !== this.lastTick){
      this.lastTick = this.state.currentScene.currentLevel.tick;
      this.moveMonsters();
      if (this.lastTick % Config.generateMonsterTick === 0) {
        //console.log("excuted");
        this.generateMonster();
      }
    }
    if(state.currentScene.name === "play") {
      animateEntityMovement(state);
    }
  },
  movePlayer(key) { //need to make this generic since monsters can move too
    if (!this.state.playerMoved && this.state.lastMoveFinished) {

      //check the new position and return a values
      //if value is empty go there
      //if there is something there handle it (stairs, monster, item);

      let targetAtIndex = MapUtil.checkIndex(this.state.player, key);
      let entitiesAtIndex = Entity.getEntitiesAtIndex(this.state.currentScene.currentLevel, targetAtIndex.index);
      if(targetAtIndex.target.passible){
        this.state.currentScene.currentLevel.tick++;
        this.gameTick++;
        // console.log("tick", this.state.currentScene.currentLevel.tick, this.gameTick);

        this.state.playerMoved = true;
        this.state.lastMoveFinished = false;
        //console.log(this.state.currentScene.currentLevel.entities, entityAtIndex)
        if (entitiesAtIndex.length > 0) { //need to reqrite this block as this will return an array of entities at an index
          let monsterIndex = null;
          let stairIndex = null;
          let itemIndex = null; //there really shouldn't be more than one of each
          for (let i = 0; i < entitiesAtIndex.length; i++) {
            if(entitiesAtIndex[i].type === "stairs") {
              stairIndex = i;
            } else if(entitiesAtIndex[i].type === "monster") {
              monsterIndex = i;
            } else if(entitiesAtIndex[i].type === "item") {
              itemIndex = i;
            }
          }
          if (monsterIndex !== null) {
            this.attackEntity(this.state.player, entitiesAtIndex[monsterIndex], this.state.currentScene.currentLevel);
          } else if (stairIndex !== null) {
            //MapUtil.moveEntity(this.state.player, key);
            this.useStairs(this.state.player, entitiesAtIndex[stairIndex]);
            Dispatcher.sendMessage({action: "Player Moved", payload: [this.state.currentScene]});
          } else if (itemIndex !== null) {
            this.getItem(this.state.player, entitiesAtIndex[itemIndex], this.state.currentScene.currentLevel);
            MapUtil.moveEntity(this.state.player, key);
            Dispatcher.sendMessage({action: "Player Moved", payload: [this.state.currentScene]});
          }
        } else {
          MapUtil.moveEntity(this.state.player, key);
          Dispatcher.sendMessage({action: "Player Moved", payload: [this.state.currentScene]});
        }

      }

    }
  },
  useStairs(entity, stairs) {
    let currentLevel = this.state.currentScene.currentLevel;
    let nextLevel;
    if(stairs.targetLevel === null){
      nextLevel = Model.createLevel(currentLevel, stairs);
    } else {
      nextLevel = Model.levels[stairs.targetLevel];
    }
    //  let nextLevel = model.levels[stairs.target];
    entity.index = stairs.targetIndex;
    // need to add a way to delay this so it can be animated...
    nextLevel.entities.push(entity);
    Object.assign(entity, MapUtil.indexTrueToXY(entity.index)); //check
    entity.nextX = entity.x;
    entity.nextY = entity.y;

    //
    let message = "You go ";
    if(stairs.subtype === "stairs up"){ //there are only two types of stairs
      message += "up the stairs"; //to level?
    } else {
      message += "down the stairs";
    }
    messageLog.messages.push(message);
    messageLog.currentStats.dungeonLevel = nextLevel.baseDifficulty;
    this.goToLevel(stairs.targetLevel);
    Entity.removeEntityFromLevel(currentLevel, entity);

    Dispatcher.sendMessage({action: "Fade-out-in", payload: [true]});
  },
  goToLevel(level) {
    this.state.currentScene.currentLevel = Model.levels[level];
    Entity.buildEntityMap(this.state.currentScene.currentLevel);
    //console.log(Model);
    Dispatcher.sendMessage({action: "Change Map", payload: [this.state.currentScene.currentLevel.map]});
    Dispatcher.sendMessage({action: "Player Moved", payload: [this.state.currentScene]});
    //model.scenes.play.level.entitiesMap = model.entitiesMaps[level];
  },
  attackEntity(attacker, defender, level) {
    let damage, verb, aIdentity, dIdentiy, posAdj; //maybe simplify this by giving all monsters a weapon?

    //if(attacker.weapon){
    damage = rollDice(...attacker.weapon.damage);
    damage += attacker.damageModifier;
    verb = attacker.weapon.verb;
    // } else {
    //   damage = rollDice(...attacker.damage);
    //   damage += attacker.damageModifier;
    //   verb = "hits";
    // }
    if(damage > defender.armor.protection){
      defender.hp -= damage - defender.armor.protection;
    } else {
      damage = 0;
    }


    if(attacker.type === "player"){
      aIdentity = "You";
      dIdentiy = "the " + defender.name;
      posAdj = "their";
    }else{
      aIdentity = "The " + attacker.name;
      dIdentiy = "you";
      posAdj = "your";
    }

    let message = `${aIdentity} ${verb} ${dIdentiy}`; //` for ${damage} bringing ${posAdj} hp to ${defender.hp}`;
    //console.log(`${aIdentity} ${verb} ${dIdentiy} for ${damage} bringing ${posAdj} hp to ${defender.hp}`);
    messageLog.messages.push(message);
    if(defender.type === "player"){
      messageLog.currentStats.hp = defender.hp;
    }
    if(defender.hp <= 0){
      if(defender.name === "black dragon") {
        messageLog.endGame.messages.push({
          text: `You have killed the black dragon spawn`,
           size: 24, x:125, y: 300});
        messageLog.endGame.messages.push({
          text: `saving the world for a generation!`,
          size: 24, x:145, y: 330});
        Model.changeScene("gameOver");
      }

        Entity.removeEntityFromLevel(level, defender);
        if(attacker.type === "player"){
          attacker.xp += defender.xpVal;
          messageLog.currentStats.xp = attacker.xp;
          //check if player leveled
          this.checkPlayerLevel();
        }
      //}
    }
  },
  moveMonsters() { //randomly
    let entities = this.state.currentScene.currentLevel.entities;
    entities = entities.filter(entity => entity.type === 'monster');
    let direction;
    for(let i = 0; i < entities.length; i++) { // TODO do this only for monsters in viewport
      let currentCoords = MapUtil.indexToXY(entities[i].index);
      let sightPoints = MapUtil.getAllPoints(currentCoords, 5);
      let sightIndices = sightPoints.filter((p) => {
        p.index = MapUtil.xyToIndex(p); //these should contain their index?
        return p.index === Model.state.player.index;
      });
      if(sightIndices.length > 0) {
        //console.log("can see the player");
        direction = MapUtil.getDirectionTowardsPoint(this.state.currentScene.currentLevel, currentCoords, sightIndices[0]);
        //console.log(`direction chosen towards player is:`, direction);
        direction = direction || MapUtil.getValidDirection(this.state.currentScene.currentLevel, entities[i]); //This is a cheat
        //if monster can't pass through wall or two monsters want to occupy the same place in the direction on the player
        //really need a weigthed system so if it's first choice isn't available it'll choose something else
        //but without diagonal movement this isnt really possible.
      } else {
        direction = MapUtil.getValidDirection(this.state.currentScene.currentLevel, entities[i]);
      }
      if (direction) {  //direction check is needed in case monster is surrounded by monsters and cannot move
        if (direction.entities.length > 0) {
          let playerIndex = null
          for(let i = 0; i < direction.entities.length; i++) {
            if(direction.entities[i].name === "player"){
              playerIndex = i;
            }
          }
          //attack player
          if(playerIndex !== null) {
            this.attackEntity(entities[i], this.state.player, this.state.currentScene.currentLevel);
            if(this.state.player.hp <= 0){
              //add fadeout here as well
              messageLog.endGame.messages.push({
                text: `You were killed by a ${entities[i].name} on level ${this.state.currentScene.currentLevel.baseDifficulty}`,
                 size: 24, x:120, y: 300})
              Model.changeScene("gameOver");
              break;
            }
          } else {
            MapUtil.moveEntity(entities[i], direction.key);
          }
        } else {
          MapUtil.moveEntity(entities[i], direction.key);
        }
      }

    }
  },
  checkPlayerLevel() { //in a more robust version monsters could also level but I'll keep this simple
    let player = Model.state.player;
    //console.log(player.xp, playerXpTable[player.level]);
    if(player.xp >= playerXpTable[player.level]){
      player.level++;
      player.maxHp += 10;
      player.hp += 10; //we'll assume the player got a full roll, if too hard player.hp = player.maxHp
      player.xp = player.xp - playerXpTable[player.level-1];
      player.damageModifier++;

      messageLog.messages.push(`Nice work! You leveled up! You are level ${player.level}`);
      messageLog.messages.push("You gained 10 hit points and 1 point of damage!");
      messageLog.currentStats.xp = player.xp;
      messageLog.currentStats.hp = player.hp;
      messageLog.currentStats.maxHp = player.maxHp;
      messageLog.currentStats.playerLevel = player.level;
      messageLog.currentStats.nextXp = playerXpTable[player.level];
      //console.log(`player leveled to ${player.level}, hp: ${player.hp}`);
    }
  },
  getItem(entity, item, level) {
    let message;
    let itemProps = item.itemProps;
    if(itemProps.subtype === "weapon" && entity.weapon.threat < itemProps.threat){
      entity.weapon = itemProps;
      message = `You found a ${itemProps.name}!`;
      messageLog.currentStats.weapon = itemProps;
    }
    if(itemProps.subtype === "armor" && entity.armor.threat < itemProps.threat){
      entity.armor = itemProps;
      message = `You found ${itemProps.name}!`;
      messageLog.currentStats.armor = itemProps;
    }
    if(itemProps.subtype === "health"){
      entity.hp += itemProps.heals;
      message = `You ${itemProps.verb} a ${itemProps.name}, you heal ${itemProps.heals} points!`; //should probably have a verb too
      messageLog.currentStats.hp = entity.hp;
    }
    if(message){
      messageLog.messages.push(message);
      //console.log(message);
    }
    Entity.removeEntityFromLevel(level, item);
  },
  generateMonster() {
    let viewport = MapUtil.getIndicesInViewport();
    Entity.generateMonster(this.state.currentScene.currentLevel, viewport);
  }
};
