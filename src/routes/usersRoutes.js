const router = require('express').Router()
const { auth } = require('../middlewares')
const { HTTPError } = require('../lib')
const usersCases = require('../usecases/user')

/**
 * @swagger
 * /users:
 *  post:
 *    tags:
 *      - users
 *    description: Create a new user with client role
 *    parameters:
 *      - in: body
 *        name: firstName
 *        description: First name of user
 *      - in: body
 *        name: lastName
 *        description: Last name of user
 *      - in: body
 *        name: email
 *        description: E-mail of user
 *      - in: body
 *        name: password
 *        description: Password of user
 *      responses:
 *        201:
 *          description: User created
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              email:
 *                type: string
 *              token:
 *                type: string
 *        500:
 *          description: Internal Server Error
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 */
router.post('/', async (req, res) => {
    const { firstName, lastName, email, password } = req.body

    try {
        const user = await usersCases.create(
            firstName,
            lastName,
            email,
            password
        )
        const { token } = await usersCases.login(email, password)
        res.status(201).json({ ...user, token })
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
 */

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
        const { userId } = req.params.token
        const result = await usersCases.renewTokenInfo(userId)
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
