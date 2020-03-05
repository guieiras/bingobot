const {
  getAllNumbers,
  getAllNumbersInOrder,
  numberWasDrawn
} = require('../useCases/games/drawnNumbers');

module.exports = function (controller) {
  controller.hears(
    ['todos', 'sorteados', 'saíram', 'saiu'],
    'direct_mention',
    async (bot, message) => {
      const text = message.text.toLowerCase();
      const game = await controller.repositories.GamesRepository.findGameForChannel(
        message.team, message.channel
      );

      let match;

      match = text.match(/^todos$/) ||
        text.match(/^sorteados$/) ||
        text.match(/^quais sa[ií]ram\??/);
      if (match) {
        return await bot.replyInThread(
          message,
          getAllNumbers(game).join(' - ')
        );
      }

      match = text.match(/^todos\s(em|na)\sordem$/) ||
        text.match(/^sequ[eê]ncia de sorteados$/);
      if (match) {
        return await bot.replyInThread(
          message,
          getAllNumbersInOrder(game).join(' - ')
        );
      }

      match = text.match(/j[aá]?\s?saiu\so\s(\d+)\??/)
      if (match) {
        return await bot.replyInThread(
          message,
          numberWasDrawn(game, parseInt(match[1])) ? 'Sim' : 'Não'
        );
      }
  });
}
