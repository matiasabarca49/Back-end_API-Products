const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const PersistController = require('../dao/mongo/persistController.js')
const { createHash, isValidPassword } = require('../utils/utils.js')
const User = require('../model/usersModels.js')
const UserDTO = require('../dto/user.dto.js')
//Controladora Persistencia
const persistController = new PersistController()
//Users Service
const UsersService = require('../service/mongo/users.service.js')
const usersService = new UsersService()

const initializePassport = () =>{
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async (req, username, password, done) => {
            const { name, lastName, age, email} = req.body
            //Verificamos que no falte ningun campo si no frenamos la operacion
            if(!name || !lastName || !age || !email || !req.body.password) done({status: "ERROR", reason: "Campos erronéos o faltantes"})
            try {
                //Verificamos si el usuario existe en la DB 
                const userFound = await persistController.getDocumentsByFilter(User, {email: email})
                //En caso de que el usuario exista. Frenamos la operacion, redirigimos e indicamos que ya existe
                if(userFound){
                    done(null, false)
                }
                else{
                    //Si no existe, lo creamos formateado con DTO. Le asignamos el Rol y al password lo segurizamos
                    const userData = new UserDTO(req.body)
                    //Se agrega a la DB el nuevo user
                    const userAdded = await persistController.createNewDocument(User, userData)
                    //Salimos y devolvemos el usuario creado
                    done(null, userAdded)
                }

            } catch (error) {
                console.log(error)
                done({status: "ERROR", reason: error})
            }
        }
    )),
    passport.use("login", new LocalStrategy(
        {passReqToCallback: true, usernameField: "email"},
        async (req, username, password, done)=>{
            //Verificamos que no falte ningun campo si no frenamos la operacion
            if(!req.body.email || !req.body.password) done({status: "ERROR", reason: "Campos erronéos o faltantes"})
            try {
                //Verificamos si el usuario existe en la DB
                const userData = req.body
                const userFound = await persistController.getDocumentsByFilter(User, {email: userData.email })
                //Si existe, verificamos que la "password" proviniente del body, sea correcta.
                if(userFound){
                    const checkPassword = isValidPassword(userFound, userData.password)
                    /* checkPassword && await usersManager.putConnectionUser(userFound._id.toString()) */
                    checkPassword ? done(null, await usersService.putConnectionUser(userFound._id.toString())) : done(null, false)
                }
                else{
                    //En caso de que el usuario no exista o este mal las credenciales. Frenamos la operacion
                    done(null, false)
                }
            } catch (error) {
                done({status: "ERROR", reason: error})
            }
        }
    )),
    passport.serializeUser((user, done)=>{
        done(null, user._id)
    }),
    passport.deserializeUser(async (id, done)=>{
        const user = await persistController.getDocumentsByID(User, id)
        done(null, user)
    })
}

module.exports = initializePassport