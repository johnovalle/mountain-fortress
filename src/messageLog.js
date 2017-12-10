export let messageLog = {
  messages: ["The egg of the black dragon who killed your father's family has hatched",
  "Deep at the bottom of a mountain fortress the hatchling gathers power",
  "Venture forth and kill the black dragon welp before it's too late!"],
  currentStats: {},
  endGame: {},
  startGame: {},
  reset(){
    this.messages = ["The egg of the black dragon who killed your father's family has hatched",
    "Deep at the bottom of a mountain fortress the hatchling gathers power",
    "Venture forth and kill the black dragon welp before it's too late!"];
    this.currentStats = {};
    this.endGame = {};
    this.startGame = {};
  }
};
