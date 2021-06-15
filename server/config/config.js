/* jshint esversion: 8 */

// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Base de Datos
if (process.env.NODE_ENV === 'dev') {
    process.env.URLDB = "mongodb+srv://admin:3526@cluster0.4pvv9.mongodb.net/Condominios";
} else {
    process.env.URLDB = "mongodb+srv://admin:3526@cluster0.4pvv9.mongodb.net/Condominios";
}

// Declaración de array de middleweres a usar en las APIS
process.middlewares = []; //