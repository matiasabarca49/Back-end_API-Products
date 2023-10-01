const render = (cart)=>{
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
const finishPurchase = async ()=>{
    const resUser = await fetch(`http://localhost:8080/api/sessions/current`)
    const user = await resUser.json()
    const dateAtMomentPurchase = new Date()
    const finalCart = {
        dateCart: `${dateAtMomentPurchase.getDate()}/${dateAtMomentPurchase.getMonth()+1}/${dateAtMomentPurchase.getFullYear()}`,
        products: user.currentUser.cart
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
    //Generamos la compra en el usuario
    const resPurchase = await fetch(`http://localhost:8080/api/carts/${newCartAdded.cart._id}/purchase`)
    const ticket = await resPurchase.json()
    console.log(ticket)
    localStorage.setItem("purchased", true)
    setTimeout(()=>{
        window.location.href= "http://localhost:8080/products"
    },10000)
}



/**
 *  Algoritmo Principal 
**/

let user

fetch('http://localhost:8080/api/sessions/current')
    .then( res => res.json())
    .then( data => {
        user = data.currentUser
        render(user.cart)
    })

const toPay = document.getElementById('toPay')
toPay.addEventListener('click', ()=>{
    const processPurchase = document.getElementById('processPurchase')
    processPurchase.style.display="block"
    finishPurchase()
})