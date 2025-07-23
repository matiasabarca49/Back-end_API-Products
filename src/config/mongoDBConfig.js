const mongoose = require('mongoose')

class MongoManager{
    constructor(url){
        this.url = url
    }
        
    connect(){
        return mongoose.connect(this.url,
        {useUnifiedTopology: true, 
        useNewUrlParser: true})
            .then( connect => {
                 console.log("✅ [OK] Conexión a la DB: ÉXITO");
            })
            .catch( error => {
                console.log("🔴 [Error] Conexión a la DB: FALLÓ");
                console.log(error)
            })
    }
}


module.exports = MongoManager