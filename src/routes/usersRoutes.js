const router = require('express').Router()
const { auth } = require('../middlewares')
const { HTTPError } = require('../lib')
const usersCases = require('../usecases/user')
const { Roles } = require('../models')

/**
 * @swagger
 * definitions:
 *   user:
 *     properties:
 *       _id:
 *         type: string
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       role:
 *         type: string
 *       __v:
 *         type: integer
 *         format: int32
 *       createdAt:
 *         type: string
 *         format: date-time
 *       updatedAt:
 *         type: string
 *         format: date-time
 *       url:
 *         type: string
 *   userMin:
 *     properties:
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       role:
 *         type: string
 *       url:
 *         type: string
 *
 */

/**
 * @swagger
 * parameters:
 *   login:
 *     required:
 *       - email
 *       - password
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 *   user:
 *     properties:
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       email:
 *         type: string
 *       price:
 *         type: string
 *       password:
 *         type: string
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - users
 *     description: Get all users
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
 *        description: Term for search users
 *     responses:
 *         200:
 *          description: A list of users
 *          schema:
 *           type: object
 *           properties:
 *            users:
 *             type: array
 *             items:
 *               type: object
 *               $ref: '#/definitions/userMin'
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
 *         500:
 *          description: Internal Server Error
 *          schema:
 *              type: object
 *              properties:
 *                  message:
 *                      type: string
 */
router.get('/', auth.authAdminHandler, async (req, res) => {
    const { page, limit, termSearch } = req.query
    try {
        const users = await usersCases.getAll(page, limit, termSearch)
        res.status(200).json(users)
    } catch (error) {
        if (HTTPError.isHttpError(error)) {
            return res.status(error.statusCode).json({ message: error.message })
        }
        return res.status(500).json({
            message: 'Internal Server Error, contact Support',
        })
    }
})

/**
 * @swagger
 * /users/:id:
 *   get:
 *     tags:
 *     - users
 *     description: Get data of one user
 *     parameters:
 *      - in: path
 *        name: id
 *        description: Mongo ID or Slug
 *     responses:
 *       200:
 *         description: User object
 *         schema:
 *           type: object
 *           $ref: '#/definitions/user'
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
router.get('/:id', auth.authHandler, async (req, res) => {
    try {
        const { id } = req.params
        const { sub, role } = req.params.token

        if (role !== Roles.admin && sub != id) {
            throw new HTTPError(401, 'You are not authorized')
        }

        const user = await usersCases.getById(id, req)
        res.status(200).json(user)
    } catch (error) {
        if (HTTPError.isHttpError(error)) {
            return res.status(error.statusCode).json({ message: error.message })
        }
        return res.status(500).json({
            message: 'Internal Server Error, contact Support',
        })
    }
})

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *     - users
 *     description: Create a new user with client role,
 *     parameters:
 *      - in: body
 *        name: user
 *        description: User Create.
 *        schema:
 *          type: object
 *          $ref: '#/parameters/user'
 *     responses:
 *      201:
 *        description: User created
 *        schema:
 *          type: object
 *          $ref: '#/definitions/userMin'
 *      500:
 *        description: Internal Server Error
 *        schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 */
router.post('/', async (req, res) => {
    const { firstName, lastName, email, password } = req.body

    try {
        const user = await usersCases.createCustomer(
            firstName,
            lastName,
            email,
            password
        )
        const { token } = await usersCases.login(email, password)
        user._doc.token = token
        res.status(201).json(user)
    } catch (error) {
        if (HTTPError.isHttpError(error)) {
            return res
                .status(error.statusCode)
                .json({ ok: false, message: error.message })
        }
        return res.status(500).json({
            ok: false,
            message: 'Internal Server Error, contact Support',
        })
    }
})

router.patch('/:id', auth.authHandler, async (req, res) => {
    const { body, params } = req
    const { id, token } = params
    const { role: userRole, sub } = token
    const { firstName, lastName, email, role } = body
    const { admin } = Roles

    try {
        if (userRole !== admin && sub !== id) {
            const errMsg = "You're not authorized to update this user"
            throw new HTTPError(401, errMsg)
        }

        if (role && userRole !== admin) {
            throw new HTTPError(401, "You're not authorized to edit user roles")
        }

        const user = await usersCases.update(
            id,
            firstName,
            lastName,
            email,
            role
        )

        res.status(200).json(user)
    } catch (error) {
        if (HTTPError.isHttpError(error)) {
            return res
                .status(error.statusCode)
                .json({ ok: false, message: error.message })
        }
        return res.status(500).json({
            ok: false,
            message: 'Internal Server Error, contact Support',
        })
    }
})

/**
 * @swagger
 * /users/auth:
 *   post:
 *     tags:
 *     - users
 *     description: Login User App
 *     parameters:
 *      - in: body
 *        name: login
 *        schema:
 *           type: object
 *           $ref: '#/parameters/login'
 *     responses:
 *       200:
 *         description: Authenticated user.
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *              type: object
 *              properties:
 *                  firstName:
 *                      type: string
 *                  lastName:
 *                      type: string
 *                  role:
 *                      type: string
 *             token:
 *                  type: string
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
router.post('/auth', async (req, res) => {
    const { email, password } = req.body
    try {
        const result = await usersCases.login(email, password)
        res.status(200).json(result)
    } catch (error) {
        if (HTTPError.isHttpError(error)) {
            return res.status(error.statusCode).json({ message: error.message })
        }
        return res.status(500).json({
            message: 'Internal Server Error, contact Support',
        })
    }
})

/**
 * @swagger
 * /users/validate-token:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *     - users
 *     description: Validate and renew token
 *     responses:
 *       200:
 *         description: Authenticated user.
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *              type: object
 *              properties:
 *                  firstName:
 *                      type: string
 *                  lastName:
 *                      type: string
 *                  role:
 *                      type: string
 *             token:
 *                  type: string
 *       401:
 *         description: unauthorized.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       404:
 *         description: Not Found.
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
router.get('/validate-token', auth.authClientHandler, async (req, res) => {
    try {
        const { sub } = req.params.token
        const result = await usersCases.renewTokenInfo(sub)
        res.status(200).json(result)
    } catch (error) {
        if (HTTPError.isHttpError(error)) {
            return res.status(error.statusCode).json({ message: error.message })
        }
        return res.status(500).json({
            message: 'Internal Server Error, contact Support',
        })
    }
})

module.exports = router
