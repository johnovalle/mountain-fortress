export const rollDice = (diceToRoll, numOfSides) => {
  let total = 0;
  for(let i = 0; i<diceToRoll; i++){
    total += Math.ceil(Math.random()*numOfSides);
  }
  return total;
};

export const fullDice = (diceToRoll, numOfSides) => {
  return diceToRoll * numOfSides;
}

export const firstDieFull = (diceToRoll, numOfSides) => {
  return fullDice(1, numOfSides) + rollDice(diceToRoll-1, numOfSides);
}

// break this into two files dice and true ultities
export const getRandomArrayIndex = (array) => { //formerly: getRandomInArray
  return Math.floor(Math.random() * array.length);
}
export const getRandomInArray = (array) => {
  return array[getRandomArrayIndex(array)];
}

export const getNumInRange = (low, high) => { //inclusive //formerly: getPointBetween
  return Math.floor(Math.random() * (high - low + 1) + low);
}
