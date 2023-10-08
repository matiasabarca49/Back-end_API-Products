# Repositorio de API Productos - Users - Mensajes

Es una API que permite la obtención y administracion de productos para un market como tambien la obtención de los carritos de la DB. La app Utiliza MongoDB y es Server Side Rendering.  
Para el Front-end, es utilizado Handlebars. Cuenta con vista de productos en DB, Tienda, Login, Register y Chat de mensajes.

Conceptos utilizados: NodeJS, Express, MongoDB, Mongoose, Paginate, Passport-local, Passport-Github, Custom Errors, Patrón MVC, DAO, Loggers, Swagger, TDD, BDD.  
Estilado: Bootstrap y CSS

NOTA: Sin las variables de entorno no podrá iniciar el servidor.

## Instalación y puesta en marcha
###### Requisitos para la instalación:

- **Node.js** Entorno de ejecucion.
- **NPM** Para instalar las librerías necesarias
- **Terminal Linux/cmd Windows** Para su instalación

Node.js se puede descargar de su página oficial -> https://nodejs.org/en
El paquete de instalación de Node.js tambien instala la herramienta **npm**

En linux se puede instalar mediante la ejecución del comando:

```
sudo apt install nodejs
```

Para descargar la ultima version de npm, en una terminal podemos ejecutar:

```
npm install -g npm
npm install -g npm@latest
```
NOTA: Es posible que se requiera permisos de administrador para ejecutar los comandos anteriores

## Descarga o clonación del repositorio

Se puede descargar desde el propio Github en el apartado -> code-> Donwload ZIP o mediante el comando de clonación en una terminal:

```
git clone https://github.com/matiasabarca49/Back-end_API-Products.git
```

## Instalación

Para instalar las librerias necesarias, ingresamos al directorio una vez realizada la descompresión del ZIP y ejecutamos el siguiente comando:
```
npm install
```
Es necesario tener instalado nodemon para poder ejecutar la aplicación. Esta herramienta nos permite reiniciar la aplicacion cada vez que se guardan los cambios. Para instalar:

```
npm install nodemon
```

Una vez instalados todas las libreriasa necesarias, ejecutamos la aplicacion con el siguiente comando:

```
npm start
```

Con "npm start" el servidor iniciará en modo desarrollo y el puerto utilizado será el "8080". Las opciones que pude establecer son:

- **--mode** --mode production o --mode development
- **-p** numero de puerto. Por defecto "8080"  
Ej: 

=> nodemon ./src/app.js -p 9090  
=> node ./src/app.js -p 9090  
=> node ./src/app.js -p 9090 --mode development

## Acceso

El acceso se realiza mediante el navegador. 

 - En local a través de la dirección -> http://localhost:8080
 - En dispositivos de la red -> http://IP_Server:8080

La API ofrece un mocks de productos en => http://IP_Server:8080/mockingproducts  

La documentacion se encuentran en => http://IP_Server:8080/apidocs