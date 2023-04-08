const router = require("express").Router();
const addressCases = require('../usecases/address');
const { auth } = require('../middlewares');
const { HTTPError } = require('../lib')



/**
 * @swagger
 * definitions:
 *   address:
 *     properties:
 *       _id: 
 *         type: string
 *       firstName: 
 *         type: string
 *       lastName: 
 *         type: string
 *       address: 
 *         type: string
 *       address2: 
 *         type: string
 *       zip: 
 *         type: string
 *       city: 
 *         type: string
 *       state: 
 *         type: string
 *       country: 
 *         type: string
 *       phone: 
 *         type: string
 *       createdAt: 
 *         type: string
 *       updatedAt: 
 *         type: string
 */


/**
 * @swagger
 * parameters:
 *   address:
 *     required:
 *       - firstName
 *       - lastName
 *       - address
 *       - address2
 *       - zip
 *       - city
 *       - state
 *       - country
 *       - phone
 *     properties:
 *       firstName: 
 *         type: string
 *       lastName: 
 *         type: string
 *       address: 
 *         type: string
 *       address2: 
 *         type: string
 *       zip: 
 *         type: string
 *       city: 
 *         type: string
 *       state: 
 *         type: string
 *       country: 
 *         type: string
 *       phone: 
 *         type: string
 */



/**
 * @swagger
 * /addresses/:
 *   get:
 *     tags:
 *     - addresses
 *     description: List Addresses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: query
 *        name: page
 *        description: current page list
 *      - in: query
 *        name: limit
 *        description: max limit registers
 *     responses:
 *       200:
 *         description: Result Addresses.
 *         schema:
 *           type: object
 *           properties:
 *            products: 
 *             type: array
 *             items: 
 *               type: object
 *               $ref: '#/definitions/address'
 *            totalDocs: 
 *              type: number
 *            limit: 
 *              type: number
 *            totalPages: 
 *              type: number
 *            page: 
 *              type: number
 *            pagingCounter: 
 *              type: number
 *            hasPrevPage: 
 *              type: boolean
 *            hasNextPage: 
 *              type: boolean
 *            prevPage: 
 *              type: string
 *              format: nullable
 *            nextPage: 
 *              type: string
 *              format: nullable
 *       401:
 *         description: unauthorized.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       404:
 *         description: not found.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: unauthorized.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 */
router.get('/', auth.authHandler, async (req, res) => {
    const { page, limit } = req.query;
    const { sub } = req.params.token;
    try {
        const result = await addressCases.getAll(sub, page, limit);
        res.status(200).send(result);
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error, contact Support'
        });
    }
});


/**
 * @swagger
 * /addresses/:
 *   post:
 *     tags:
 *     - addresses
 *     description: Create address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: body
 *        name: ShippingAddress
 *        description: ShippingAddress Create.
 *        schema:
 *          type: object
 *          $ref: '#/parameters/address'
 *     responses:
 *       201:
 *         description: Create success address.
 *         schema:
 *           type: object
 *           properties:
 *             ok:
 *               type: boolean
 *             address: 
 *               type: object
 *               $ref: '#/definitions/address'
 *       401:
 *         description: unauthorized.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: unauthorized.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 */
router.post('/', auth.authHandler, async (req, res) => {
    const { sub } = req.params.token;
    const address = req.body;
    try {
        const result = await addressCases.create(sub, address);
        res.status(201).send({ ok: true, address: result });
    } catch (error) {
        if (HTTPError.isHttpError(error)) {
            return resp.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({
            message: 'Internal Server Error, contact Support'
        });
    }
});

/**
 * @swagger
 * /addresses/:id:
 *   get:
 *     tags:
 *     - addresses
 *     description: Create address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: id
 *        description: Mongo ID
 *     responses:
 *       201:
 *         description: Success get address.
 *         schema:
 *           type: object
 *           properties:
 *             ok:
 *               type: boolean
 *             address: 
 *               type: object
 *               $ref: '#/definitions/address'
 *       401:
 *         description: unauthorized.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       404:
 *         description: not found.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: unauthorized.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 */
router.get('/:id', auth.authHandler, async (req, res) => {
    const { sub } = req.params.token;
    const { id } = req.params;
    try {
        const result = await addressCases.getById(id, sub);
        res.status(200).send({ ok: true, address: result });
    } catch (error) {
        if (HTTPError.isHttpError(error)) {
            return resp.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({
            message: 'Internal Server Error, contact Support'
        });
    }
});

/**
 * @swagger
 * /addresses/:id:
 *   put:
 *     tags:
 *     - addresses
 *     description: Update address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: id
 *        description: Mongo ID
 *      - in: body
 *        name: ShippingAddress
 *        description: ShippingAddress update.
 *        schema:
 *          type: object
 *          $ref: '#/parameters/address'
 *     responses:
 *       201:
 *         description: Create success address.
 *         schema:
 *           type: object
 *           properties:
 *             ok:
 *               type: boolean
 *             address: 
 *               type: object
 *               $ref: '#/definitions/address'
 *       401:
 *         description: unauthorized.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       404:
 *         description: not found.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: unauthorized.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 */
router.put('/:id', auth.authHandler, async (req, res) => {
    const { sub } = req.params.token;
    const { id } = req.params;
    const address = req.body;
    try {
        const result = await addressCases.update(id, address, sub);
        res.status(200).send({ ok: true, address: result });
    } catch (error) {
        if (HTTPError.isHttpError(error)) {
            return resp.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({
            message: 'Internal Server Error, contact Support'
        });
    }
});



/**
 * @swagger
 * /addresses/:id:
 *   delete:
 *     tags:
 *     - addresses
 *     description: Delete address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: id
 *        description: Mongo ID
 *     responses:
 *       201:
 *         description: Success get address.
 *         schema:
 *           type: object
 *           properties:
 *             ok:
 *               type: boolean
 *             message:
 *               type: string
 *       401:
 *         description: unauthorized.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       404:
 *         description: not found.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: unauthorized.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 */
router.delete('/:id', auth.authHandler, async (req, res) => {
    const { sub } = req.params.token;
    const { id } = req.params;
    try {
        await addressCases.deleteAddress(id, sub);
        res.status(200).send({ ok: true, message: 'Shipping Address has been deleted' });
    } catch (error) {
        if (HTTPError.isHttpError(error)) {
            return resp.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({
            message: 'Internal Server Error, contact Support'
        });
    }
});
module.exports = router;