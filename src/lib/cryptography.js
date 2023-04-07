const { hash, compare } = require('bcrypt')

const hashPassword = async (password) => await hash(password, 12)

const verifyPassword = async (password, hash) => await compare(password, hash)

module.exports = { hashPassword, verifyPassword }
