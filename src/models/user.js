const { randomUUID } = require('crypto')
const mongoose = require('mongoose')
const { Schema, model } = mongoose
const mongoosePaginate = require('mongoose-paginate-v2')
const { config } = require('../lib')

const Roles = {
    admin: 'admin',
    customer: 'client',
    superUser: 'super-user',
    seo: 'SEO',
}

const userSchema = new Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: {
                values: Object.values(Roles),
                message: '{VALUE} no es un rol valido',
                default: Roles.customer,
                required: true,
            },
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        activationCode: {
            type: Schema.Types.UUID,
            unique: true,
            default: randomUUID(),
        },
        billingId: {
            type: String
        },
    },
    {
        timestamps: true,
    }
)
userSchema.index({
    firstName: 'text',
    lastName: 'text',
    email: 'text',
    activationCode: 'text',
})
userSchema.plugin(mongoosePaginate)

userSchema.methods.toJSON = function () {
    let user = this
    let userObj = user.toObject()
    userObj.url = `${config.app.host}/users/${user._id}`
    return userObj
}

const User = mongoose.models.User || model('User', userSchema)
module.exports = { User, Roles }
