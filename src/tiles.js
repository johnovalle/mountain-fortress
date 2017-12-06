export const tileDictionary = {
  0: {passible: true, type: "floor"},
  1: {passible: true, type: "floor"},
  2: {passible: true, type: "floor"},
  3: {passible: false, type: "wall"},
  4: {passible: false, type: "wall"},
  5: {passible: false, type: "player"},
  6: {passible: true, type: "stairs", subtype: "stairs down"},
  7: {passible: true, type: "stairs", subtype: "stairs up"},
  8: {passible: false, type: "monster"},
  9: {passible: false, type: "monster"},
  10: {passible: false, type: "monster"},
  11: {passible: false, type: "monster"},
  12: {passible: false, type: "monster"},
  13: {passible: false, type: "monster"},
  14: {passible: false, type: "monster"},
  15: {passible: false, type: "monster"},
};

export const monsterDictionary = {
  8: { name:"giant rat", subtype:"animal", hp: [1,3], weapon: { damage: [1,2], verb: "bites" }, xpVal: 50, damageModifier: 0, armor: { protection: 0 }, threat: 1 },
  9: { name:"green slime", subtype:"ooze", hp: [1,4], weapon: { damage: [1,3], verb: "splashes" }, xpVal: 75, damageModifier: 0, armor: { protection: 0 }, threat: 1 },
  10: { name:"wild dog", subtype:"animal", hp: [1,6], weapon: { damage: [1,6], verb: "bites" }, xpVal: 80, damageModifier: 0, armor: { protection: 0 }, threat: 2 },
  11: { name:"goblin", subtype:"goblin", hp: [1,6], weapon: { damage: [1,6], verb: "claws" }, xpVal: 120, damageModifier: 0, armor: { protection: 1 }, threat: 3 },
  12: { name:"kobld", subtype:"goblin", hp: [2,4], weapon: { damage: [1,6], verb: "stabs" }, xpVal: 150, damageModifier: 1, armor: { protection: 0 }, threat: 4 },
  13: { name:"orc", subtype:"goblin", hp: [2,6], weapon: { damage: [1,6], verb: "smacks" }, xpVal: 175, damageModifier: 1, armor: { protection: 1 }, threat: 5 },
  14: { name:"skeleton", subtype:"undead", hp: [2,8], weapon: { damage: [1,8], verb: "slashes" }, xpVal: 250, damageModifier: 2, armor: { protection: 1 }, threat: 6 },
  15: { name:"black dragon", subtype:"dragon", hp: [3,10], weapon: { damage: [1,10], verb: "bashes" }, xpVal: 450, damageModifier: 4, armor: { protection: 4 }, threat: Infinity }
};
