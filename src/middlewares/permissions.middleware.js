const checkPermAdmin = (req, res ,next) =>{
    if(req.session.rol === "Admin"){
        next()
    }
    else{
        res.status(401).send({status: "Error", reason: "no autorizado"})
    }
}

function checkPermAdminAndPremium(req, res, next){
    if(req.session.rol === "Admin" || req.session.rol === "Premium"){
        next()
    }
    else{
        res.status(401).send({status: "Error", reason: "no autorizado"})
    }
}

const checkPerAddProduct = (req, res ,next) => {
    if (req.session.rol === "Admin" || req.session.rol === "Premium" ){
        next()
    }
    else{
        res.send("Los usuarios comunes no puede administrar productos o no ha iniciado sesión")
    }
}

const checkPerAddCart = (req, res, next) =>{
    if(req.session.rol === "User" || req.session.rol === "Premium"){
        next()
    }
    else{
        res.status(401).send({status: "ERROR", reason: "Solo los usuarios normales y los premium pueden agregar productos al carrito"})
    }
}

const CheckPerRol = (req, res, next) =>{
    if(req.session.rol === "Admin"){
        next()
    }else{
        res.status(401).send({status: "ERROR", reason: "Solo los administradores pueden administrar a los usuarios"}) 
    }
}

const checkPerCart = (req, res, next)=>{
    if(req.session.rol === "User" || req.session.rol === "Premium"){
        next()
    }
    else if(req.session.rol === "Admin"){
        /* res.send({status: "ERROR", reason: "Solo los usuarios pueden agregar productos al carrito" }) */
        res.send("Solo los usuarios normales y los premium pueden agregar productos al carrito")
    }
    else{
        /* res.send({status: "ERROR", reason: "No está logueado" }) */
        res.redirect("/api/sessions/login")
    }
}

const checkPerChat = ( req, res, next )=> {
    if (req.session.rol === "Admin"){
        res.send("Los administradores no pueden acceder al chat")
    }
    else{
        next()
    }
}

module.exports = {
    checkPermAdmin,
    checkPermAdminAndPremium,
    checkPerAddProduct,
    checkPerAddCart,
    CheckPerRol,
    checkPerCart,
    checkPerChat
}