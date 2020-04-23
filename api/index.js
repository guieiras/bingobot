const { numberWasDrawn } = require('../useCases/games/drawnNumbers');

module.exports = function (controller) {
  controller.webserver.post('/games/:id/draws', async (req, res) => {
    const { id } = req.params;
    const signingKey = req.header('X-Signing-Key');
    const numbers = req.body.numbers &&
      req.body.numbers.map((number) => parseInt(number));

    try {
      if (numbers.filter((number) => isNaN(number)).length > 0) {
        return res.status(422).json({ error: { numbers: 'invalid' } });
      }

      const game = await controller.repositories
        .GamesRepository
        .findGameByIdAndSigningKey(id, signingKey);

      const newDraws = Array.from(new Set(numbers))
        .filter((draw) => !numberWasDrawn(game, draw));

      if (game) {
        const bot = await controller.spawn(game.config.team);
        await bot.startConversationInChannel(game.config.channel);
        bot.say(`<!here> ${newDraws.join(', ')}`);

        await Promise.all(newDraws.map((number) => (
          controller.repositories
            .GamesRepository
            .addNumberToDrawn(game._id, number)
        )));

        res.status(201).send('');
      } else {
        res.status(404).send('');
      }
    } catch (e) {
      console.error(e);
      res.status(400).send('');
    }
  });
}
