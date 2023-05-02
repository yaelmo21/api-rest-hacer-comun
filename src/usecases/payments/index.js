const { pay, HTTPError } = require('../../lib');
const orderCases = require('../order');


const getEvent = (body, signature) => {
    try {
        const event = pay.webhookEvent(body, signature)
        return event;
    } catch (err) {
        throw new HTTPError(400, `Webhook Error: ${err.message}`);
    }
}

const captureActions = async (body, signature) => {
    const event = getEvent(body, signature);
    switch (event.type) {
        case 'checkout.session.completed':
            const sessionId = event.data.object.id;
            const session = await pay.retriveSessionCustomer(sessionId);
            const result = await orderCases.updatePayOrder(session.id);
            return result;
        default:
            throw new HTTPError(400, `Unhandled event type ${event.type}`);
    }
}

module.exports = {
    captureActions
}