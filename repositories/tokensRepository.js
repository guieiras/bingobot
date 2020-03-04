module.exports = function TokensRepository (controller) {
  const tokens = {};

  async function getTokenForTeam(teamId) {
    return new Promise((resolve, reject) => {
      if (tokens[teamId]) { return resolve(tokens[teamId]); }
      controller.database.get('Tokens').findOne(
        { teamId }, { sort: { createdAt: -1 } }
      ).then((doc) => {
        if (doc) {
          tokens[teamId] = doc.accessToken;
          resolve(doc.accessToken);
        } else {
          reject();
        }
      });
    });
  }

  async function saveTokenForTeam(teamId, accessToken) {
    return new Promise((resolve, reject) => {
      controller.database.get('Tokens').insert(
        { teamId, accessToken, createdAt: new Date() }
      ).then((doc) => {
        tokens[teamId] = doc.accessToken;
        resolve(doc.accessToken);
      }).catch(reject);
    });
  }

  return { TokensRepository: { getTokenForTeam, saveTokenForTeam } };
}
