const { verifyToken } = require('../lib').jwt
const { User, Roles } = require('../models')

const authClientHandler = async (req, res, next) => {
    const { authorization = '' } = req.headers
    const token = authorization.split(' ')[1]
    try {
        req.params.token = verifyToken(token)
        next()
    } catch (error) {
        const { message } = error
        res.status(401).json({ ok: false, message })
    }
}

const authAdminHandler = async (req, res, next) => {
    const { authorization } = req.headers
    try {
        if (!authorization) throw new Error('Token not found')
        const token = authorization.split(' ')[1]
        const userDataToken = verifyToken(token)
        const userDb = await User.findById(userDataToken.sub)
        if (!userDb)
            return res
                .status(401)
                .json({ ok: false, message: 'unauthorized user' })
        if (userDataToken.role === Roles.admin && userDb.role === Roles.admin) {
            req.params.token = userDataToken
            next()
            return
        }
        throw new Error('unauthorized user')
    } catch (error) {
        const { message } = error
        return res.status(401).json({ ok: false, message })
    }
}

module.exports = { authClientHandler, authAdminHandler }
