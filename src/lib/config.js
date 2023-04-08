const { APP_PORT, APP_DB_HOST, APP_DB_PASSWORD, APP_DB_USER, APP_DB_NAME, APP_SECRET, NODE_ENV, CLOUDINARY_URL, APP_HOST } =
    process.env;

const config = {
    app: {
        port: APP_PORT || process.env.PORT || 3000,
        secret: APP_SECRET,
        node_env: NODE_ENV,
        cloudinary_url: CLOUDINARY_URL,
        host: APP_HOST
    },
    db: {
        user: APP_DB_USER,
        password: APP_DB_PASSWORD,
        host: APP_DB_HOST,
        name: APP_DB_NAME
    },
};

module.exports = config