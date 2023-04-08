const router = require("express").Router();
const productCases = require('../usecases/product');
const { auth } = require('../middlewares');
const { HTTPError } = require('../lib');


/**
 * @swagger
 * definitions:
 *   product:
 *     properties:
 *       title: 
 *         type: string
 *       description: 
 *         type: string
 *       images: 
 *         type: array
 *         items: 
 *           type: string  
 *       inStock: 
 *         type: number
 *       price: 
 *         type: number
 *       isActive: 
 *         type: boolean
 *       sizes: 
 *         type: array
 *         items: 
 *           type: string
 *       slug: 
 *         type: string
 *       tags: 
 *         type: array
 *         items: 
 *           type: string
 *       _id: 
 *         type: string
 *       createdAt: 
 *         type: string
 *         format: date-time
 *       updatedAt: 
 *         type: string
 *         format: date-time
 *       url: 
 *         type: string
 *       __v: 
 *         type: number
 */


/**
 * @swagger
 * parameters:
 *   product:
 *     required:
 *       - title
 *       - description
 *       - inStock
 *       - price
 *       - slug
 *     properties:
 *       title: 
 *         type: string
 *       description: 
 *         type: string
 *       images: 
 *         type: array
 *         items: 
 *       inStock: 
 *         type: number
 *       price: 
 *         type: number
 *       isActive: 
 *         type: boolean
 *       sizes: 
 *         type: array
 *         items: 
 *           type: string
 *       slug: 
 *         type: string
 *       tags: 
 *         type: array
 *         items: 
 *           type: string
 *       createdAt: 
 *         type: string
 *         format: date-time
 *       updatedAt: 
 *         type: string
 *         format: date-time
 *       __v: 
 *         type: number
 */




/**
 * @swagger
 * /products/:
 *   get:
 *     tags:
 *     - products
 *     description: Get All Products
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
 *               $ref: '#/definitions/product'
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
 *         description: internal server error.
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
});



/**
 * @swagger
 * /products:
 *   post:
 *     tags:
 *     - products
 *     description: Create Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: product
 *         description: Product Create.
 *         schema:
 *           type: object
 *           $ref: '#/parameters/product'
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
 *               $ref: '#/definitions/product'
 *       401:
 *         description: unauthorized.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       409:
 *         description: conflict register.
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
router.post('/', auth.authAdminHandler, async (req, resp) => {
    const body = req.body;
    try {
        const product = await productCases.createProduct(body);
        resp.status(201).json({
            ok: true,
            product
        });
    }
    catch (error) {
        if (HTTPError.isHttpError(error)) {
            return resp.status(error.statusCode).json({ message: error.message });
        }
        return resp.status(500).json({
            message: 'Internal Server Error, contact Support'
        });
    }
});

/**
 * @swagger
 * /products/:id:
 *   get:
 *     tags:
 *     - products
 *     description: Get Product
 *     parameters:
 *      - in: path
 *        name: id
 *        description: Mongo ID or Slug
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
 *               $ref: '#/definitions/product'
 *       401:
 *         description: unauthorized.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       409:
 *         description: conflict register.
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
router.get('/:id', async (req, resp) => {
    const { id } = req.params;
    try {
        const product = await productCases.getProduct(id);
        resp.status(200).json({
            ok: true,
            product
        });
    }
    catch (error) {
        if (HTTPError.isHttpError(error)) {
            return resp.status(error.statusCode).json({ message: error.message });
        }
        return resp.status(500).json({
            message: 'Internal Server Error, contact Support'
        });
    }
});


/**
 * @swagger
 * /products/:id/image:
 *   post:
 *     tags:
 *     - products
 *     description: Get Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: id
 *        description: Mongo ID
 *      - in: formData 
 *        name: image
 *        description: image product
 *        required: true
 *        type: file
 *     responses:
 *       201:
 *         description: Success Response.
 *         schema:
 *           type: object
 *           properties:
 *             ok:
 *               type: boolean
 *             url:
 *               type: string
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
router.post('/:id/image', auth.authAdminHandler, async (req, resp) => {
    const { id } = req.params;
    const { image } = req.files;
    const mimeTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/gif'];

    if (!mimeTypes.includes(image.mimetype)) {
        return resp.status(400).json({
            message: 'File is not image'
        });
    }
    try {
        const url = await productCases.uploadImageProduct(id, image.tempFilePath);
        resp.status(200).json({
            ok: true,
            url
        });
    }
    catch (error) {
        if (HTTPError.isHttpError(error)) {
            return resp.status(error.statusCode).json({ message: error.message });
        }
        return resp.status(500).json({
            message: 'Internal Server Error, contact Support'
        });
    }
});


/**
 * @swagger
 * /products/:id:
 *   put:
 *     tags:
 *     - products
 *     description: Create Product
 *     parameters:
 *      - in: path
 *        name: id
 *        description: Mongo ID
 *      - in: body
 *        name: product
 *        description: Product Create.
 *        schema:
 *          type: object
 *          $ref: '#/parameters/product'
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
 *               $ref: '#/definitions/product'
 *       401:
 *         description: unauthorized.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       409:
 *         description: conflict register.
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
router.put('/:id', auth.authAdminHandler, async (req, resp) => {
    const { id } = req.params;
    const product = req.body;
    try {
        const productDb = await productCases.updateProduct(id, product)
        resp.status(200).json({
            ok: true,
            product: productDb
        });
    }
    catch (error) {
        if (HTTPError.isHttpError(error)) {
            return resp.status(error.statusCode).json({ message: error.message });
        }
        return resp.status(500).json({
            message: 'Internal Server Error, contact Support'
        });
    }
});


/**
 * @swagger
 * /products/:id:
 *   delete:
 *     tags:
 *     - products
 *     description: Create Product
 *     parameters:
 *      - in: path
 *        name: id
 *        description: Mongo ID
 *     responses:
 *       201:
 *         description: Success Response.
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
 *       409:
 *         description: conflict register.
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
router.delete('/:id', auth.authAdminHandler, async (req, resp) => {
    const { id } = req.params;
    try {
        await productCases.deactivateProduct(id)
        resp.status(200).json({
            ok: true,
            message: 'Product isActive false'
        });
    }
    catch (error) {
        if (HTTPError.isHttpError(error)) {
            return resp.status(error.statusCode).json({ message: error.message });
        }
        return resp.status(500).json({
            message: 'Internal Server Error, contact Support'
        });
    }
});


module.exports = router;