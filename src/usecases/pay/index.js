const { HTTPError, pay, config } = require('../../lib');
const { User } = require('../../models')

const sessionCustomer = async (userId, urlReturn = config.app.host) => {
    const userDb = await User.findById(userId).lean();
    if (!userDb) throw new HTTPError(404, 'User not found');
    if (!userDb.billingId) throw new HTTPError(409, 'the user does not have a billing ID');
    const portalSession = await pay.createSessionCustomer(userDb.billingId, urlReturn);
    return portalSession.url;
}

module.exports = {
    sessionCustomer
}