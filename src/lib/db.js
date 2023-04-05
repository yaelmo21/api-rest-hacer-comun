const mongoose = require("mongoose");
const config = require("./config");

const connect = () => {
    return new Promise(async (resolve, reject) => {
        const { user, password, host, name } = config.db;
        mongoose.connect(
            `mongodb+srv://${user}:${password}@${host}/${name}?retryWrites=true&w=majority`
        );

        const db = mongoose.connection;

        db.on("connected", () => {
            console.log("Connection successful 😀");
            resolve(mongoose);
        });

        db.on("error", (err) => {
            console.error("Connection failed 😞", err);
            reject(err);
        });
    });
};

module.exports = { connect };