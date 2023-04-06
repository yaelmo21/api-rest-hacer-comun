const router = require("express").Router();
const seedCase = require('../usecases/seed');
const { HTTPError } = require('../lib')

/**
 * @swagger
 * /:
 *   get:
 *     description: Welcome to Api Rest
 *     responses:
 *       200:
 *         description: Welcome Api Hacer Común.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 */
router.get("/", (req, res) => {
    res.json({ message: "Welcome Api Hacer Común" });
});



/**
 * @swagger
 * /seed:
 *   post:
 *     description: Seed data for database
 *     responses:
 *       200:
 *         description: Success Clean and Insert data.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
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
router.post('/seed', async (req, res) => {
    try {
        await seedCase.initData();
        res.json({ message: "Seed Data complete" });
    } catch (error) {
        console.log(error);
        if (HTTPError.isHttpError(error)) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({
            message: 'Internal Server Error, contact Support'
        });
    }
})



module.exports = router;