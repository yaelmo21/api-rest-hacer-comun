const { User, Roles } = require('./user');
const Product = require('./product');
const ShippingAddress = require('./shippingAddress');
const { Order, statusOrder } = require('./order');

module.exports = {
    User,
    Product,
    Roles,
    ShippingAddress,
    Order,
    statusOrder
}
