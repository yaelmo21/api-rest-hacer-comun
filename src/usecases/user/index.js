const { HTTPError, jwt, cryptography, mail } = require('../../lib')
const { User, Roles } = require('../../models')
const { app } = require('../../lib').config

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
            isActive: 1,
        },
        customLabels: {
            docs: 'users',
        },
    })
    return users
}

const getById = async (id) => {
    const select = { firstName: 1, lastName: 1, email: 1, isActive: 1 }
    return await User.findById(id, select)
}

const update = async (id, firstName, lastName, email, role) => {
    const data = { firstName, lastName, email, role }
    const select = Object.keys(data).join(' ')
    try {
        return await User.findByIdAndUpdate(id, data, { new: true, select })
    } catch (error) {
        throw new HTTPError(400, error.message)
    }
}

const login = async (email, password) => {
    const userDb = await User.findOne({ email }).lean()
    if (!userDb)
        throw new HTTPError(404, 'User not found, please create account')
    if (!userDb.isActive) throw new HTTPError(401, 'User account is not active')
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

const sendActivationEmail = async (email, firstName, activationCode) => {
    // TODO: replace backend URL by frontend URL
    const url = `${app.host}/users/activate/${activationCode}`
    const textMsg = `Hola ${firstName},
    
    Gracias por registrarte. Por favor da click en el siguiente enlace para activar tu cuenta:
    ${url}

    Si no puedes dar click, copia y pega el enlace en tu navegador
    `

    const htmlMsg = `<p>Hola ${firstName},</p>
    <p>Gracias por registrarte. Por favor da click <strong><a href="${url}">aquí</a></strong> para activar tu cuenta</p>
    <p>Si no puedes dar click, copia y pega el siguiente enlace en tu navegador: ${url}</p>
    `
    await mail.send(email, 'Bienvenido a Hacer Común', textMsg, htmlMsg)
}

const create = async (firstName, lastName, email, password, role) => {
    try {
        const hash = await cryptography.hashPassword(password)
        const data = { firstName, lastName, email, password: hash, role }
        const user = new User(data)
        const savedUser = await user.save()

        await sendActivationEmail(email, firstName, savedUser.activationCode)

        delete savedUser._doc.password
        delete savedUser._doc.activationCode

        return savedUser
    } catch (error) {
        throw new HTTPError(400, error.message)
    }
}

const createCustomer = async (firstName, lastName, email, password) => {
    const { customer } = Roles
    return await create(firstName, lastName, email, password, customer)
}

const activate = async (activationCode) => {
    const user = await User.findOne({ activationCode })
    if (!user) throw new HTTPError(404, 'Invalid activation code')
    if (user.isActive) throw new HTTPError(400, 'Activation code has expired')
    user.isActive = true
    return await user.save()
}

module.exports = {
    activate,
    createCustomer,
    getAll,
    getById,
    login,
    renewTokenInfo,
    update,
}
