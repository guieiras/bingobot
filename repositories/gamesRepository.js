const cryptoRandomString = require('crypto-random-string');

module.exports = function GamesRepository(controller) {
  async function createGame(user, team, channel) {
    return controller.database.get('games').insert(
      {
        config: { user, team, channel },
        createdAt: new Date(),
        finishedAt: null,
        signingKey: cryptoRandomString({ length: 16, type: 'url-safe' }),
        drawnNumbers: [],
        cards: {}
      }
    );
  }

  return { GamesRepository: { createGame } };
}
