# Rest Full Api Hacer Común

## Instalaciones necesarias

-   [NodeJS 16+](https://nodejs.org/en)
-   [MongoDB](https://www.mongodb.com)

## Instalación de dependencias

El gestor de dependencias utilizado es [npm](https://www.npmjs.com/) para instalar las mismas se debe ejecutar la siguiente instrucción

```

npm install

```

## Variables de entorno

Para utilizar las variables de entorno solo se debe renombrar el archivo **.env.template** por **.env**

Las variables utilizadas son las siguientes:

| Variable                    | Descripción                                                                                                                                                                   |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| APP_PORT                    | Puerto escucha del servidor express                                                                                                                                           |
| APP_DB_USER                 | Usuario de base de datos (MongoDb)                                                                                                                                            |
| APP_DB_PASSWORD             | Contraseña del usuario de base de datos (MongoDb)                                                                                                                             |
| APP_DB_HOST                 | Nombre de dominio o dirección ip del servidor de base de datos (Mongodb)                                                                                                      |
| APP_DB_NAME                 | Nombre de la base de datos (Mongodb)                                                                                                                                          |
| APP_SECRET                  | Clave o semilla para cifrar los JWT                                                                                                                                           |
| APP_HOST                    | Url del Api Rest                                                                                                                                                              |
| APP_TAX_RATE                | Tasa de impuesto de la orden                                                                                                                                                  |
| CLOUDINARY_URL              | Crendenciales de [Cloudinary](https://cloudinary.com)                                                                                                                         |
| SENDGRID_API_KEY            | Crendenciales de [SendGrid](https://sendgrid.com)                                                                                                                         |

## Comandos del servidor

La siguiente tabla muestra los comandos que se encuentran en el archivo package.json, para ejecutar cada uno de los mismos se debe escribir npm run dev [nombre del comando].

Ejemplo

`npm run dev`

| Comando       | Descripción                                                                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dev           | inicializa el servidor en modo de desarrollo.                                                                                                                                   |
| start         | Ejecuta el servidor en modo de producción.                                                                                                                                      |

## Documentación Swagger

Para acceder a la documentación es necesario inicializar el servidor en modo de desarrollo o por medio del url de producción

-   local: **localhost:[port]/docs**
-   Producción: [https://api-rest-hacer-comun-production.up.railway.app/docs](https://api-rest-hacer-comun-production.up.railway.app/docs)

## Probar el servicio

[https://api-rest-hacer-comun-production.up.railway.app](https://api-rest-hacer-comun-production.up.railway.app)
