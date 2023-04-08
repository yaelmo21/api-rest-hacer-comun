const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema, model } = mongoose;
const { config } = require('../lib');

const shippingAddressSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    address2: { type: String },
    zip: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true, default: 'México' },
    phone: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
});


shippingAddressSchema.plugin(mongoosePaginate);

shippingAddressSchema.methods.toJSON = function () {
    let address = this;
    let addressObj = address.toObject();
    addressObj.url = `${config.app.host}/addresses/${address._id}`;
    return addressObj;
}

const ShippingAddress = mongoose.models.ShippingAddress || model('ShippingAddress', shippingAddressSchema);

module.exports = ShippingAddress;