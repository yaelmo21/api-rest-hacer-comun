const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema, model } = mongoose;
const { config } = require('../lib');


const status = {
    create: 'create',
    preparing: 'preparing',
    send: 'send',
    canceled: 'canceled'
}

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [{
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        title: { type: String, required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
        description: { type: String, required: true },
        slug: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
    }],
    shippingAddress: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        address: { type: String, required: true },
        address2: { type: String },
        zip: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true },
    },
    numberOfItems: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    total: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: String },
    transactionId: { type: String },
    comments: { type: String },
    state: {
        type: String,
        enum: {
            values: Object.values(status),
            message: '{VALUE} is not valid status'
        },
        default: 'create'
    },
    carrierInformation: {
        name: { type: String },
        tracking: { type: String },
    }
}, {
    timestamps: true,
});

orderSchema.plugin(mongoosePaginate);
orderSchema.methods.toJSON = function () {
    let order = this;
    let orderObj = order.toObject();
    orderObj.orderItems = orderObj.orderItems.map((item) => ({
        ...item,
        url: `${config.app.host}/products/${item._id}`
    }));
    orderObj.url = `${config.app.host}/orders/${order._id}`;
    return orderObj;
}

const Order = mongoose.models.Order || model('Order', orderSchema);
module.exports = {
    Order,
    statusOrder: status
};