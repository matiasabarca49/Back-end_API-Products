const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const ServiceMongo = require('../dao/dbService.js')
const { createHash, isValidPassword } = require('../utils/utils.js')
const User = require('../dao/models/usersModels.js')

const serviceMongo = new ServiceMongo()

const initializePassport = () =>{
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async (req, username, password, done) => {
            try {
                //El usuario pasado por el form(body) lo guardamos en una variable
                const userData = req.body
                //Verificamos si el usuario existe en la DB 
                const userFound = await serviceMongo.getDocumentsByFilter(User, {email: userData.email})
                //En caso de que el usuario exista. Frenamos la operacion, redirigimos e indicamos que ya existe
                if(userFound){
                    done(null, false)
                }
                else{
                    //Si no existe, lo creamos. Le asignamos el Rol y al password lo segurizamos
                    userData.rol = "User"
                    userData.password = createHash(userData.password)
                    //Se agrega a la DB el nuevo user
                    const userAdded = await serviceMongo.createNewDocument(User, userData)
                    //Salimos y devolvemos el usuario creado
                    done(null, userAdded)
                }

            } catch (error) {
                done({status: "ERROR", reason: error})
            }
        }
    )),
    passport.use("login", new LocalStrategy(
        {passReqToCallback: true, usernameField: "email"},
        async (req, username, password, done)=>{
            try {
                //Verificamos si el usuario existe en la DB
                const userData = req.body
                const userFound = await serviceMongo.getDocumentsByFilter(User, {email: userData.email })
                //Si existe, verificamos que la "password" proviniente del body, sea correcta.
                if(userFound){
                    const checkPassword = isValidPassword(userFound, userData.password)
                    checkPassword ? done(null, userFound) : done(null, false)
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
        const user = await serviceMongo.getDocumentsByID(User, id)
        done(null, user)
    })
}

module.exports = initializePassport