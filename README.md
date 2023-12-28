# Bienvenidos a mi pagina
Esta pagina tiene com objetivo recopilar mis conocimientos hacerca de Full Stack Web Developer.
Ademas de funcionar como un servidor multiuso para el hogar.

**Cuenta con las siguientes funcionalidades:**
 - Almacenamiento en la nube local
 - Gestion de fotos y archivos para diferentes usuarios
 - Administracion y control remoto de pc
 - Portafolio personal
 - Servidor para juego online

## Tecnologias

###  Frontend | Client Side
 - React
 - Bootstrap

###  Backend | Server
 - Node.js
 - Express
 - JWT
 - MongoDB

## Configuracion
Dentro del servidor puedes configurar algunos parametros:

    SECRET=miSecret34235
    STORAGE=D:\JUAN\server\files
    MONGODB_URI=mongodb://127.0.0.1:27017/myPage
    PORT=5000

    ADMIN=juan
    ADMIN_PASSWORD=$2a$10$Jo.otEwrL4F8aAtEH8Jqae7HINkBBknPcVqhjqsz.dpCfqWEuF..y
    FAMILY=juan,marcos,anatolia,pedro

 1. **Secret**: Una clave de seguridad para manejar los tokens de autorizacion
 2. **Storage**: Ruta completa hacia la carpeta donde el servidor guardara los datos
 3. **Mongodb_uri**: URL de la base de datos de mongodb (puede ser de Mongo Atlas)
 4. **Port**: Puerdo donde correra el servidor
 5. **Admin**: Nombre del usuario designado como admin
 6. **Admin_password**: Hash de contraseña para el admin generado por [bcrypt](https://bcrypt.online/)
 7. **Family**: Lista de nombres de usuario de familiares (accesos especiales)

> Esta configuracion puede variar con el tiempo
