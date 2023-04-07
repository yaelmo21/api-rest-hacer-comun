const express = require('express');
const defaultRoutes = require('./defaultRoutes');
const usersRoutes = require('./usersRoutes');
const productsRoutes = require('./productsRoutes');


const Routes = express();
Routes.use('/', defaultRoutes);
Routes.use('/users', usersRoutes);
Routes.use('/products', productsRoutes);

module.exports = Routes;