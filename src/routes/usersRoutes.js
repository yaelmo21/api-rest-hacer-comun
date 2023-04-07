const router = require('express').Router()
const { auth } = require('../middlewares')
const { HTTPError } = require('../lib')
const usersCases = require('../usecases/user')

/**
 * @swagger
 * /users/auth:
 *   post:
 *     tags:
 *     - users
 *     description: Login User App
 *     parameters:
 *      - in: body
 *        name: email
 *        description: Email Account
 *      - in: body
 *        name: password
 *        description: Password account
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
 *   post:
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