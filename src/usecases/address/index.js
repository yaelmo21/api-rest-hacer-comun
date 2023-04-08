const { isValidObjectId } = require('mongoose');
const { HTTPError, config } = require('../../lib');
const { ShippingAddress, User } = require('../../models');


const getAll = (userId, page = 1, limit = 10,) => {
    return ShippingAddress.paginate({
        user: userId,
        isActive: true,
    }, {
        page,
        limit,
        select: {
            user: 0
        },
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
        const addressJSON = addressDb.toJSON();
        delete addressJSON.user;
        return addressJSON;
    } catch (error) {
        const { message } = error;
        throw new HTTPError(400, message);
    }
}

const getById = async (id, userId) => {
    if (!isValidObjectId(id)) throw new HTTPError(404, 'Shipping Address not Found');
    const addressDb = await ShippingAddress.findOne({ _id: id, user: userId, isActive: true }).select('-user').lean();
    if (!addressDb) throw new HTTPError(404, 'Shipping Address not Found');
    return addressDb;
}

const update = async (id, address, userId) => {
    try {
        if (!isValidObjectId(id)) throw new HTTPError(404, 'Shipping Address not Found');
        const userDb = await User.findById(userId).lean();
        if (!userDb) throw new HTTPError(404, 'User not found');
        delete address.user;
        delete address.isActive;
        const addressDb = await ShippingAddress.findOneAndUpdate({ _id: id, user: userId }, address, { new: true }).lean();
        if (!addressDb) throw new HTTPError(404, 'User not found');
        return addressDb;
    } catch (error) {
        const { message } = error;
        throw new HTTPError(400, message);
    }
}

const deleteAddress = async (id, userId) => {
    if (!isValidObjectId(id)) throw new HTTPError(404, 'Shipping Address not Found');
    const addressDb = await ShippingAddress.findOneAndUpdate({ _id: id, user: userId, isActive: true }, { isActive: false }).select('-user').lean();
    if (!addressDb) throw new HTTPError(404, 'Shipping Address not Found');
    return addressDb;
}



module.exports = {
    getAll,
    create,
    getById,
    update,
    deleteAddress
}