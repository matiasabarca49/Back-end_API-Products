const render = ()=>{
    cart.forEach(product => {
        const div = document.createElement("div")
        div.classList = "mx-auto py-1 w-75"
        div.innerHTML = `  
                <div class="mx-auto d-flex justify-content-center align-items-center gap-5 w-75">
                    <div class="col-2 col-6 col-sm-4 card" style="width: 70%;">
                        <div class="card-header bg-transparent ">
                            <p class="card-text"><small class="text-body-secondary">${product.product.category}</small>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title fs-3 fw-bold">${product.product.title}</h5>
                            <p class="fs-5 text-body-tertiary">Cantidad: ${product.quantity}</p
                        </div>
                    </div>
                    <div class="card-footer bg-transparent fs-6">$${product.product.price} x ${product.quantity}</div>
                </div>
                <div class="fs-3 fw-bold text-center w-25"> $${product.product.price * product.quantity}</div>
        `
        cartCont.appendChild(div)
        const total = cart.reduce((acumulador, product) => acumulador + (product.product.price * product.quantity), 0)
        const totalShopping = document.getElementById('totalShopping')
        totalShopping.innerText= `$${total}` 
    })
}

//Funcion que formatea el carrito, solo deja el ID de los productos
const reWritedForDB = (cart) =>{
    const cartReWrited = cart.map(  productCart => {
        return {
            product: productCart.product._id,
            quantity: productCart.quantity
        }
    } )
    return cartReWrited
}

//Funcion que se ejecuta al hacer click al boton pagar
const finishPurchase = async (cart)=>{
    const dateAtMomentPurchase = new Date()
    const cartReWrited = reWritedForDB(cart)
    const finalCart = {
        dateCart: `${dateAtMomentPurchase.getDate()}/${dateAtMomentPurchase.getMonth()}/${dateAtMomentPurchase.getFullYear()}`,
        products: cartReWrited
    }
    //Agregamos el carrito a la DB
    const res = await fetch('http://localhost:8080/api/carts',{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(finalCart)
    })
    const newCartAdded = await res.json()
    //Agregamos el cart al usuario
    const resAddCartToUser = await fetch('http://localhost:8080/api/users/addcart',{
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ idUser: user.passport.user, idCart: newCartAdded.cart._id})
    })
    localStorage.setItem("cart", JSON.stringify([]))
    localStorage.setItem("purchased", true)
    window.location.href= "http://localhost:8080/products"
}

/**
 *  Algoritmo Principal 
**/

const cart = JSON.parse(localStorage.getItem('cart'))
const cartCont = document.getElementById("cartCont")

render()

let user

fetch('http://localhost:8080/api/sessions/current')
    .then( res => res.json())
    .then( data => {
        user = data.currentUser
    })

const toPay = document.getElementById('toPay')
toPay.addEventListener('click', ()=>{
    const processPurchase = document.getElementById('processPurchase')
    processPurchase.style.display="block"
    finishPurchase(cart)
})