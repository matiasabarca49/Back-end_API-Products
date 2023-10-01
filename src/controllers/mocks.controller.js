const { generateProducts } = require('../utils/utils.js')

const getMockProducts = (req,res)=>{
    let productsMock = generateProducts(100)
    productsMock
        ?   res.status(200).send({status: "Succesfull",Products: productsMock})
        :   res.status(500).send({status: "ERROR", reason: "Falló el servidor"})
}

module.exports= {
    getMockProducts
}