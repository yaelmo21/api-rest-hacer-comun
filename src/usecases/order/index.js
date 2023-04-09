const { HTTPError, config, mail } = require('../../lib');
const { Order, Product, ShippingAddress, User, Roles, statusOrder } = require('../../models');

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


const sendEmailStateOrder = async (user, orderId, state, carrierInformation, comments) => {
    // TODO Add Url order front
    const { firstNam, email } = user;
    if (state === statusOrder.preparing) {
        const subject = 'Estamos preparando tu orden';
        const textMsg = `Hola ${firstName},
         Tu orden ${orderId} está en preparación, en breve recibirás un correo con la información del transportista,
         así como tu número de rastreo.

         Muchas gracias por comprar en Hacer común.
        `;

        const htmlMsg = `<p>Hola ${firstName},</p>
        <p>Tu orden ${orderId} está en preparación, en breve recibirás un correo con la información del transportista,
         así como tu número de rastreo.</p>
        <p>Muchas gracias por comprar en Hacer común.</p>
        `;
        await mail.send(email, subject, textMsg, htmlMsg);
    }

    if (state === statusOrder.send) {
        const { name, tracking } = carrierInformation;
        const subject = 'Tu orden ha sido enviada';
        const textMsg = `Hola ${firstName},
         Te informamos que hemos enviado tu orden ${orderId}.
         Se ha enviado con ${name} con número de rastreo ${tracking}
         Muchas gracias por comprar en Hacer común
        `;

        const htmlMsg = `<p>Hola ${firstName},</p>
        <p>Te informamos que hemos enviado tu orden ${orderId}.</p>
        <p>Se ha enviado con <strong>${name}</strong> con número de rastreo <strong>${tracking}</strong></p>
        <p>Muchas gracias por comprar en Hacer común.</p>
        `;
        await mail.send(email, subject, textMsg, htmlMsg);
    }


    if (state === statusOrder.canceled) {
        const subject = 'Cencelación de orden';
        const textMsg = `Hola ${firstName},
         Lamentamos informarte que tu orden ${orderId} ha sido cancelada.
         nuestro equipo ha determinado que ${comments}.

         Agradecemos tu comprensión.
        `;

        const htmlMsg = `<p>Hola ${firstName},</p>
        <p>Lamentamos informarte que tu orden <strong>${orderId}</strong> ha sido cancelada.</p>
        <p>nuestro equipo ha determinado que: <strong>${comments}</strong>.</p>
        <p>Agradecemos tu comprensión.</p>
        `;
        await mail.send(email, subject, textMsg, htmlMsg);
    }

}


const createOrder = async (userId, orderItems, shippingAddressId) => {
    const userDb = await User.findById(userId).lean();
    if (!userDb) throw new HTTPError(404, 'User not found');
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
    const { email, firstName } = userDb;
    // TODO: replace url for order url front
    const url = 'http'
    const emailOrderText = `Hola ${firstName},
    Gracias por tu orden. 
    
    Continua el proceso de pago con el siguiente link: ${url}.
    El total de tu compra es de $${total} MXN.

    Una vez procesado el pago, tu solicitud será revisada contra disponibilidad de inventario, 
    de ser confirmada recibirás un correo electrónico con más detalles.
    `;
    const emailOrderHtml = `<p>Hola ${firstName},</p>
    <p>Continua el proceso de pago con el siguiente link: <strong><a href="${url}">aquí</a></strong></p>
    <p>El total de tu compra es de <strong>$${total} MXN.</strong></p>
    <p>Una vez procesado el pago, tu solicitud será revisada contra disponibilidad de inventario, 
    de ser confirmada recibirás un correo electrónico con más detalles.</p>
    `;
    await mail.send(email, 'Información sobre tu orden', emailOrderText, emailOrderHtml);
    return order;
}


const getOrders = async (userId, page = 1, limit = 10, termSearch) => {
    const search = termSearch ? { $text: { $search: termSearch } } : {};
    const userDb = await User.findById(userId).lean();
    if (!userDb) throw new HTTPError(404, 'User not found');
    const query = userDb.role !== Roles.admin ? { _id: userId, ...search } : search
    const result = Order.paginate(query, {
        page,
        limit,
        customLabels: {
            docs: 'orders',
        }
    });
    return result;
}

const getOrderById = async (userId, orderId) => {
    const userDb = await User.findById(userId).lean();
    if (!userDb) throw new HTTPError(404, 'User not found');
    const query = userDb.role !== Roles.admin ? { _id: orderId, user: userId } : { _id: orderId };
    const order = await Order.findOne(query);
    if (!order) throw new HTTPError(404, 'Order not found');
    return order;
}

const updateOrder = async (orderId, state, comments = '', carrierInformation = {}) => {
    if (state && !Object.values(statusOrder).includes(state)) {
        throw new HTTPError(400, `${state} is not valid state`);
    }
    if (state === statusOrder.canceled && !comments) {
        throw new HTTPError(400, 'It is necessary to send the comments of the cancellation');
    }
    if (state === statusOrder.send && Object.keys(carrierInformation).length === 0) {
        throw new HTTPError(400, 'It is necessary to send the carrierInformation of the send order');
    }
    const orderDb = await Order.findById(orderId);
    if (!orderDb) throw new HTTPError(404, 'Order not found');
    if (orderDb.state === statusOrder.create && !orderDb.isPaid) {
        throw new HTTPError(409, 'unpaid order');
    }
    if (orderDb.state === statusOrder.send || orderDb.state === statusOrder.canceled) {
        throw new HTTPError(409, `Order in wrong status, current status: ${orderDb.state}`);
    }
    orderDb.state = state;
    orderDb.comments = comments;
    orderDb.carrierInformation = carrierInformation;
    await orderDb.save();
    const userDb = await User.findById(orderDb.user).select({
        firstName: 1,
        lastName: 1,
        email: 1
    }).lean();
    await sendEmailStateOrder(userDb, orderId, state, carrierInformation, comments);
    return orderDb;
}


module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder
}