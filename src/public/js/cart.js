const addToCart = async (product)=>{
    try{
        const resUser = await fetch(`http://localhost:8080/api/sessions/current`)
        const user = await resUser.json()
        //Los usuarios no pueden agregar sus propios productos
        if(user.currentUser.email === product.owner){
            const modal = document.getElementById("modalWarningRolUser")
            modal.style.display = "block"
            setTimeout(()=>{
                modal.style.display = "none"
            },7000)
        }else{
            const resToProductSended = await fetch(`http://localhost:8080/api/users/addcart`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product)
            })
            const data = resToProductSended.json()
            totalProducts()
        }

    }
    catch(error){
        console.log(error)
    }
}

const totalProducts = async ()=>{
    let cant
    try{
        const resUser = await fetch(`http://localhost:8080/api/sessions/current`)
        const user = await resUser.json()
        cant = user.currentUser.cart.reduce((acumlador, product) => acumlador + product.quantity, 0)
    }
    catch{
        cant = 0
    }
    const totalCountNav = document.getElementById("totalCountNav")
    totalCountNav.innerText = cant
}



