const os = require('os');
const express = require("express");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const { config } = require('../lib');
const { errors } = require('../middlewares');


module.exports = class Server {
    static #_instance
    app;
    swaggerOptions = {
        swaggerDefinition: {
            swagger: "2.0",
            info: {
                title: 'Api Rest Hacer Común',
                version: '1.0.0',
            },
            host: config.app.host,
            basePath: '/',
            securityDefinitions: {
                bearerAuth: {
                    name: 'Authorization',
                    type: 'apiKey',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    in: 'header'
                }
            }
        },
        apis: ['./src/routes/*.js'], // files containing annotations as above

    };
    constructor() {
        this.app = this.#initServerApp();
    }

    #initServerApp() {
        const { logErrors, errorHandler } = errors;
        const swaggerDocs = swaggerJsDoc(this.swaggerOptions);
        const app = express();
        app.use(cors());
        app.use(express.json({
            verify: (req, res, buf) => {
                req.rawBody = buf.toString();
            }
        }));
        app.use(express.urlencoded({
            extended: true
        }));
        app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: os.tmpdir()
        }));
        app.use(methodOverride());
        app.use(logErrors);
        app.use(errorHandler);
        app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
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