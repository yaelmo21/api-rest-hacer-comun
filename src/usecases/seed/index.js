const { User, Product, ShippingAddress } = require('../../models');
const { config, HTTPError } = require('../../lib');
const seedData = require('../../seed');


const initData = async () => {
    if (config.app.node_env !== 'development') throw new HTTPError(401, 'Endpoint no dsiponible');

    // Limpiar base de datos
    const usersRemove = User.deleteMany({});
    const productsRemove = Product.deleteMany({});
    const addressesRemove = ShippingAddress.deleteMany({});
    const promises = [usersRemove, productsRemove, addressesRemove];
    await Promise.all(promises);

    // Insertar datos de prueba
    const usersData = seedData.users;
    const productsData = seedData.products;
    const usersAdd = User.insertMany(usersData);
    const productsAdd = Product.insertMany(productsData);
    const promisesAdd = [usersAdd, productsAdd];
    const [users] = await Promise.all(promisesAdd);
    const usersId = users.map((user) => user._id);
    const addresses = seedData.shippingAddresses.map((address, index) => ({
        ...address,
        user: usersId[index]
    }));

    await ShippingAddress.insertMany(addresses);


    return true;
}


module.exports = {
    initData
}