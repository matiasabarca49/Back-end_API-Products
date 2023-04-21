const fs = require('fs');

class ProductManager{
    // cont = 1;
    constructor(url){
        this.products = []; 
        this.url = url;
    }

    //Metodo privado que verifica que el producto a agregar contenga todos los campos
    #checkProduct( product ){
        //Llaves que se controlaran en el producto a agregar
        const info = ["title","description", "price", "thumbnail", "code", "stock"]
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

    addProduct(product){

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
        }  
        else{
            NotApproved && console.log( "Producto NO aprobado")
            productFound && console.log("Campo code repetido: ", productFound.code)
            console.error("NO FUE AGREADO\n========================")
            
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

    updateProduct(ID, field, NewData){
        this.#updateProducts()
        //Se verifica que exista un producto con el ID solicitado
        const aprovedId = this.products.find(product => product.id === parseFloat(ID))
        //Se verifica que el campo a modificar sea correcto
        const keys = ["title","description", "price", "thumbnail", "code", "stock"]
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

    deleteProduct(ID){
        const aprovedId = this.products.find(product => product.id === parseFloat(ID))
        if(aprovedId){
            this.#updateProducts()
            this.products = this.products.filter(  producto => producto.id !== parseFloat(ID))
            this.#writeInFile()
        }
        else{
            console.log("El ID no existe")
        }
    }

}

module.exports = ProductManager

/** 
* Algoritmo Principal 
**/

//Proceso de testing

/* const productManager = new ProductManager("./data/data.json")

console.log(productManager.getProducts())

productManager.addProduct({
    title: "producto prueba",
    description:"Este es un producto prueba",
    price:200,
    thumbnail:"Sin imagen",
    code:"abc123",
    stock:25
})
 */



