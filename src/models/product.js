const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema, model } = mongoose;

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
    sizes: [{
        type: String,
        enum: {
            values: ['small', 'medium', 'large', 'extra large'],
            message: 'Size is not valid'
        }
    }],
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

const Product = mongoose.models.Product || model('Product', productSchema);

module.exports = Product;