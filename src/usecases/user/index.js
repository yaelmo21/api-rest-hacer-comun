const { HTTPError, jwt, cryptography } = require('../../lib');
const { User, Roles } = require('../../models');
const { config } = require('../../lib');

const addUrl = (user) => {
    const url = `${config.app.host}/users/${user._id}`;
    const result = { ...user._doc, url }
    return result
}

const getAll = async (page = 1, limit = 10, termSearch) => {
    const query = termSearch ? { $text: { $search: termSearch } } : {};
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
        }
    });
    return users;
}

const getById = async (id) => {
    const user = await User.findById(id);
    return user;
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
    role,
) => {
    const hash = await cryptography.hashPassword(password)
    const user = new User({ firstName, lastName, email, password: hash, role })
    const savedUser = await user.save()
    const result = addUrl(savedUser);
    return {
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        role: result.role,
        url: result.url,
    }
}

const createCustomer = async (
    firstName,
    lastName,
    email,
    password,
) => {
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
