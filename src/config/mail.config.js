const nodemailer = require('nodemailer')

//Crear transporter para enviar mails
let transporter = {};
if(!process.env.GMAIL_CREDENTIAL_USER && !process.env.GMAIL_CREDENTIAL_TOKEN){
    console.log("=================================================")
    console.log("⚠️ [Info] Envío de emails desactivado")
    console.log("Faltan Credenciales")
    console.log("=================================================")
}else{

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
    transporter
}