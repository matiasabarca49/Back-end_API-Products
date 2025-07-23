
const renderProducts = (array)=>{
    const contProducts = document.getElementById('products')
    contProducts.innerHTML= ""
    array.forEach(product => {
        const div = document.createElement('div')
        div.className= "product-card"
        div.style.maxWidth= "18rem"
        div.innerHTML= 
                    ` 
                            <div class="card-header">
                                <p class="card-category">${product.category}</p>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">${product.title}</h5>
                            </div>
                            <div class="card-footer"> 
                                <span class="card-price">$ ${product.price}</span>
                                <a class="btn-success" href="http://localhost:8080/products/productview?id=${product._id}">Ver Más</a>
                            </div>  
                    `
        contProducts.appendChild(div)
    });
}

//Funcion que renderiza la botonera de paginas
const renderBotonPage = (data) => {
    const pageCurrent = document.getElementById("currtPag")
    pageCurrent.innerHTML= `${data.page}`
}

//Funcion que nos pemite renderizar los elementos con paginate
const fetchProducts = (page)=>{
    //Obtenemos los productos de la pagina pasada por parametro
    fetch(`http://localhost:8080/api/products?page=${page}`)
    .then( response => response.json())
    .then( data => {
        products = data
        //Una vez obtenido los productos se llama la funcion que los renderiza en el DOM
        renderProducts(data.payload)
        renderBotonPage(data)
    })
}
const fetchProductsOpts = (opt, value)=>{
    //Obtenemos los productos de la pagina pasada por parametro
    fetch(`http://localhost:8080/api/products?${opt}=${value}`)
    .then( response => response.json())
    .then( data => {
        products = data
        //Una vez obtenido los productos se llama la funcion que los renderiza en el DOM
        renderProducts(data.payload)
        renderBotonPage(data)
    })
}

//Algoritmo Principal

const isAfterPurchase = JSON.parse(localStorage.getItem('purchased')) || false
if(isAfterPurchase){
    console.log(isAfterPurchase)
    const contModal = document.getElementById("modalAfterPurchase")
    contModal.style.display= "block"
    setTimeout(()=>{
        contModal.style.display= "none"
    }, 5000)
    localStorage.setItem("purchased", false)
}

totalProducts()

let page = 1, limit, sort, query
let products = []

fetchProducts(page)

//Evento que permite renderizar los elementos de la pagina siguiente
const nextPag = document.getElementById("nextPag")
nextPag.addEventListener("click", ()=>{
    page = products.nextPage
    //Evita que se llame la funcion si la proxima pagina es "null"
    page && fetchProducts(page)
})
//Evento que permite renderizar los elementos de la pagina anterior
const prevPag = document.getElementById("prevPag")
prevPag.addEventListener("click", ()=>{
    page = products.prevPage
    page && fetchProducts(page)
})

//Evento "Todos" los productos
const productAll = document.getElementById("productAll")
productAll.addEventListener("click", ()=>{
    fetchProductsOpts("page", 1)
})

//Eventos para orden de productos
const ordenAsc = document.getElementById("productAsc")
ordenAsc.addEventListener("click", ()=>{
    fetchProductsOpts("sort", 1)
})
const ordenDesc = document.getElementById("productDesc")
ordenDesc.addEventListener("click", ()=>{
    fetchProductsOpts("sort", -1)
})

//Evento para filtrar por categoría
const productRopa = document.getElementById("productRopa")
productRopa.addEventListener("click", ()=>{
    fetchProductsOpts("query", "Ropa")
})
const productTecno = document.getElementById("productTecno")
productTecno.addEventListener("click", ()=>{
    fetchProductsOpts("query", "Tecnología")
})
