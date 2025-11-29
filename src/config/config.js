const dotenv = require('dotenv')
const nodemailer = require('nodemailer')
const { Command } = require('commander')
const program = new Command()

program
    .option('-d', 'Variable para debug', false)
    .option('-p <port>', 'Puerto del servidor', 8080)
    .option('--mode <mode>', 'Modo de trabajo', 'development')
program.parse();

const environment = program.opts().mode;

//Cargar variables de entorno segun el ambiente
dotenv.config({
    path:environment==="production"? "./.env": "./.env"
});
//Importar verificacion de variables de entorno
const reqVars = require("../utils/dotenv.helper.js")

//Crear transporter para enviar mails
let transporter = {};
//if(process.env.GMAIL_CREDENTIAL_USER?.trim() && process.env.GMAIL_CREDENTIAL_TOKEN?.trim()){
if(reqVars.validateEnvVars('gmail')){
    //Creando trasnporter
    transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 578,
        auth:{
            user: process.env.GMAIL_CREDENTIAL_USER,
            pass: process.env.GMAIL_CREDENTIAL_TOKEN
        }
    })

    //Verificar conexion
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log('Server is ready to take our messages');
        }
    });
}

module.exports = {
    port: program.opts().p,
    environment: environment,
    transporter
}
