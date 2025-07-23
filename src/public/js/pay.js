const render = (cart)=>{
    const cartCont = document.getElementById('cartCont')
    const totalShopping = document.getElementById('totalShopping')
    const contentPay = document.getElementById('contToPay')
    cartCont.innerHTML = " "
    if( cart.length !== 0){
        cart.forEach(product => {
            const div = document.createElement("div")
            div.classList = "cart-item-container"
            div.innerHTML =         
                `
                    <div class="cart-item cart-item-content">
                    <div class="item-header">
                        <p class="item-category">${product.product.category}</p>
                        <button class="remove-btn" id="delete${product.product._id}">X</button>
                    </div>
                    <div class="item-body">
                        <h5 class="item-title">${product.product.title}</h5>
                        <p class="item-quantity">Cantidad: ${product.quantity}</p>
                    </div>
                    <div class="item-footer">
                        <div class="item-calculation">${product.product.price} x ${product.quantity}</div>
                    </div>
                    </div>
                    <div class="cart-item-total">
                        <div class="item-price">$${product.product.price * product.quantity}</div>
                    </div>
             `
            cartCont.appendChild(div)
            //Agregar Evento para eliminar producto
            const btnDelete = document.getElementById(`delete${product.product._id}`)
            btnDelete.addEventListener("click", ()=>{
                deleteProduct(product.product._id)
            })
        })
        //Total de la compra
        const total = cart.reduce((acumulador, product) => acumulador + (product.product.price * product.quantity), 0)
        totalShopping.innerText= `$${total}` 
        //crear botón para pagar
        contentPay.innerHTML = " "
        const btn = document.createElement('button')
        btn.className = "w-50 mx-auto my-3 btn btn-danger d-block"
        btn.id = "toPay"
        btn.innerText= "Pagar"
        //Evento para apagar
        btn.addEventListener('click', ()=>{
            const processPurchase = document.getElementById('processPurchase')
            processPurchase.style.display="block"
            finishPurchase()
        })
        contentPay.appendChild(btn)
    }
    else{
        cartCont.innerHTML= `<p class="p-5 mt-3 fs-2 opacity-50 text-center text-white"> - Carrito Vacio - </p>`
        totalShopping.innerText="$0"
        contentPay.innerHTML = " "
    }
    
}

const deleteProduct = async (idProduct) =>{
    const res =  await fetch(`http://localhost:8080/api/users/delete/product/${idProduct}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    })
    const resDelete = await res.json()
    getCart()
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
    const purchase = await resPurchase.json()
    //Enviamos el Ticket al mail del usuario
    purchase.ticket.email = user.currentUser.email
    const resTicket = await fetch('http://localhost:8080/api/mail/send/mail',{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(purchase.ticket)
    })
    localStorage.setItem("purchased", true)
    setTimeout(()=>{
        window.location.href= `http://localhost:8080/products/ticket?code=${purchase.ticket.code}&&cart=${newCartAdded.cart._id}`
    },5000)
}

const getCart = ()=>{
    fetch('http://localhost:8080/api/sessions/current')
    .then( res => res.json())
    .then( data => {
        user = data.currentUser
        render(user.cart)
    })
}

/**
 *  Algoritmo Principal 
**/

let user
getCart()
