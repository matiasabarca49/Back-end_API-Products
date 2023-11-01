const renderUsers = (users)=>{
    const contUsers = document.getElementById('contUsers')
    contUsers.innerText = ""
    users.forEach( user => {
        const div = document.createElement('div')
        div.className = "col-2 col-6 col-sm-4 card  mb-3 flex-grow-1 shadow"
        div.style.maxWidth = "18rem"
        div.innerHTML=  `
                    <div class="card-header bg-transparent d-flex justify-content-between align-items-center gap-3" id="contHeader${user.id}">
                        <p class="fw-light opacity-75" style="font-size: 14px; margin-bottom: 0">${user.id}</p>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title fs-4 text fw-bold">${user.name}</h5>
                        <h5 class="card-title fs-4 text fw-bold">${user.lastName}</h5>
                        <p class="card-text">${user.email}</p>
                    </div>
                    <div class="p-3 d-flex flex-column align-items-center">
                        <div class="card-footer w-100 d-flex justify-content-between align-items-center bg-transparent fs-4 text ">
                            <div>
                                Rol: ${user.rol}
                            </div>
                            <div class="fs-6 fw-light opacity-75">Age: ${user.age}</div>
                        </div>
                        <div id="changeRol${user.id}"></div>
                    </div>

        `
        //Agregar el usuario creado al DOM
        contUsers.appendChild(div)
        //Agregar boton cambiar usuario
        if(user.rol === "Premium" || user.rol === "User"){
            const btnRol = document.createElement('button')
            btnRol.className = "btn btn-outline-danger"
            btnRol.innerText = "Cambiar Rol"
            btnRol.id = `rol${user.id}`
            const btnDelete = document.createElement('button')
            btnDelete.className = "btn btn-outline-danger"
            btnDelete.innerText = "X"
            btnDelete.id=`eliminar${user.id}`
            const divRol = document.getElementById(`changeRol${user.id}`)
            divRol.appendChild(btnRol)
            const divDelete = document.getElementById(`contHeader${user.id}`)
            divDelete.appendChild(btnDelete)
            //Evento para eliminar usuarios
            const buttonUser = document.getElementById(`eliminar${user.id}`)
            buttonUser.addEventListener('click', ()=>{
                deleteProduct(user.id)
            })
            //Evento para cambiar rol de usuario
            const btn = document.getElementById(`rol${user.id}`)
            btn.addEventListener('click', ()=>{
                changeRolUser(user.id)
            })
        }
        });

}

const deleteProduct = (id) =>{
    fetch(`http://localhost:8080/api/users/${id}`,{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
    getUser()
} 

const changeRolUser = (id) => {
    fetch(`http://localhost:8080/api/users/premium/${id}`,{
        method: "PUT",
        headers:{
            "Content-Type": "aplication/json"
        }
    })
        .then(res => res.json())
        .then(data =>{
            if(data.status === "ERROR"){
                const contModal = document.getElementById('modalError')
                contModal.style.display = "block"
                setTimeout(()=>{
                    contModal.style.display = "none"
                },3000)
            }else{
                getUser()
            }
        })
}

const getUser = () =>{
    fetch("http://localhost:8080/api/users")
    .then( res => res.json())
    .then( data => {
        renderUsers(data.users)
    })
}


/**
 *   Algoritmo Principal
 * */ 


/* fetch("http://localhost:8080/api/users")
    .then( res => res.json())
    .then( data => {
        renderUsers(data.users)
    })
 */

getUser()