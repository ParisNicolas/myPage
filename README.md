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
 4. **Port**: Puerto donde correra el servidor
 5. **Admin**: Nombre del usuario designado como admin
 6. **Admin_password**: Hash de contraseña para el admin generado por [bcrypt](https://bcrypt.online/)
 7. **Family**: Lista de nombres de usuario de familiares (accesos especiales)

> Esta configuracion puede variar con el tiempo


## Documentacion

### Rutas:

| Ruta                                | Método HTTP | Descripción                                |
|-------------------------------------|-------------|--------------------------------------------|
| `/`      			                  | GET         | Envia un  ok.                              |
| `/check`      			          | GET         | Testeo de token.                           |
| `/signUp`                           | POST        | Logearse con un usuario.                   |
| `/signIn`                           | POST        | Registra un nuevo usuario.                 |
| `/deleteUser/:username`             | DELETE      | Elimina un usuario.                        |
| `/storage/files`                    | GET         | Muestra las carpetas disponibles           |
| `/storage/files/:folder/:path(*)?`  | GET         | Obtiene el contenido de una ruta.          |
| `/storage/details/:folder/:path(*)?`| GET         | Obtiene detalles de un archivo/carpeta.    |
| `/storage/dowload/:folder/:path(*)` | GET         | Descarga un archivo/carpeta.               |
| `/storage/upload/:folder/:path(*)?` | POST        | Sube un archivo en la ruta especificada.   |
| `/storage/delete/:folder/:path(*)`  | DELETE      | Elimina un archivo/carpeta.                |
| `/storage/folder/:folder/:path(*)?` | POST        | Crea una carpeta en la ruta especificada.  |
| `/storage/rename/:folder/:path(*)`  | PATCH       | Renombra un archivo/carpeta.               |

### signUp:
**Body:**
`{"username": "Carlos", "password":"123"}`

**Error Responses:**
`{"message":"El nombre no puede ser mayor que 20 caracteres"}`
`{"message":"La contraseña no puede ser menor que 4 caracteres"}`
`{"message":"La contraseña no puede ser mayor que 20 caracteres"}`
`{"message":"La contraseña no puede contener espacios"}`
`{"message":  "El usuario ya existe"}`

**Successful Response:**
`{"token": "token here ..."}`

### signIn:
**Body:**
`{"username": "Carlos", "password":"123"}`

**Error Responses:**
`{message:  "Contraseña incorrecta para: "+username}`
`{message:  "Usuario no encontrado"}`
`{message:  "Contraseña incorrecta"}`
`{"message":"La contraseña no puede contener espacios"}`
`{"message":  "El usuario ya existe"}`

**Successful Response:**
`{"token": "token here ..."}`