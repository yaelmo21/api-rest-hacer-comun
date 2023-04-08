const express = require('express');
const defaultRoutes = require('./defaultRoutes');
const usersRoutes = require('./usersRoutes');
const productsRoutes = require('./productsRoutes');
const addressesRoutes = require('./addressesRoutes');
const ordersRoutes = require('./ordersRoutes');


const Routes = express();
Routes.use('/', defaultRoutes);
Routes.use('/users', usersRoutes);
Routes.use('/products', productsRoutes);
Routes.use('/addresses', addressesRoutes);
Routes.use('/orders', ordersRoutes);

module.exports = Routes;