//========= VARIABLES GLOBALES =========//
let USUARIOS = {
    admin: "admin123",
    usuario: "1234",
    demo: "demo"
};
let usuarioActual = null;
let peliculasGlobales = [ ];
let peliculaEnEdiccion= null;
// =========== INICIALIZACION DE APP ============ //
document.addEventListener("DOMContentLoaded", ()=>{
    eventos();
    inicializarApp();
});



function inicializarApp(){

    cargarUsuariosRegistrados();

    //verificar si hay un usuario logeado
    let userLogged = localStorage.getItem("usuarioLogueado");
    if(userLogged){
        usuarioActual = JSON.parse(userLogged);
        mostrarDashboard();
    }

//cargar datos de pelicuals de ejemplo la primera vez
    if (!localStorage.getItem("peliculas")) {
        cargarDatosEjemplo();
    }

}

function cargarUsuariosRegistrados(){
    //obtener usuarios de localstorage y agregarlo a la variable USUARIOS
    let usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados"));
    if(usuariosRegistrados){
        Object.assign(USUARIOS, usuariosRegistrados);
    }
}


function eventos (){
    // boton login
    document.querySelector("#formLogin").addEventListener("submit", login);

    // boton logout
    document.querySelector("#btnLogout").addEventListener("click", logout);

    document.querySelector("#formRegistro").addEventListener("submit", register);

     document.querySelector("#btnGuardarPelicula").addEventListener("click", guardarPelicula);


     // Evento de búsqueda
// Cuando el usuario escribe en la barra de búsqueda
document.querySelector("#inputBuscar").addEventListener("input", buscarPeliculas);

// Cuando cambia el género seleccionado
document.querySelector("#selectGenero").addEventListener("change", filtrarPorGenero);


}

function login(e){
    e.preventDefault();
    let user = document.querySelector("#inputUser").value;
    let password = document.querySelector("#inputPassword").value;

    if(USUARIOS[user] && USUARIOS[user] === password){
        usuarioActual = user;
        localStorage.setItem("usuarioLogueado", JSON.stringify(user));
        mostrarDashboard();
        document.querySelector("#formLogin").reset();
    }else{
        alert("El usuario y contraseña no son validos");
    }

}

function mostrarDashboard(){
    document.querySelector("#loginSection").style.display = "none";
    document.querySelector("#mainContent").style.display = "block";
    document.querySelector("#btnLogin").style.display = "none";
    document.querySelector("#btnLogout").style.display = "block";
    document.querySelector(".navbar-brand").textContent = usuarioActual;
     document.querySelector("#btnAgregar").style.display = "inline-block";
    cargarPeliculas();
}

function mostrarLogin(){
    document.querySelector("#loginSection").style.display = "flex";
    document.querySelector("#mainContent").style.display = "none";
    document.querySelector("#btnLogin").style.display = "block";
    document.querySelector("#btnLogout").style.display = "none";

    document.querySelector(".navbar-brand").innerHTML = '<i class="bi bi-film"></i> CineFlix';
        document.querySelector("#btnAgregar").style.display = "none";

}

function logout(){
    let confirmar = confirm("¿Deseas cerrar sesion?");
    if(confirmar){
        usuarioActual = null;
        localStorage.removeItem("usuarioLogueado");
        mostrarLogin();
        document.querySelector("#formLogin").reset();
    }
}

function register(e) {
    e.preventDefault();

    let nombre = document.querySelector("#inputNombre").value.trim();
    let email = document.querySelector("#inputEmail").value.trim();
    let usuario = document.querySelector("#inputUserReg").value.trim();
    let password = document.querySelector("#inputPasswordReg").value.trim();
    let confirmPassword = document.querySelector("#inputConfirmPassword").value.trim();

    if(!nombre || !email || !usuario || !password || !confirmPassword){
        alert("Por favor completa todos los campos");
        return;
    }

    if(USUARIOS[usuario]){
        alert("El usuario ya existe, por favor elige otro");
        return;
    }

    if(password.length < 6){
        alert("La contraseña debe contener mínimo 6 caracteres");
        return;
    }

    if(password !== confirmPassword){
        alert("Las contraseñas no coinciden");
        return;
    }

    // ✅ SOLO SI TODO ES VÁLIDO
    USUARIOS[usuario] = password;

    let usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados")) || {};
    usuariosRegistrados[usuario] = password;
    localStorage.setItem("usuariosRegistrados", JSON.stringify(usuariosRegistrados));

    alert("Usuario " + usuario + " registrado con éxito ✅, inicia sesión");

    document.querySelector("#formRegistro").reset();
    document.querySelector("#login-tab").click();
    return;
}


function cargarDatosEjemplo(){
    let peliculasEjemplo = [
        {
            id: 1,
            titulo: "Inception",
            genero: "Ciencia Ficcion",
            director: "Christopher Nolan",
            ano: 2010,
            calificacion: 8.8,
            descripcion: "Inception es una película de ciencia ficción dirigida por Christopher Nolan que sigue a Dom Cobb, un ladrón especializado en robar ideas a través de los sueños, quien recibe una misión para implantar una idea en la mente de un rival",
            imagen: "https://i.pinimg.com/originals/89/87/ce/8987ce6a44674f18846622a9cc0e9867.jpg"
        },
       
        {
            id: 2,
            titulo: "Forrest Gump",
            genero: "Drama",
            director: "Robert Zemeckis",
            ano: 1994,
            calificacion: 8.8,
            descripcion: "La vida es como una caja de chocolates, nunca sabes lo que vas a obtener.",
            imagen: "https://shatpod.com/movies/wp-content/uploads/yE5d3BUhE8hCnkMUJOo1QDoOGNz-scaled.jpg",
            fecha: new Date()
        },

        {
            id: 3,
            titulo: "Forrest Gump",
            genero: "Drama",
            director: "Robert Zemeckis",
            ano: 1994,
            calificacion: 8.8,
            descripcion: "La vida es como una caja de chocolates, nunca sabes lo que vas a obtener.",
            imagen: "https://shatpod.com/movies/wp-content/uploads/yE5d3BUhE8hCnkMUJOo1QDoOGNz-scaled.jpg",
            fecha: new Date()
        }

    ];

    //guardar en localStorage
    localStorage.setItem("peliculas", JSON.stringify(peliculasEjemplo));
}

//======= cargar peliculas de ejemplo =======//
function cargarPeliculas() {
    let peliculas = localStorage.getItem("peliculas");
    peliculasGlobales = peliculas ? JSON.parse(peliculas) : [];
    
    renderizarGrid(peliculasGlobales);
    renderizarSlider();
}

//======= renderizar peliculas =======//
function renderizarGrid( pelis ){
    let grid = document.querySelector("#gridPeliculas");
    let sinResultados = document.querySelector("#sinResultados");

    if (pelis.length === 0) {
        grid.innerHTML = "";
        sinResultados.style.display = "block";
        return;
    }

    sinResultados.style.display = "none";
    grid.innerHTML = pelis.map( p =>
         `
            <div class="col-md-6 col-lg-4 col-xl-3">
                <div class="movie-card">
                    <img src="${p.imagen}" class="movie-image" onerror="this.src='data:image/webp;base64,UklGRugCAABXRUJQVlA4INwCAADQHgCdASrtAA4BPp1Opk0lpCQlodSYmLATiWluvYsNnMqvpTOMplLyI1WfbjRaevAL2izqYKa0OHYQ444qFca0Q09+lb48rzVpUeU7pW7Q27+poHqJpIxZ0rfHid/rESLN4nsDYgEMnwvKuDFArfUVIIKDjiwz/M9Gm86HFUBD3BnOaPgL7d5XmhC2StMTMSE96LCqVG9iCKOlkkrowWAff1LA7WhK4HRkmldIG+B0o3h0USsNSlCJWJSp/qZ3WIG07OnGSXstFxuQvMBOIzL9RMy/UTR1HiesQF/HlO6VvjyvNWsYs6VvjyvNWsYsH1U8wBfUucU4pRiFjYQj4AAA/vVwNb5tLgCUkywSN5LOZPR424UY5FSW9fNXKCLawqfcgFeRflGAAortCOi3oAOHVUD/IrFjRP9Ssf1AsxeT02l4MUjufO0XPeFsfm+Ueaf6LhaUYcDLl5Mvzo3EsYoMF4vF8gv/O3PUL/Z8AD9dC+UXpqnwTuRbkMlMvjLjp2aDlQAmjqqFJ44Gcuj4uU68h2fzej4y8cdBIauyhWEKdbSG/niCxt9l9YVhoHNCuf6/loAAe/WN5IATBYNCWY3gz0SNqxPAANntTAk4j5SO7uH4tP38I5IyQJ5gUMTLvSuYW+Uvn7NKuYCadekU2JgAsnG658LXKPAkp+4TesktZNslfqG+kGL1qVmypFJyjhX2fRjyNsIrJBiOJA/Q7Nlz0YXZazvSsUFhEU5t92TkswUtWBe5jtiwMrF1NCZXrEAwT4A73M0LBb+16E1pFHcHMLKCFMgKMIULWi0K3moYoaz08/+gWBpg4PuQFvyrpkZlBdY+cjCcmewuI3L2tdnc2CqYFC0zoM1fcBYdE65+MmqHnSA5IiEFiaq7+AAWoBA1smXeAl1eRAbR02o4mi71ZlZR5ZdjI10G3uQAmBwWNDGue3lejQ2pCQ6FdDgs9SeyfYZ+y235eihAAAA='">
                    <div class="movie-content">
                        <h5 class="movie-title">${p.titulo}</h5>
                        <span class="movie-genero">${p.genero}</span>
                        <div class="movie-meta"> <b>${p.ano}</b> - ${p.director}</div>
                        <div class="movie-rating"> ⭐ ${p.calificacion}/10 </div>
                        <div class="movie-description"> ${p.descripcion}/10 </div>
                        <div class="movie-actions">
                        <button class="btn btn-info" onclick="verDetalles(${p.id})">Ver detalles</button>
                        <button class="btn btn-warning" onclick="editarPelicula(${p.id})">Editar</button>
                        <button class="btn btn-danger" onclick="eliminarPelicula(${p.id})">Eliminar</button>
                         </div>
                     </div>
                 </div>
             </div>
             `
     ).join("");

}


//Agregar o Editar peliculas
function guardarPelicula() {
    //obteber los datos del formulario
    let titulo = document.querySelector("#inputTitulo").value;
    let genero = document.querySelector("#inputGenero").value;
    let director = document.querySelector("#inputDirector").value;
    let ano = document.querySelector("#inputAno").value;
    let calificacion = document.querySelector("#inputCalificacion").value;
    let descripcion = document.querySelector("#inputDescripcion").value;
    let imagen = document.querySelector("#inputImagen").value;

    //validar si estamos editando o agregando una nueva pelicula
    if(peliculaEnEdiccion){
        //editando pelicula
if(peliculaEnEdiccion){
        //editando pelicula
        //buscar pelicula en el array de peliculas
        let index = peliculasGlobales.findIndex((p)=>p.id === peliculaEnEdiccion.id);
        //si se incontro pelicula guardamos en localStorage
if( index !== -1 ){

            peliculasGlobales[index] = {
                ...peliculasGlobales[index], //copiar informacion de pelicula
                titulo, genero, director, ano, calificacion, descripcion, imagen
            }
            alert("Pelicula actualizada con exito ✅");
        }
    }
    }else{
        //agregando una nueva pelicula
        //crear objeto para guardar los datos de la nueva pelicula
        let nuevaPelicual = {
            id: Date.now(),
            titulo, genero, director, ano, calificacion, descripcion, imagen,
            fecha: new Date()
        }
        
        //agregar pelicula a lista de peliculas
    peliculasGlobales.unshift(nuevaPelicual);
    alert("pelicula agregada exitosamente ✅");
    //agregar pelicula a localstorage

    }

        localStorage.setItem("peliculas", JSON.stringify(peliculasGlobales));
    peliculaEnEdiccion = null;
    cargarPeliculas();

//Cerrar o esconder modal
bootstrap.Modal.getInstance(document.querySelector("#modalPelicula")).hide();

//borrar los datos del modal
document.querySelector("#formPelicula").reset();

}


function editarPelicula( id ){
    //encontrar la pelicula para editarla
    let pelicula = peliculasGlobales.find((p)=> p.id === id);

    //si se encontro pelicula llenamos el formulario
    if( pelicula ){
        peliculaEnEdiccion = pelicula;

        document.querySelector("#inputTitulo").value = pelicula.titulo;
        document.querySelector("#inputGenero").value = pelicula.genero;
        document.querySelector("#inputDirector").value = pelicula.director;
        document.querySelector("#inputAno").value = pelicula.ano;
        document.querySelector("#inputCalificacion").value = pelicula.calificacion;
        document.querySelector("#inputDescripcion").value = pelicula.descripcion;
        document.querySelector("#inputImagen").value = pelicula.imagen;
        //cambiar tutulo del modal
    document.querySelector("#modalTitulo").textContent = "Editar Película";

        // Mostrar modal
        let modal = new bootstrap.Modal(document.querySelector("#modalPelicula"));
        modal.show();
    }
}


function eliminarPelicula( id ){
    //confirmar si desea eliminar la pelicula
    let confirmar = confirm("¿Deseas eliminar esta pelicula?");
    if( confirmar ){
        //buscar o filtrar las peliculas que no tengan el id
        peliculasGlobales = peliculasGlobales.filter((p)=> p.id !== id);
        //guardar las peliculas restantes en localstorage
        localStorage.setItem("peliculas", JSON.stringify(peliculasGlobales));
        //actualizar el dashboard
        cargarPeliculas();
        //mostrar confirmacion de eliminacion
        alert("Pelicula eliminada con exito ✅");
    }
}


function verDetalles(id){
    let pelicula = peliculasGlobales.find((p)=> p.id === id);

    if( pelicula ){
        document.querySelector("#detallesTitulo").textContent = pelicula.titulo;
        document.querySelector("#detallesGenero").textContent = pelicula.genero;
        document.querySelector("#detallesDirector").textContent = pelicula.director;
        document.querySelector("#detallesAno").textContent = pelicula.ano;
        document.querySelector("#detallesCalificacion").textContent = pelicula.calificacion;
        document.querySelector("#detallesDescripcion").textContent = pelicula.descripcion;
        document.querySelector("#detallesImagen").src = pelicula.imagen;

        let modal = new bootstrap.Modal(document.querySelector("#modalDetalles"));
        modal.show();
    }
}


//funcion para renderizarSlider
function renderizarSlider() {
    let carrusel = document.querySelector("#sliderPeliculas");
    carrusel.innerHTML = "";
    //Mostrar peliculas recientes
    let recientes = peliculasGlobales.slice(0, 5);
    recientes.forEach((p)=>{
        let card = document.createElement("div");
        card.className = "slider-movie-card";
        card.innerHTML = `
            <img src="${p.imagen}" onerror="this.src=this.src='data:image/webp;base64,UklGRugCAABXRUJQVlA4INwCAADQHgCdASrtAA4BPp1Opk0lpCQlodSYmLATiWluvYsNnMqvpTOMplLyI1WfbjRaevAL2izqYKa0OHYQ444qFca0Q09+lb48rzVpUeU7pW7Q27+poHqJpIxZ0rfHid/rESLN4nsDYgEMnwvKuDFArfUVIIKDjiwz/M9Gm86HFUBD3BnOaPgL7d5XmhC2StMTMSE96LCqVG9iCKOlkkrowWAff1LA7WhK4HRkmldIG+B0o3h0USsNSlCJWJSp/qZ3WIG07OnGSXstFxuQvMBOIzL9RMy/UTR1HiesQF/HlO6VvjyvNWsYs6VvjyvNWsYsH1U8wBfUucU4pRiFjYQj4AAA/vVwNb5tLgCUkywSN5LOZPR424UY5FSW9fNXKCLawqfcgFeRflGAAortCOi3oAOHVUD/IrFjRP9Ssf1AsxeT02l4MUjufO0XPeFsfm+Ueaf6LhaUYcDLl5Mvzo3EsYoMF4vF8gv/O3PUL/Z8AD9dC+UXpqnwTuRbkMlMvjLjp2aDlQAmjqqFJ44Gcuj4uU68h2fzej4y8cdBIauyhWEKdbSG/niCxt9l9YVhoHNCuf6/loAAe/WN5IATBYNCWY3gz0SNqxPAANntTAk4j5SO7uH4tP38I5IyQJ5gUMTLvSuYW+Uvn7NKuYCadekU2JgAsnG658LXKPAkp+4TesktZNslfqG+kGL1qVmypFJyjhX2fRjyNsIrJBiOJA/Q7Nlz0YXZazvSsUFhEU5t92TkswUtWBe5jtiwMrF1NCZXrEAwT4A73M0LBb+16E1pFHcHMLKCFMgKMIULWi0K3moYoaz08/+gWBpg4PuQFvyrpkZlBdY+cjCcmewuI3L2tdnc2CqYFC0zoM1fcBYdE65+MmqHnSA5IiEFiaq7+AAWoBA1smXeAl1eRAbR02o4mi71ZlZR5ZdjI10G3uQAmBwWNDGue3lejQ2pCQ6FdDgs9SeyfYZ+y235eihAAAA='">
            <div class="slider-movie-info">
                <h6>${p.titulo}</h6>
                <small class="text-muted">${p.ano}</small>
            </div>
        `;
        card.addEventListener("click", ()=>verDetalles(p.id) );
        carrusel.appendChild(card);
    })
}


//moviento de scroll
function scrollSlide(direccion){
    let slider = document.querySelector("#carruselMovies");
    let scroll = 200;
    slider.scrollBy({
        left: direccion * scroll,
        behavior: "smooth"
    });
}

function buscarPeliculas() {
    let busqueda = document.querySelector("#inputBuscar").value.toLowerCase().trim();

    let resultados = peliculasGlobales.filter(p => p.titulo.toLowerCase().includes(busqueda));

    renderizarGrid(resultados);
}


function filtrarPorGenero() {
    let generoSeleccionado = document.querySelector("#selectGenero").value;

    let resultados = peliculasGlobales.filter(p => {
        return generoSeleccionado ? p.genero === generoSeleccionado : true;
    });

    renderizarGrid(resultados);
}

l
// function filtrarPeliculas() {
//     let busqueda = document.querySelector("#inputBuscar").value.toLowerCase().trim();
//     let generoSeleccionado = document.querySelector("#selectGenero").value;

//     let filtradas = peliculasGlobales.filter(p => {
//         // Filtrar por búsqueda de título
//         let coincideTitulo = p.titulo.toLowerCase().includes(busqueda);

//         // Filtrar por género (si hay género seleccionado)
//         let coincideGenero = generoSeleccionado ? p.genero === generoSeleccionado : true;

//         return coincideTitulo && coincideGenero;
//     });

//     // Renderizar películas filtradas
//     renderizarGrid(filtradas);
// }
