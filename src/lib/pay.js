const Stripe = require('stripe');
const config = require('./config');

const stripe = new Stripe(config.stripe.privateApiKey, { apiVersion: '2022-11-15' });

const priceToCents = (amount) => {
    if (typeof amount !== 'string' && typeof amount !== 'number') {
        throw new Error('Amount passed must be of type String or Number.')
    }
    return Math.round(100 * parseFloat(typeof amount === 'string' ? amount.replace(/[$,]/g, '') : amount))
}


const createCustomer = (email, name) => stripe.customers.create({ email, name });
const createPay = async (orderItems, billingId) => {
    // TODO Replaze url front;
    const url = 'https://localhost:3000';
    const session = await stripe.checkout.sessions.create({
        billing_address_collection: 'auto',
        line_items: orderItems.map((item) => ({
            price_data: {
                currency: 'mxn',
                product_data: {
                    name: item.title
                },
                unit_amount: priceToCents(item.price)
            },
            quantity: item.quantity
        })),
        mode: 'payment',
        customer: billingId,
        success_url: `${url}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}?canceled=true`,
    });
    return {
        id: session.id,
        url: session.url,
    };
}

const createSessionCustomer = async (billingId, url) => {
    const portalSession = await stripe.billingPortal.sessions.create({
        customer: billingId,
        return_url: url,
    });
    return portalSession;
}
const webhookEvent = (body, signature) => {
    return stripe.webhooks.constructEvent(request.body, signature, config.stripe.endpointSecret);
}

module.exports = {
    createCustomer,
    createPay,
    createSessionCustomer,
    webhookEvent
}