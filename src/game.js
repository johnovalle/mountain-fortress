import * as Canvas from "./canvas";
import Model from "./model";
import Dispatcher from "./dispatcher";
import ControllerMaps from "./controllerMaps";
import { loadSpritesheet } from "./sprites";
import { draw } from "./draw";
import { getRandomAvailable } from "./roomGen";
import Config from "./config";
import * as MapUtil from "./map-util";
import * as Entity from './entities';
import { map1 } from './maps';
import { rollDice } from './utility';

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

export const Game = {
  state: Model.state,
  loadGame(){
    loadSpritesheet("mountain-fortress.png", 32, 256, () => {
      this.run();
    })
  },
  gameTick: 0, //total elapsed turns
  lastTick: 0,
  start(){
    Canvas.attachCanvas(document.body); //should only do this the first time
    this.lastTick = 0;
    this.gameTick = 0;

    Model.addScene("start", ()=> { console.log("enter start scene"); }, ControllerMaps.start );
    Model.addScene("gameOver", ()=> { console.log("enter game over scene");
      Model.state.playerMoved = false;
      Model.state.lastMoveFinished = true;
    }, ControllerMaps.gameOver );
    Model.addScene("play", () => { console.log("enter play scene");
      let level1 = Model.createLevel();
      Model.scenes.play.currentLevel = level1;
      Dispatcher.sendMessage({action: "Change Map", payload: [Model.scenes.play.currentLevel.map]});
      let playerStart = getRandomAvailable(Model.scenes.play.currentLevel.map, Model.scenes.play.currentLevel.entities);
      Model.state.player = Entity.buildPlayer(level1, 5, playerStart); //{index: 28, x: 1, y:1}
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
      let entityAtIndex = Entity.getEntityAtIndex(this.state.currentScene.currentLevel, targetAtIndex.index);
      if(targetAtIndex.target.passible){
        this.state.currentScene.currentLevel.tick++;
        this.gameTick++;
        // console.log("tick", this.state.currentScene.currentLevel.tick, this.gameTick);

        this.state.playerMoved = true;
        this.state.lastMoveFinished = false;
        //console.log(this.state.currentScene.currentLevel.entities, entityAtIndex)
        if (entityAtIndex) {
          if (entityAtIndex.type === "stairs") {
            this.useStairs(this.state.player, entityAtIndex);
            Dispatcher.sendMessage({action: "Player Moved", payload: [this.state.currentScene]});
          } else if (entityAtIndex.type === "monster") {
            // console.log(entityAtIndex);
            this.attackEntity(this.state.player, entityAtIndex, this.state.currentScene.currentLevel);
            if(entityAtIndex.hp > 0) {
              this.attackEntity(entityAtIndex, this.state.player, this.state.currentScene.currentLevel);
            }
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
    nextLevel.entities.push(entity);
    Object.assign(entity, MapUtil.indexTrueToXY(entity.index)); //check
    entity.nextX = entity.x;
    entity.nextY = entity.y;

    //
    //  let message = "You go ";
    //  if(stairs.type === "stairsUp"){ //there are only two types of stairs
    //    message += "up the stairs"; //to level?
    //  } else {
    //    message += "down the stairs";
    //  }
    //  messageLog.messages.push(message);
    this.goToLevel(stairs.targetLevel);
    Entity.removeEntityFromLevel(currentLevel, entity);
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
      posAdj = "your"
    }

    let message = `${aIdentity} ${verb} ${dIdentiy} for ${damage} bringing ${posAdj} hp to ${defender.hp}`;
    //messageLog.messages.push(message);
    if(defender.hp <= 0){
      if(defender.type === "player" || defender.name === "black dragon") {
        // end the game
        Model.changeScene("gameOver");
      }else {
        Entity.removeEntityFromLevel(level, defender);
        if(attacker.type === "player"){
          attacker.xp += defender.xpVal;
          //check if player leveled
          //checkPlayerLevel(attacker);
        }
      }
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
        console.log("can see the player");
        direction = MapUtil.getDirectionTowardsPoint(this.state.currentScene.currentLevel, currentCoords, sightIndices[0]);
        console.log(`direction chosen towards player is: ${direction}`);
        direction = direction || MapUtil.getValidDirection(this.state.currentScene.currentLevel, entities[i]); //This is a cheat
        //if monster can't pass through wall or two monsters want to occupy the same place in the direction on the player
        //really need a weigthed system so if it's first choice isn't available it'll choose something else
        //but without diagonal movement this isnt really possible.
      } else {
        direction = MapUtil.getValidDirection(this.state.currentScene.currentLevel, entities[i]);
      }
      if (direction) {  //direction check is needed in case monster is surrounded by monsters and cannot move
        if (direction.entity && direction.entity.name === "player") {
          //attack player
        } else {
          MapUtil.moveEntity(entities[i], direction.key);
        }
      }

    }
  },
  generateMonster() {
    let viewport = MapUtil.getIndicesInViewport();
    Entity.generateMonster(this.state.currentScene.currentLevel, viewport);
  }
};
