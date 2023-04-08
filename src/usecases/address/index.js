const { HTTPError, config } = require('../../lib');
const { ShippingAddress, User } = require('../../models');


const getAll = (userId, page = 1, limit = 10,) => {
    return ShippingAddress.paginate({
        user: userId
    }, {
        page,
        limit,
        customLabels: {
            docs: 'addresses',
        }
    });
}

const create = async (userId, address) => {
    try {
        const userDb = await User.findById(userId).lean();
        if (!userDb) throw new HTTPError(404, 'User not found');
        const addressDb = new ShippingAddress({ ...address, user: userId });
        await addressDb.save();
        return addressDb;
    } catch (error) {
        const { message } = error;
        throw new HTTPError(400, message);
    }
}



module.exports = {
    getAll,
    create
}