const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares');
const { HTTPError, config } = require('../lib');
const payCases = require('../usecases/pay');

router.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, config.stripe.privateApiKey);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            // Then define and call a function to handle the event payment_intent.succeeded
            break;
        // ... handle other event types
        default:

    }
    response.send();
});

router.post('/portal-session', auth.authHandler, async (req, res) => {
    try {
        const { sub } = req.params.token;
        const { urlReturn } = req.body;
        const urlSession = await payCases.sessionCustomer(sub, urlReturn);
        res.status(200).json({
            ok: true,
            urlSession,
        });
    } catch (error) {

        if (HTTPError.isHttpError(error)) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({
            message: 'Internal Server Error, contact Support'
        });
    }
})

module.exports = router;