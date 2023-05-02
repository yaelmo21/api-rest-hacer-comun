const { hash, compare, hashSync } = require('bcrypt')

const hashPassword = async (password) => await hash(password, 12)
const hashPasswordSync = (password) => hashSync(password, 12)

const verifyPassword = async (password, hash) => await compare(password, hash)

module.exports = { hashPassword, verifyPassword, hashPasswordSync }
