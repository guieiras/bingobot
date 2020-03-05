function getAllNumbers(game) {
  return game.drawnNumbers
    .map((draw) => draw.number)
    .sort((a, b) => a - b);
}

function getAllNumbersInOrder(game) {
  return game.drawnNumbers
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((draw) => draw.number);
}

function numberWasDrawn(game, number) {
  return game.drawnNumbers
    .filter((draw) => draw.number === number)
    .length > 0;
}

module.exports = {
  getAllNumbers,
  getAllNumbersInOrder,
  numberWasDrawn
}
