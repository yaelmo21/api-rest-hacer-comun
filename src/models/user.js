const mongoose = require('mongoose')
const { Schema, model } = mongoose

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
    },
    {
        timestamps: true,
    }
)

const User = mongoose.models.User || model('User', userSchema)
module.exports = { User, Roles }
