const Stripe = require('stripe');
const config = require('./config');

const stripe = new Stripe(config.stripe.privateApiKey, { apiVersion: '2022-11-15' });
const createCustomer = (email, name) => stripe.customers.create({ email, name });

module.exports = {
    createCustomer
}