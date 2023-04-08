const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema, model } = mongoose;
const { config } = require('../lib');

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [{
        type: String,
    }],
    inStock: { type: Number, default: 0, required: true },
    price: { type: Number, default: 0, required: true },
    isActive: { type: Boolean, default: true },
    sizes: {
        type: [{
            type: String,
            enum: {
                values: ['small', 'medium', 'large', 'extra large', 'unique'],
                message: 'Size is not valid'
            },
        }],
        default: ['unique']
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    tags: [{
        type: String,
    }],
}, {
    timestamps: true
});

productSchema.index({ title: 'text', description: 'text', tags: 'text' });
productSchema.plugin(mongoosePaginate);
productSchema.methods.toJSON = function () {
    let product = this;
    let productObj = product.toObject();
    productObj.url = `${config.app.host}/products/${product._id}`;
    return productObj;
}

const Product = mongoose.models.Product || model('Product', productSchema);

module.exports = Product;