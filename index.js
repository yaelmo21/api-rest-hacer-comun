const Server = require('./src/server');
const { db } = require('./src/lib');

(async function main() {
    const message = await Server.instance.start(db.connect);
    console.log(message);
})();