const router = require("express").Router();
const productCases = require('../usecases/product');
const { HTTPError } = require('../lib');

/**
 * @swagger
 * /products/:
 *   get:
 *     tags:
 *     - products
 *     description: Login User App
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
 *            products: 
 *             type: array
 *             items: 
 *               type: object
 *               properties: 
 *                 _id: 
 *                   type: string
 *                 title: 
 *                   type: string
 *                 description: 
 *                   type: string
 *                 images: 
 *                   type: array
 *                   items: 
 *                     type: string
 *                 inStock: 
 *                   type: number
 *                 price: 
 *                   type: number
 *                 sizes: 
 *                   type: array
 *                   items: 
 *                     type: string
 *                 slug: 
 *                   type: string
 *                 tags: 
 *                   type: array
 *                   items: 
 *                     type: string
 *                 __v: 
 *                   type: number
 *                 createdAt: 
 *                   type: string
 *                   format: date-time
 *                 updatedAt: 
 *                   type: string
 *                   format: date-time
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
router.get('/', async (req, resp) => {
    const { page, limit, termSearch } = req.query;
    try {
        const response = await productCases.getProducts(page, limit, termSearch);
        resp.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error, contact Support'
        });
    }
})
module.exports = router;