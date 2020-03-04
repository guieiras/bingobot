module.exports = function BotUsersRepository (controller) {
  const users = {};

  async function getUserForTeam(teamId) {
    return new Promise((resolve, reject) => {
      if (users[teamId]) { return resolve(users[teamId]); }
      controller.database.get('BotUsers').findOne(
        { teamId }, { sort: { createdAt: -1 } }
      ).then((doc) => {
        if (doc) {
          users[teamId] = doc.botUserId;
          resolve(doc.botUserId);
        } else {
          reject();
        }
      });
    });
  }

  async function saveUserForTeam(teamId, botUserId) {
    return new Promise((resolve, reject) => {
      controller.database.get('BotUsers').insert(
        { teamId, botUserId, createdAt: new Date() }
      ).then((doc) => {
        users[teamId] = doc.botUserId;
        resolve(doc.botUserId);
      }).catch(reject);
    });
  }

  return { BotUsersRepository: { getUserForTeam, saveUserForTeam } };
}
