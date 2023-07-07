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
                const userData = req.body
                const userFound = await serviceMongo.getDocumentsByFilter(User, {email: userData.email})
                if(userFound){
                    done(null, false)
                }
                else{
                    userData.rol = "User"
                    userData.password = createHash(userData.password)
                    const userAdded = await serviceMongo.createNewDocument(User, userData)
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
                const userData = req.body
                const userFound = await serviceMongo.getDocumentsByFilter(User, {email: userData.email })
                if(userFound){
                    const checkPassword = isValidPassword(userFound, userData.password)
                    checkPassword ? done(null, userFound) : done(null, false)
                }
                else{
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