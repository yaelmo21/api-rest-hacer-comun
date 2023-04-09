const router = require("express").Router();
const ordersCases = require('../usecases/order');
const { auth } = require('../middlewares');
const { HTTPError } = require('../lib');

/**
 * @swagger
 * definitions:
 *   order:
 *     properties:
 *       user: 
 *         type: string
 *       orderItems: 
 *         type: array
 *         items: 
 *           type: object
 *           properties: 
 *             _id: 
 *               type: string
 *             title: 
 *               type: string
 *             size: 
 *               type: string
 *             quantity: 
 *               type: integer
 *               format: int32
 *             description: 
 *               type: string
 *             slug: 
 *               type: string
 *             image: 
 *               type: string
 *             price: 
 *               type: integer
 *               format: int32
 *             url: 
 *               type: string
 *       shippingAddress: 
 *         type: object
 *         properties: 
 *           firstName: 
 *             type: string
 *           lastName: 
 *             type: string
 *           address: 
 *             type: string
 *           address2: 
 *             type: string
 *           zip: 
 *             type: string
 *           city: 
 *             type: string
 *           country: 
 *             type: string
 *           phone: 
 *             type: string
 *       numberOfItems: 
 *         type: integer
 *         format: int32
 *       subTotal: 
 *         type: integer
 *         format: int32
 *       taxAmount: 
 *         type: integer
 *         format: int32
 *       total: 
 *         type: integer
 *         format: int32
 *       isPaid: 
 *         type: boolean
 *       _id: 
 *         type: string
 *       createdAt: 
 *         type: string
 *         format: date-time
 *       updatedAt: 
 *         type: string
 *         format: date-time
 *       __v: 
 *         type: integer
 *         format: int32
 *       url: 
 *         type: string
 *       state: 
 *         type: string
 *       comments: 
 *         type: string
 *       carrierInformation: 
 *         type: object
 *         properties: 
 *           name: 
 *             type: string
 *           tracking: 
 *             type: string
 */

/**
 * @swagger
 * parameters:
 *   createOrder:
 *     required:
 *       - orderItems
 *       - shippingAddressId
 *     properties:
 *      orderItems: 
 *        type: array
 *        items: 
 *          type: object
 *          properties: 
 *            _id: 
 *              type: string
 *            quantity: 
 *              type: number
 *            size: 
 *              type: string
 *      shippingAddressId: 
 *        type: string
 *   orderInfo:
 *     properties:
 *      state: 
 *        type: string
 *      comments: 
 *        type: string
 *      carrierInformation: 
 *        type: object
 *        properties: 
 *          name: 
 *            type: string
 *          tracking: 
 *            type: string
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     tags:
 *     - orders
 *     description: Create order
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: order
 *         description: Order Create.
 *         schema:
 *           type: object
 *           $ref: '#/parameters/createOrder'
 *     responses:
 *       201:
 *         description: Success Response.
 *         schema:
 *           type: object
 *           properties:
 *             ok:
 *               type: boolean
 *             product: 
 *               type: object
 *               $ref: '#/definitions/order'
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
router.post('/', auth.authHandler, async (req, res) => {
    try {
        const { sub } = req.params.token;
        const { orderItems, shippingAddressId } = req.body;
        if (orderItems.length === 0) throw new HTTPError(400, 'ProductsIds is required');
        if (!shippingAddressId) throw new HTTPError(400, 'ShippingAddressId is required');
        const order = await ordersCases.createOrder(sub, orderItems, shippingAddressId);
        res.status(201).json(order);
    } catch (error) {
        if (HTTPError.isHttpError(error)) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({
            message: 'Internal Server Error, contact Support'
        });
    }
});


/**
 * @swagger
 * /orders:
 *   get:
 *     tags:
 *     - orders
 *     description: Get All Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: query
 *        name: page
 *        description: current page list
 *      - in: query
 *        name: limit
 *        description: max limit registers
 *      - in: query
 *        name: termSearch
 *        description: Term for search products 
 *     responses:
 *       200:
 *         description: Result products.
 *         schema:
 *           type: object
 *           properties:
 *            orders: 
 *             type: array
 *             items: 
 *               type: object
 *               $ref: '#/definitions/order'
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
 *       500:
 *         description: internal server error.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 */
router.get('/', auth.authHandler, async (req, res) => {
    try {
        const { sub } = req.params.token;
        const { page, limit, termSearch } = req.query;
        const orders = await ordersCases.getOrders(sub, page, limit, termSearch)
        res.status(200).json(orders);
    } catch (error) {
        if (HTTPError.isHttpError(error)) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({
            message: 'Internal Server Error, contact Support'
        });
    }
});

/**
 * @swagger
 * /orders/:id:
 *   get:
 *     tags:
 *     - orders
 *     security:
 *       - bearerAuth: []
 *     description: Get Order
 *     parameters:
 *      - in: path
 *        name: id
 *        description: Mongo ID or Slug
 *     responses:
 *       201:
 *         description: Success Response.
 *         schema:
 *           type: object
 *           $ref: '#/definitions/order'
 *       401:
 *         description: unauthorized.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       404:
 *         description: Not found.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: internal server error.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 */
router.get('/:id', auth.authHandler, async (req, res) => {
    try {
        const { sub } = req.params.token;
        const { id } = req.params;
        const order = await ordersCases.getOrderById(sub, id);
        res.status(200).json(order);
    } catch (error) {
        if (HTTPError.isHttpError(error)) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({
            message: 'Internal Server Error, contact Support'
        });
    }
});


/**
 * @swagger
 * /orders/:id:
 *   patch:
 *     tags:
 *     - orders
 *     security:
 *       - bearerAuth: []
 *     description: Get Order
 *     parameters:
 *      - in: path
 *        name: id
 *        description: Mongo ID or Slug
 *      - in: body
 *        name: orderInfo
 *        description: Info update.
 *        schema:
 *          type: object
 *          $ref: '#/parameters/orderInfo'
 *     responses:
 *       201:
 *         description: Success Response.
 *         schema:
 *           type: object
 *           $ref: '#/definitions/order'
 *       401:
 *         description: unauthorized.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       404:
 *         description: Not found.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: internal server error.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 */
router.patch('/:id', auth.authAdminHandler, async (req, res) => {
    try {
        const { id } = req.params;
        const { state, comments, carrierInformation } = req.body
        if (!state && !carrierInformation) {
            throw new HTTPError(400, 'Body is empty');
        }
        const order = await ordersCases.updateOrder(id, state, comments, carrierInformation)
        res.status(200).json(order);
    } catch (error) {
        if (HTTPError.isHttpError(error)) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({
            message: 'Internal Server Error, contact Support'
        });
    }
});





module.exports = router;