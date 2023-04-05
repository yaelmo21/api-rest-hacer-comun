const express = require('express');
const defaultRoutes = require('./default');

const Routes = express();
Routes.use('/', defaultRoutes);

module.exports = Routes;