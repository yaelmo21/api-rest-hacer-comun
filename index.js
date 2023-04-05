const Server = require('./src/server');
const { db } = require('./src/lib');
const apiRoutes = require('./src/routes');

(async function main() {
    Server.instance.app.use('/', apiRoutes);
    const message = await Server.instance.start(db.connect);
    console.log(message);
})();