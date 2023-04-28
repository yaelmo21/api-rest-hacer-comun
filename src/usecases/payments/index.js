const { pay, HTTPError } = require('../../lib');


const getEvent = (body, signature) => {
    try {
        const event = pay.webhookEvent(body, signature)
        return event;
    } catch (err) {
        throw new HTTPError(400, `Webhook Error: ${err.message}`);
    }
}

const captureActions = (body, signature) => {
    const event = getEvent(body, signature);
}