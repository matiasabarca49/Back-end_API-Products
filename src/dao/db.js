const mongoose = require('mongoose')

class MongoManager{
    constructor(url){
        this.url = url
    }
        
    connect(){
        return mongoose.connect(this.url,
        {useUnifiedTopology: true, 
        useNewUrlParser: true})
            .then(connect => console.log("Conexion a db exitosa"))
            .catch( err => console.log(err))
    }
}


module.exports = MongoManager