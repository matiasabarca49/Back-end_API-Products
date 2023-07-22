const AddToCart = (product)=>{
    let cart =  JSON.parse(localStorage.getItem("cart"))
    const productFound = cart.find( cartProduct => cartProduct.product._id === product._id)
    if (productFound){
        productFound.quantity++
    }else{
        cart.push({product: product, quantity: 1})
    }
    console.log("agregado al carrito")
    console.log(cart)
    totalProducts(cart)
    localStorage.setItem('cart', JSON.stringify(cart))   
}

const totalProducts = (cart)=>{
    const cant = cart.reduce((acumlador, product) => acumlador + product.quantity, 0)
    console.log(cant)
    const totalCountNav = document.getElementById("totalCountNav")
    totalCountNav.innerText = cant
}

//


