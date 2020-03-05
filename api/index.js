module.exports = function (controller) {
  controller.webserver.post('/games/:id/draws', async (req, res) => {
    const { id } = req.params;
    const signingKey = req.header('X-Signing-Key');
    const number = parseInt(req.body && req.body.number);

    try {
      if (isNaN(number)) {
        return res.status(422).json({ error: { number: 'invalid' } });
      }

      const game = await controller.repositories
        .GamesRepository
        .findGameByIdAndSigningKey(id, signingKey);

      if (game) {
        const bot = await controller.spawn(game.config.team);
        await bot.startConversationInChannel(game.config.channel);
        bot.say(`<!here> ${number}`);

        await controller.repositories
          .GamesRepository
          .addNumberToDrawn(game._id, number);

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
