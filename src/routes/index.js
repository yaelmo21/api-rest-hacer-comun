const express = require('express');
const defaultRoutes = require('./defaultRoutes');
const usersRoutes = require('./usersRoutes');

const Routes = express();
Routes.use('/', defaultRoutes);
Routes.use('/users', usersRoutes);

module.exports = Routes;