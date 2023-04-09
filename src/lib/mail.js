const sgMail = require('@sendgrid/mail')
const { apiKey, sender } = require('./config').sendgrid
const HTTPError = require('./httpError')

const send = async (to, subject, text, html) => {
    const from = sender

    try {
        sgMail.setApiKey(apiKey)
        await sgMail.send({ to, from, subject, text, html })
    } catch (error) {
        const { response } = error
        if (response) {
            const { body } = response
            throw new HTTPError(500, body)
        }
        throw new Error(error)
    }
}

module.exports = { send }
