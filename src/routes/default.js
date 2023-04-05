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


router.post('/seed', async (req, res) => {
    try {
        const result = await seedCase.initData();
        console.log(result)
        res.json({ message: "Seed Data complete" });
    } catch (error) {
        if (HTTPError.isHttpError(error)) {
            return res.status(error.statusCode).json({ message: error.message });
        }
    }
})



module.exports = router;