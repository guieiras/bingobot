module.exports = function (controller) {
  controller.hears(['acompanhar jogo'], 'direct_mention', async (bot, message) => {
    const game = await controller.repositories.GamesRepository.createGame(
      message.user, message.team, message.channel
    )

    await bot.api.reactions.add({
      timestamp: message.ts,
      channel: message.channel,
      name: '+1'
    })

    await bot.replyEphemeral(
      message, {
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `Suas credenciais para este jogo.\n\n*ID:* ${game._id}\n*Chave:* ${game.signingKey}`
            }
          }
        ]
      }
    );
  });
}
