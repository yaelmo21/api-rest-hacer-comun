const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares');
const { HTTPError, } = require('../lib');
const paymentsCases = require('../usecases/payments');




router.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
    try {
        const signature = request.headers['stripe-signature'];
        const body = request.rawBody;
        await paymentsCases.captureActions(body, signature);
        response.send();
    } catch (error) {
        if (HTTPError.isHttpError(error)) {
            return response.status(error.statusCode).json({ message: error.message });
        }
        return response.status(500).json({
            message: 'Internal Server Error, contact Support'
        });
    }
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