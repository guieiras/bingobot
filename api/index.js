module.exports = function (controller) {
  controller.webserver.post('/games/:id/draws', async (req, res) => {
    const { id } = req.params;
    const signingKey = req.header('X-Signing-Key');
    const { number } = req.body;

    try {
      const game = await controller.repositories
        .GamesRepository
        .findGameByIdAndSigningKey(id, signingKey);

      const bot = await controller.spawn(game.config.team);
      await bot.startConversationInChannel(game.config.channel);

      bot.say(`<!here> ${number}`);
      res.status(201).send('')
    } catch (e) {
      console.error(e);
      res.status(400).send('');
    }
  });
}
