const express = require("express");
const cors = require("cors");
const { config } = require('../lib');


module.exports = class Server {
    static #_instance
    app;
    constructor() {
        this.app = this.#initServerApp();
    }

    #initServerApp() {
        const app = express();
        app.use(cors());
        app.use(express.json());
        return app;
    }

    #startServer() {
        return new Promise((resolve, reject) => {
            const port = config.app.port;
            this.app.listen(config.app.port, () => {
                resolve(`Sever listening ${port}`)
            });
        })
    }

    static get instance() {
        return this.#_instance || (this.#_instance = new this());
    }

    async start(callback) {
        if (callback) await callback();
        const message = await this.#startServer();
        return message;
    }
}