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
 *       user: 
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



module.exports = router;