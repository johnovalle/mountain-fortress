export let messageLog = {
  messages: [],
  currentStats: {},
  endGame: {},
  startGame: {},
  reset(){
    this.messages = ["The egg of the black dragon who killed your father's family has hatched",
    "Deep at the bottom of a mountain fortress the hatchling gathers power",
    "Venture forth and kill the black dragon welp before it's too late!"];
    this.currentStats = {};
    this.endGame = {messages: [
      {text: "Game Over", size: 40, x:200, y:150},
      {text: "Hit Enter", size: 24, x:250, y:600}
    ]};
    this.startGame = {messages: [
      {text: "Welcome to Black Dragon 2: Dragon Spawn", size: 24, x:120, y:680},
      {text: "Hit Enter to start", size: 24, x:220, y:710},
      {text: "Control using the number pad or key Q-C, M to toggle music", size: 24, x: 55, y: 740}
    ]};
  }
};

messageLog.reset();
