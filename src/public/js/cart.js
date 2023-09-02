const addToCart = async (product)=>{
    try{
        const resUser = await fetch(`http://localhost:8080/api/sessions/current`)
        const user = await resUser.json()
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



