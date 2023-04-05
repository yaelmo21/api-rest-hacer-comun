const { User } = require('../../models');
const { config, HTTPError } = require('../../lib');
const seedData = require('../../seed');


const initData = async () => {
    if (config.app.node_env !== 'development') throw new HTTPError(401, 'Endpoint no dsiponible');

    // Limpiar base de datos
    const usersRemove = User.deleteMany({});
    const promises = [usersRemove];
    await Promise.all(promises);

    // Insertar datos de prueba
    const usersData = seedData.users;
    const usersAdd = User.insertMany(usersData);
    const promisesAdd = [usersAdd];
    await Promise.all(promisesAdd);

    return true;
}


module.exports = {
    initData
}