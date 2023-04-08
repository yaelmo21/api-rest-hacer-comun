const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema, model } = mongoose;

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

const ShippingAddress = mongoose.models.ShippingAddress || model('ShippingAddress', shippingAddressSchema);

module.exports = ShippingAddress;