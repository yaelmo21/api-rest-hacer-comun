const { HTTPError, jwt, cryptography } = require('../../lib')
const { User, Roles } = require('../../models')

const addUrl = (user, req = null) => {
    if (!req) return user
    const { protocol, headers, baseUrl } = req
    const url = `${protocol}://${headers.host}${baseUrl}/${user._id}`
    const result = { ...user._doc, url }
    console.log(result)
    return result
}

const getAll = async (req = null) => {
    const users = await User.find({}).exec()
    return users.map((user) => {
        const { firstName, lastName, email, role, url } = addUrl(user, req)
        return { firstName, lastName, email, role, url }
    })
}

const getById = async (id, req = null) => {
    const user = await User.findById(id).exec()
    const { firstName, lastName, email, role, url } = addUrl(user, req)
    return { firstName, lastName, email, role, url }
}

const update = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, { new: true }).exec()
}

const updatePersonalInfo = async (id, firstName, lastName, email) => {
    const user = await update(id, { firstName, lastName, email })
    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    }
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
