const cart = JSON.parse(localStorage.getItem('cart'))
const cartCont = document.getElementById("cartCont")
console.log(cart)
console.log("pay")
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
});