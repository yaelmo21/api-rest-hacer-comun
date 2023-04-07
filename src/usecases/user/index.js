const { HTTPError, jwt, cryptography } = require('../../lib')
const { User, Roles } = require('../../models')

const getAll = async () => {
    const users = await User.find({})
    return users.map((user) => {
        const { _id, firstName, lastName, email, role } = user
        return { _id, firstName, lastName, email, role }
    })
}

const getById = async (id) => {
    const { _id, firstName, lastName, role } = await User.findById(id).lean()
    return { _id, firstName, lastName, email, role }
}

const login = async (email, password) => {
    const userDb = await User.findOne({ email }).lean()
    if (!userDb)
        throw new HTTPError(404, 'User not found, please create account')
    if (!cryptography.verifyPassword(password, userDb.password))
        throw new HTTPError(401, 'Email or password is incorrect')
    const user = {
        firstName: userDb.firstName,
        lastName: userDb.lastName,
        role: userDb.role,
    }
    const token = jwt.createToken({
        sub: userDb._id,
        role: userDb.role,
    })

    return { user, token }
}

const renewTokenInfo = async (userId) => {
    const userDb = await getById(userId)
    if (!userDb) throw new HTTPError(404, 'User not found')
    const user = {
        firstName: userDb.firstName,
        lastName: userDb.lastName,
        role: userDb.role,
    }
    const token = jwt.createToken({
        sub: userDb._id,
        role: userDb.role,
    })
    return { user, token }
}

const create = async (
    firstName,
    lastName,
    email,
    password,
    role = Roles.customer
) => {
    const hash = await cryptography.hashPassword(password)
    const user = new User({ firstName, lastName, email, password: hash, role })
    const savedUser = await user.save()
    return {
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
    }
}

module.exports = {
    getAll,
    getById,
    login,
    renewTokenInfo,
    create,
}
