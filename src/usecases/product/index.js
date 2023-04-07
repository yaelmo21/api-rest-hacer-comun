const cloudinary = require('cloudinary').v2;
const { HTTPError, config } = require('../../lib');
const { Product } = require('../../models');

cloudinary.config(config.app.cloudinary_url || '');

const getProducts = async (page = 1, limit = 10, termSearch) => {
    const query = termSearch ? { $text: { $search: termSearch } } : {};
    return Product.paginate(query, {
        page,
        limit,
        customLabels: {
            docs: 'products',
        }
    });
}


const createProduct = async (product) => {
    try {
        const productBySlug = await Product.findOne({ slug: product.slug });
        if (productBySlug) throw new HTTPError(409, `Already exist a product with slug: ${product.slug}`);
        const productDb = new Product(product);
        await productDb.save();
        return productDb;
    } catch (error) {
        const { message } = error;
        throw new HTTPError(400, message);
    }
}

const getProduct = async (id) => {
    const product = Product.findOne({
        $or: [
            { _id: id },
            { slug: id }
        ]
    });
    if (!product) throw new HTTPError(404, 'Product not found');
    return product;
}


const uploadImageProduct = async (id, imagePath) => {
    const product = await Product.findById(id);
    if (!product) throw new HTTPError(404, 'Product not found');
    const { secure_url } = await cloudinary.uploader.upload(imagePath);
    product.images = [...product.images, secure_url];
    await product.save();
    return secure_url
}


const updateProduct = async (id, product) => {
    try {
        product.images = product.images ?? [];
        const { images } = product;
        const productDb = await Product.findById(id);
        if (!productDb) throw new HTTPError(404, 'Product not found');
        const productBySlug = await Product.findOne({ slug: product.slug });
        if (productBySlug && productBySlug._id.toString() !== id) throw new HTTPError(409, `Already exist a product with slug: ${product.slug}`);
        for await (const image of productDb.images) {
            if (!images.includes(image)) {
                const [id] = image.substring(image.lastIndexOf('/') + 1).split('.');
                await cloudinary.uploader.destroy(id);
            }
        }
        const productUpdate = await Product.findByIdAndUpdate(id, product, { new: true });
        return productUpdate;
    } catch (error) {
        const { message } = error;
        throw new HTTPError(400, message);
    }
}



const deactivateProduct = async (id) => {
    const productDb = await Product.findById(id);
    if (!productDb) throw new HTTPError(404, 'Product not found');
    productDb.isActive = false;
    await productDb.save();
    return true;
}
module.exports = {
    getProducts,
    createProduct,
    getProduct,
    uploadImageProduct,
    updateProduct,
    deactivateProduct
}