const { existsSync, mkdirSync } = require("fs");
const { join } = require("path");

global.storagePath = process.env.STORAGE;

try {
    const routes = [
         global.storagePath, 
         join(global.storagePath, '/storage'), 
         join(global.storagePath, '/thumbnails'),
         join(global.storagePath, '/logs')
    ];
    routes.map(route => existsSync(route) ? 0:mkdirSync(route));
 
 } catch (error) {
    console.error('Error al verificar/crear la ruta de almacenamiento:', error);
    process.exit(1); // Salir del proceso en caso de error
 }