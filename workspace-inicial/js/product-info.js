//Función que guarda la info de los productos en el LS
function setProductsID(id) {
	localStorage.setItem("productosInfo", id);
	window.location = "product-info.html";
}

//Función que toma la info de los productos y los imprime
function callProducts() {
	document.getElementById("productos").innerHTML = `<h2>${productos.name}</h2>`;
	let htmlContentToAppend = "";
	htmlContentToAppend += `
        <p><b>Nombre</b><br>${productos.name}</p>
        <p><b>Descripción</b><br>${productos.description}</p>
        <p><b>Precio</b><br>${productos.currency}${productos.cost}</p>
        <p><b>Cantidad de vendidos</b><br>${productos.soldCount}</p
        <div class="row" >
            <ul class="row p-0" id="guardadoImg">
            </ul>
        </div>
    `;
	document.getElementById("contenedorProductos").innerHTML =
		htmlContentToAppend;
	IterarImg();
}

//Funcion que muestra las imágenes en un carrusel
function IterarImg() {
	let htmlContentToAppend = "";
	htmlContentToAppend += `
                <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="true">
                    <div class="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 3"></button>
                    </div>
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img src="${productos.images[0]}" width="100%"  class="img-thumbnail">
                        </div>
                        <div class="carousel-item">
                            <img src="${productos.images[1]}" width="100%"  class="img-thumbnail">
                        </div>
                        <div class="carousel-item">
                            <img src="${productos.images[2]}" width="100%"  class="img-thumbnail">
                        </div>
                        <div class="carousel-item">
                            <img src="${productos.images[3]}" width="100%"  class="img-thumbnail">
                        </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            `;
	document.getElementById("guardadoImg").innerHTML = htmlContentToAppend;
}

//Toma la api de los productos y al cargar la página los muestra
document.addEventListener("DOMContentLoaded", function (e) {
	let id = localStorage.productosInfo;
	if (id) {getJSONData("https://japceibal.github.io/emercado-api/products/" + id + ".json").then(function (resultObj) {
			if (resultObj.status === "ok") {
				productos = resultObj.data;
				callProducts();
				artRelacionado();
				IterarImg();
			}
		});
	}
	//Toma la api de los comentarios para luego usarlos en la web
	getJSONData(
		"https://japceibal.github.io/emercado-api/products_comments/" +
			id +
			".json"
	).then(function (resultObj) {
		if (resultObj.status === "ok") {
			Comments(resultObj.data);
		}
	});

	//Registro el evento de click para cargar el carrito
	document.getElementById("addToCart").addEventListener("click", function (e) {
		e.preventDefault();
		agregarAlCarrito();
	});
});

//Función que muestra los comentarios
function Comments(mensajes){
    let htmlContentToAppend = ""
    for (let mensaje of mensajes){
        htmlContentToAppend += `
        <div class="col">
        <div class="list-group-item list-group-item-action cursor-active">
        <p>${mensaje.user} ${mensaje.dateTime}</p>
        <p>${crearEstrellas(mensaje.score)}</p>
         <p>${mensaje.description}</p>
        <br>
        </div>
        </div>
        `
    }
    document.getElementById("Comentarios").innerHTML = htmlContentToAppend
}

//Función para seleccionar las estrellas
var contador;
function enviar(item){
    console.log(item)
    contador=item.id[0]
    let estrella = item.id.substring(1)

    for(let i=0; i<5; i++){
        if(i<contador){
            document.getElementById((i+1)+estrella).style.color="orange";
        }else{
            document.getElementById((i+1)+estrella).style.color="black";
        }
    }
}

function crearEstrellas(cantidadEstrellas){
    let htmlEstrellas = "";
    for (let i=1 ; i<=cantidadEstrellas; i++){
        htmlEstrellas +=`<label class="fa fa-star" style="color : orange;"></label>`
    }
    for (let i=1 ; i<=5-cantidadEstrellas; i++){
        htmlEstrellas +=`<label class="fa fa-star" style="color : black;"></label>`
    }
    return htmlEstrellas;
}

//Agregar mi comentario
var today= new Date();
    var todayDate = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes()
    document.getElementById("comentariousuario").addEventListener("submit",(e)=>{
        console.log("hola")
        e.preventDefault()
        let htmlcomment = ""
        let miComentario = document.getElementById("texto").value
        let nombreusuario = JSON.parse(localStorage.getItem("infouser"))
        let scor = document.getElementById("estrellas")
            console.log(scor)
        htmlcomment += `
            <div class="col">
            <div class="list-group-item list-group-item-action cursor-active">
            <p>${nombreusuario.correouser} ${todayDate}</p>
            <p>${crearEstrellas(contador)}</p>
            <p>${miComentario}</p>
            <br>
            </div>
            </div>
            `
            
            document.getElementById("Comentarios").innerHTML += htmlcomment 
    })

//Funcion para mostrar articulos relacionados

function artRelacionado() {
	let htmlContentToAppend = "";
	for (let articulo of productos.relatedProducts) {
		htmlContentToAppend += `
        <li class="cursor-active col-md-6 col-lg-4 p-4" style="list-style-type:none">
            <div class="art" onclick="setProductsID(${articulo.id})">
                <div class="imgg"> 
                    <img src="${articulo.image}" class="img-thumbnail"> 
                </div>
                <div class="title">
                    <p>${articulo.name}</p>
                </div>
            </div>
        </li>
    `;
	}
	document.getElementById("relacionado").innerHTML = htmlContentToAppend;
}

/**
 * Agrega el producto al carrito
 * @returns {undefined}
 */
function agregarAlCarrito() {
	if (!localStorage.productosInfo) {
		console.error("No se pudo agregar al carrito");
		return;
	}

	//Arreglo de productos
	const carrito = localStorage.hasOwnProperty("carrito")
		? JSON.parse(localStorage.getItem("carrito"))
		: [];

	getJSONData(`${PRODUCT_INFO_URL}${localStorage.productosInfo}.json`).then(
		function (resultObj) {
			if (resultObj.status === "ok") {
				if (carrito.length === 0) {
					resultObj.data.cantidad = 1;
					carrito.push(resultObj.data);
				} else {
					const producto = carrito.find((p) => p.id === resultObj.data.id);

					if (producto) {
						producto.cantidad++;
					} else {
						resultObj.data.cantidad = 1;
						carrito.push(resultObj.data);
					}
				}
				localStorage.setItem("carrito", JSON.stringify(carrito));
			}
		}
	);
}
