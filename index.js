const Server = require('./src/server');
const { db } = require('./src/lib');

(async function main() {
    Server.instance.app.get("/", (req, res) => {
        res.json({ message: "Welcome Api Hacer Común" });
    });
    const message = await Server.instance.start(db.connect);
    console.log(message);
})();