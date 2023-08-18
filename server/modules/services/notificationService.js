const Notifications = require('@registers/notifications/models');

module.exports = {
  async addChanges(objectData, req) {
    let changesData = { ...objectData };

    if (req.user) {
      changesData.authorId = req.user.id;
    }

    await Notifications.create(changesData).catch((err) => {
      console.error(err);
    });
  },
};
