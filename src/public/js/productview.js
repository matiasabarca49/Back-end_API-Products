const render = (product) =>{
    const title = document.getElementById("title")
    const price = document.getElementById("price")
    const description = document.getElementById("description")
    const stock = document.getElementById("stock")
    const category = document.getElementById("category")
    title.innerText = product.title
    price.innerText = `$${product.price}`
    description.innerText = product.description
    stock.innerText = `Disponibles: ${product.stock}`
    category.innerText = product.category
}
/**
* Algoritmo Principal 
*/

//Obtenemos las query params. Obtenemos el string de Query
const url = window.location.search
//Creamos el objeto que contiene las queryparasm usando su constructor
const params = new URLSearchParams(url)
//Mediante el metodo "get" obtenemos el id para utilizarlo en el fetch
const id = params.get("id")

fetch(`http://localhost:8080/api/products/${id}`)
    .then( response => response.json())
    .then( data =>{
        //Una vez obtenido el producto, renderizamos
        render(data.producto)
    } )