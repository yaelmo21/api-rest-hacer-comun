const { HTTPError, config } = require('../../lib');
const { Order, Product, ShippingAddress } = require('../../models');

const formatProducts = (products, orderItems) => {
    const orderItemsFormat = orderItems.map((item) => {
        const productDb = products.find((product) => product._id.toString() === item._id);
        const copyProduct = { ...productDb };
        delete copyProduct.sizes;
        delete copyProduct.images;
        return {
            ...copyProduct,
            quantity: item.quantity,
            size: item.size,
            image: productDb.images[0],
            validSize: productDb.sizes.includes(item.size)
        }
    });
    const productsNotSize = orderItemsFormat.filter((item) => !item.validSize);
    if (productsNotSize.length > 0) {
        const sizes = productsNotSize.map(({ size }) => size).join(', ')
        throw new HTTPError(400, `${sizes} is not valid`);
    }
    return orderItemsFormat.map((item) => {
        delete item.validSize;
        return item;
    })
}


const createOrder = async (userId, orderItems, shippingAddressId) => {
    const productsIds = orderItems.map(({ _id }) => _id);
    const productSearch = Product.find({ _id: { $in: productsIds } }).select({
        _id: 1,
        title: 1,
        description: 1,
        images: 1,
        slug: 1,
        sizes: 1,
        image: 1,
        price: 1,
    }).lean();
    const shippingAddressSearch = ShippingAddress.findById(shippingAddressId).
        select({
            _id: 0,
            firstName: 1,
            lastName: 1,
            address: 1,
            address2: 1,
            zip: 1,
            city: 1,
            country: 1,
            phone: 1,
        })
        .lean();
    const [products, shippingAddress] = await Promise.all([productSearch, shippingAddressSearch]);
    const productsDbIds = products.map(({ _id }) => _id.toString());
    const countNotFoundProducts = productsIds.filter((id) => !productsDbIds.includes(id)).length;
    if (countNotFoundProducts > 0) throw new HTTPError(400, `${countNotFoundProducts} ${countNotFoundProducts > 1 ? 'products' : 'product'} has been found`);
    if (!shippingAddress) throw new HTTPError(400, 'Shipping Address not found');
    const orderItemsFormat = formatProducts(products, orderItems);
    const total = products.reduce((acc, current) => acc + current.price, 0);
    const taxAmount = total * config.app.taxRate;
    const subTotal = total - taxAmount;
    const newOrder = {
        user: userId,
        orderItems: orderItemsFormat,
        shippingAddress,
        numberOfItems: products.length,
        subTotal,
        taxAmount,
        total,
    };
    const order = new Order(newOrder);
    await order.save();
    return order;
}


module.exports = {
    createOrder
}