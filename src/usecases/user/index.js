const { HTTPError, jwt, cryptography } = require('../../lib')
const { User, Roles } = require('../../models')
const { config } = require('../../lib')

const getAll = async (page = 1, limit = 10, termSearch) => {
    const query = termSearch ? { $text: { $search: termSearch } } : {}
    const users = await User.paginate(query, {
        page,
        limit,
        select: {
            firstName: 1,
            lastName: 1,
            email: 1,
            role: 1,
        },
        customLabels: {
            docs: 'users',
        },
    })
    return users
}

const getById = async (id) => {
    const select = { firstName: 1, lastName: 1, email: 1 }
    return await User.findById(id, select)
}

const update = async (id, data, select) => {
    try {
        console.log(select)
        return await User.findByIdAndUpdate(id, data, { new: true, select })
    } catch (error) {
        throw new HTTPError(400, error.message)
    }
}

const updatePersonalInfo = async (id, firstName, lastName, email) => {
    data = { firstName, lastName, email }
    return await update(id, data, Object.keys(data).join(' '))
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

const create = async (firstName, lastName, email, password, role) => {
    try {
        const hash = await cryptography.hashPassword(password)
        const data = { firstName, lastName, email, password: hash, role }
        const user = new User(data)
        const savedUser = await user.save()
        delete savedUser._doc.password
        return savedUser
    } catch (error) {
        throw new HTTPError(400, error.message)
    }
}

const createCustomer = async (firstName, lastName, email, password) => {
    const { customer } = Roles
    return await create(firstName, lastName, email, password, customer)
}

module.exports = {
    createCustomer,
    getAll,
    getById,
    login,
    renewTokenInfo,
    updatePersonalInfo,
}
