const {
    APP_PORT,
    APP_DB_HOST,
    APP_DB_PASSWORD,
    APP_DB_USER,
    APP_DB_NAME,
    APP_SECRET,
    NODE_ENV,
    CLOUDINARY_URL,
    APP_HOST,
    APP_TAX_RATE,
    SENDGRID_API_KEY,
    SENDGRID_SENDER,
    STRIPE_PRIVATE_API_KEY,
    STRIPE_PUBLIC_API_KEY,
    STRIPE_ENDPOINT_SECRET
} = process.env

const config = {
    app: {
        port: APP_PORT || process.env.PORT || 3000,
        secret: APP_SECRET,
        node_env: NODE_ENV,
        cloudinary_url: CLOUDINARY_URL,
        host: APP_HOST,
        taxRate: APP_TAX_RATE,

    },
    db: {
        user: APP_DB_USER,
        password: APP_DB_PASSWORD,
        host: APP_DB_HOST,
        name: APP_DB_NAME,
    },
    sendgrid: {
        apiKey: SENDGRID_API_KEY,
        sender: SENDGRID_SENDER,
    },
    stripe: {
        privateApiKey: STRIPE_PRIVATE_API_KEY,
        publicApiKey: STRIPE_PUBLIC_API_KEY,
        endpointSecret: STRIPE_ENDPOINT_SECRET
    }
}

module.exports = config
