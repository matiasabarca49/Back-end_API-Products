const fs = require('fs');

class ProductsManager{
    // cont = 1;
    constructor(url){
        this.products = []; 
        this.url = url;
    }

    //Metodo privado que verifica que el producto a agregar contenga todos los campos
    #checkProduct( product ){
        //Llaves que se controlaran en el producto a agregar
        const info = ["title","description", "price", "thumbnail", "code", "stock","status","category"]
        //Se obtienen las keys del producto que se quiere agregar
        const infoInProduct = Object.keys(product)
        //Variable "productError" que nos permitirá agregar el producto o no en la base de datos
        let productError = false;
        //Se controlan las keys obligatorias con las key del producto en cuestion
        info.forEach( key => {
            const incluido = infoInProduct.includes(key)
            //En caso de que no esté incluido se utiliza la variable "productoError" para indicar el error
            if (incluido === false){
                productError = true
                console.log( `Faltan datos. El campo "${key}" en "${ product.title }" no está incluido`)
                
            }
        } );

        //Retornamos la condicion del producto. Si su agregado fue aprobado o no
        return productError;

    }

    #updateProducts(){
        try{
            this.products = JSON.parse(fs.readFileSync(this.url,'utf-8')) 
        }
        catch(err){
            console.log("El archivo no existe. Creando...")
        }
    }
    
    #writeInFile(){
        try{
            fs.writeFileSync(this.url, JSON.stringify(this.products, null, 2), 'utf-8')
        }
        catch{
            console.log("Error al escribir en archivo")
        }
    }

    postProduct(product){

        //Actualizamos el array con el archivo
        this.#updateProducts()

        const NotApproved = this.#checkProduct(product)//Verifica campos erróneos

        const productFound = this.products.find( item => item.code === product.code )

        // Se agrega a la base de datos siempre y cuando el producto no se encuentre y esté aprobado
        if ( productFound === undefined && NotApproved === false ){
            //El id es generado en base a la cantidad de productos para evitar id repetidos
            product.id = this.products.length + 1;
            this.products.push(product);
            //Sobreescribimos el archivo con el array que contiene el nuevo producto
            this.#writeInFile()
            return product
        }  
        else{
            NotApproved && console.log( "Producto NO aprobado")
            productFound && console.log("Campo code repetido: ", productFound.code)
            console.error("NO FUE AGREADO\n========================")
            return undefined
            
        }
    }

    getProducts(){
        try {
            const productsJSON = fs.readFileSync(this.url,'utf-8')
            this.products = JSON.parse(productsJSON) 
        } 
        finally{
            return this.products
        }
    }

    getProductsById(ID){
        
        this.#updateProducts()
        const productFound = this.products.find( product => product.id === parseFloat(ID) )
        return productFound ?  productFound :  "Not Found"
    }

    putProductByField(ID, field, NewData){
        this.#updateProducts()
        //Se verifica que exista un producto con el ID solicitado
        const aprovedId = this.products.find(product => product.id === parseFloat(ID))
        //Se verifica que el campo a modificar sea correcto
        const keys = ["title","description", "price", "thumbnail", "code", "stock","status","category"]
        const aprovedKeys = keys.includes(field)
        //Si el id y el campo es correcto se realizan los cambios
        if (aprovedKeys && aprovedId){
            const productoEncontrado = this.products.find( product => product.id === parseFloat(ID) )
            productoEncontrado[field] = NewData
            //Sobreescribimos el archivo con los cambios en el array
            this.#writeInFile()
        }
        else{
            console.log("El campo o ID no existe")
        }
    }

    putProduct(ID, productToChange){
        this.#updateProducts()
        const notApproved = this.#checkProduct(productToChange)
        const productFound = this.products.find( product => product.id === parseFloat(ID))
        if (!notApproved && productFound){
            //Producto actualizado que va a retornar de la funcion
            let productUpdated = {}
            //Creamos un nuevo array con el product actualizado con el metodo MAP
            const changeProducts = this.products.map(  product =>{
                if (product.id === parseFloat(ID)){
                    productToChange.id = parseFloat(ID)
                    productUpdated = productToChange
                    return productToChange
                }
                else {
                    //En caso de que el ID no coincida retornamos el producto sin cambios
                    return product
                }
            } )
            //Al array de la clase instanciada le asignamos el nuevo array con los productos actualizados
            this.products = changeProducts
            this.#writeInFile()
            return productToChange
        } else{
            //En caso de que el producto no fuera aprobado por campos errones o no concidiera se retornar un falsy
            console.log("Producto no aprobado o no existe")
            return undefined
        }
    }

    delProduct(ID){
        this.#updateProducts()
        const aprovedId = this.products.find(product => product.id === parseFloat(ID))
        if(aprovedId){
            this.products = this.products.filter(  producto => producto.id !== parseFloat(ID))
            this.#writeInFile()
            return aprovedId
        }
        else{
            console.log("El ID no existe")
            return undefined
        }
    }

}

module.exports = ProductsManager





