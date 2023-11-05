/* const nodemailer = require('nodemailer') */
const { saveSecret, createHash, isValidPassword, searchSecret } = require('../utils/utils.js')
const UsersManager = require('../dao/mongo/users.mongo.js')
const usersManager = new UsersManager()
const { transporter } = require('../config/config.js')
const { generateFormatLink } = require('../utils/utils.js')

const generateLink = (user) =>{
    const key = createHash(`Cod!34fdsert${ user.email }`)
    /* const dateNow = new Date()
    const secret = `${Date.now()+dateNow.getFullYear()+Date.now()+dateNow.getMonth()+dateNow.getHours()+key}&qui=45604545rgfdt355iuiljhgfds/&>S43&filter=user&type=change&user=notFound`  */
    const secret = `${key}&qui=45604545rgfdt355iuiljhgfds/&>S43&filter=user&type=change&user=notFound` 
    saveSecret(secret)
    const mailOptionsChangePassword = {
        from: `Tienda de Productos  <${process.env.GMAIL_CREDENTIAL_USER}>`,
        to: `${user.email}`,
        subject: "Solicitud de cambio de contraseña",
        html:`
            <div>  
                <h1> Restauracion de contraseña </h1>
                <h4>Hola ${user.name}</h4>
                <p> Ingrese al siguiente link para cambiar la contraseña: </p>
                <a href="http://localhost:8080/api/sessions/generatepassword?secret=${secret}&email=${user.email}">Ir a cambiar constraseña</a>
                <p>El link para cambio de contraseña expirará en 1 hora. En ese caso deberá solicitar de nuevo</p>
                <p style="margin-top: 20px">En caso de no solicitar cambio de contraseña. Desestime este correo</p>
            </div>
        `,
        attachments: []  
    }

    return mailOptionsChangePassword
}


const sendMailPurchase = (req, res)=>{
    //Para enviar ticket de compra
    transporter.sendMail(generateFormatEmail(req.body.email, { subject: "Compra Realizada", head: "La compra fue realizada correctamente", body: `Compra realiza el "${req.body.purchase_datetime}" con código "${req.body.code}". Con email de cuenta ${req.body.purchaser}. El Total de la compra es: $${req.body.amount}`}), (error, info)=>{
        if(error){
            req.logger.error(`Peticion ${req.method} en "${"http://"+req.headers.host + "/api/mail" +req.url}" a las ${new Date().toLocaleTimeString()} el ${new Date().toLocaleDateString()}\n
            ERROR: Fallo al enviar el mail. EL error es:\n
            ${error}`)
            res.status(500).send({status: "ERROR", reason: error}) 
        }
        else{
            req.logger.info(`Mensaje enviado con éxito solicitado en el endpoint${"http://"+req.headers.host + "/api/mail" +req.url}"`)
        }
    })
    res.send("OK")
}

const sendMailRecoverPass = async (req, res)=>{
    const userMail = req.body.mail
    try {
        const userFound = await usersManager.getUserByFilter({email: userMail})
        if (userFound){
            let result = transporter.sendMail(generateLink(userFound), (error, info)=>{
                if(error){
                    req.logger.error(`Peticion ${req.method} en "${"http://"+req.headers.host + "/api/mail" +req.url}" a las ${new Date().toLocaleTimeString()} el ${new Date().toLocaleDateString()}\n
                    ERROR: Fallo al enviar el mail. EL error es:\n
                    ${error}`)
                    res.status(500).send({status: "ERROR", reason: error}) 
                }
                else{
                    req.logger.info(`Mensaje enviado con éxito solicitado en el endpoint${"http://"+req.headers.host + "/api/mail" +req.url}"`)
                    
                }
            })
        }else{
            req.logger.info("El usuario no existe en la app")
        }
        res.status(400).render('mailSended')
    } catch (error) {
        req.logger.error(`Peticion ${req.method} en "${"http://"+req.headers.host + "/api/mail/sendmailpass" +req.url}" a las ${new Date().toLocaleTimeString()} el ${new Date().toLocaleDateString()}\n
        ERROR: Fallo al enviar el mail. EL error es:\n
        ${error}`)
        res.status(500).send({status: "ERROR", reason: error})
    }
}

const changepassword =  async (req, res)=>{
    try {
        const isValid = searchSecret(req.query.secret, req.query.email)
        if (isValid === false){
            req.logger.warning("Intento de manipulacion en restauracion contraseña")
            res.status(500).send({status: "ERROR"})
        }else{
            const passwordChanged = await usersManager.putChangePasswordFromUser(req.query.email, req.body.password)
            if (passwordChanged.status){
                const userFound = await usersManager.getUserByFilter({email: req.query.email})
                let result = transporter.sendMail({
                    from: `Tienda de Productos  <${process.env.GMAIL_CREDENTIAL_USER}>`,
                    to: `${userFound.email}`,
                    subject: "Contraseña cambiada",
                    html:`
                        <div>  
                            <h1>Hola ${userFound.name}</h1>
                            <h3> Su contraseña ha sido cambiada</h3>
                            <p style="margin-top: 20px">En caso de no haya sido usted el que cambió la contraseña. Cambiela de inmediato</p>
                        </div>
                    `,
                    attachments: []  
                })
                req.logger.info(passwordChanged.reason)
                res.status(200).redirect("/api/sessions/login")
            }
            else{
                res.status(500).send({status: "ERROR", reason: passwordChanged.reason })
            } 
        }
         

    } catch{
        req.logger.warning("Intento de manipulacion en restauracion contraseña")
        res.status(500).send({status: "ERROR"})
    }
    
}


module.exports= {
    sendMailPurchase,
    sendMailRecoverPass,
    changepassword
}