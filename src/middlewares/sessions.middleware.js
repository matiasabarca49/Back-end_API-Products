//Check Login
function checkLogin(req, res, next){
    if(req.session.user){
        next()
    }
    else{
        res.redirect("/api/sessions/login")
    }
}

function voidLogAndRegis(req, res, next){
    if(req.session.user){
        res.redirect("/api/sessions/perfil")
    }
    else{
        next()
    }
}

module.exports = {
    checkLogin,
    voidLogAndRegis
}