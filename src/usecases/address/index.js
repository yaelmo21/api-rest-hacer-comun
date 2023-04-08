const { HTTPError, config } = require('../../lib');
const { ShippingAddress } = require('../../models');


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


module.exports = {
    getAll
}