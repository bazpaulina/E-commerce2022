function mostrarCarrito() {
	const carrito = localStorage.hasOwnProperty("carrito")
		? JSON.parse(localStorage.getItem("carrito"))
		: [];
	const tbodyContenido = document.getElementById("contenido");
	tbodyContenido.innerHTML = "";
	let total = 0;

	if (carrito.length == 0) {
		tbodyContenido.innerHTML = `<tr>
			<td colspan="5">No hay productos en el carrito</td>
		</tr>`;
	} else {
		for (let articulo of carrito) {
			const imageUrl =
				(articulo.images && articulo.images[0]) || "img/noimage.png";
			total += parseInt(articulo.cantidad) * parseInt(articulo.cost);
 
			tbodyContenido.innerHTML += `
				<tr data-id="${articulo.id}">
					<td><img src="${imageUrl}" class="img-fluid" width="70" alt="product"></td>
					<td>${articulo.name}</td>
					<td data-cost="${articulo.cost}">${articulo.currency}&nbsp;${articulo.cost}</td>
					<td>
						<div class="form-group mb-0">
							<input type="number" class="form-control cart-qty cantidad" min="1" max="20" value="${
								articulo.cantidad
							}">
						</div>
					</td>
					<td id="subtotal">USD ${
						parseInt(articulo.cantidad) * parseInt(articulo.cost)
					}</td>
					<td>	
						<button type="button" class="btn btn-danger btn-sm btn-remove">Eliminar</button> 
					</td>
				</tr>
		`;
		}
	}
	document.getElementById("subtot").innerHTML = total;
	actualizarCostos(total);

	const items = document.getElementsByClassName("cantidad");
	for (const item of items) {
		item.addEventListener("change", function () {
			const id = this.parentElement.parentElement.parentElement.dataset.id;
			const cantidad = this.value;
			actualizarCarrito(id, cantidad);
		});
	}

	const btnRemove = document.getElementsByClassName("btn-remove");
	for (const btn of btnRemove) {
		btn.addEventListener("click", function () {
			const id = this.parentElement.parentElement.dataset.id;
			eliminarProducto(id);
		});
	}
}

function actualizarCostos(subtotal) {
	const costoEnvio = calculoEnvio(subtotal);
	document.getElementById("subtot").innerHTML = subtotal;
	document.getElementById("coste").innerHTML = costoEnvio;
	document.getElementById("tot").innerHTML = subtotal + costoEnvio;
}

function calculoEnvio(total) {
	const radioenvio = document.getElementsByClassName("radioenvio");
	const porcentajeEnvio = {
		premium: 0.15,
		express: 0.07,
		standard: 0.05,
	};

	for (const element of radioenvio) {
		if (element.checked) {
			return Math.round(total * porcentajeEnvio[element.value]);
		}
	}
	return 0;
}

/**
 * @desc Esta funcion controla que se hayan llenado los datos del medio de pago
 * @returns {boolean} true si se llenaron los datos, false si no se llenaron
 */
function chequearFormaPago() {
	const esTarjeta = document.getElementById("metodo-pago-tarjeta").checked;

	if (esTarjeta) {
		const numeroTarjeta = document.getElementById("numero-tarjeta").value;
		const codigoSeguridad = document.getElementById("codigo-seguridad").value;
		const vencimiento = document.getElementById("vencimiento").value;

		if (numeroTarjeta == "" || codigoSeguridad == "" || vencimiento == "") {
			return false;
		}
	} else {
		const numeroCuenta = document.getElementById("numero-cuenta").value;

		if (numeroCuenta == "") {
			return false;
		}
	}

	return true;
}

/**
 * @desc Esta funcion oculta o muestra los campos de la forma de pago segun el medio de pago seleccionado
 * @param {string} medioPago - El medio de pago seleccionado
 */
function metodoPago(valor) {
	if (valor == "tarjeta") {
		document.getElementById("numero-cuenta").disabled = true;
		document.getElementById("numero-tarjeta").disabled = false;
		document.getElementById("codigo-seguridad").disabled = false;
		document.getElementById("vencimiento").disabled = false;
	} else if (valor == "transferencia") {
		document.getElementById("numero-cuenta").disabled = false;
		document.getElementById("numero-tarjeta").disabled = true;
		document.getElementById("codigo-seguridad").disabled = true;
		document.getElementById("vencimiento").disabled = true;
	}
}

function actualizarCarrito(id, cantidad) {
	const carrito = JSON.parse(localStorage.getItem("carrito"));
	const producto = carrito.find((p) => p.id == id);
	producto.cantidad = cantidad;
	localStorage.setItem("carrito", JSON.stringify(carrito));
	mostrarCarrito();
}

function eliminarProducto(id) {
	const carrito = JSON.parse(localStorage.getItem("carrito"));
	const producto = carrito.find((p) => p.id == id);
	carrito.splice(carrito.indexOf(producto), 1);
	localStorage.setItem("carrito", JSON.stringify(carrito));
	mostrarCarrito();
}

///////////////////////// Al cargar la pagina /////////////////////////

(function () {
	"use strict";

	// Mostrar los productos del carrito
	mostrarCarrito();

	const radioenvio = document.getElementsByClassName("radioenvio");
	for (const element of radioenvio) {
		element.addEventListener("change", function () {
			mostrarCarrito();
		});
	}

	// Validacion del formulario al hacer click en el boton de enviar
	const formCompra = document.getElementById("frmCompra");

	formCompra.addEventListener(
		"submit",
		function (event) {
			let huboError = false;

			if (!formCompra.checkValidity()) {
				event.preventDefault();
				event.stopPropagation();
				huboError = true;
			}

			if (!chequearFormaPago()) {
				document.getElementsByClassName("faltan-datos")[0].style.display =
					"block";

				setTimeout(function () {
					document.getElementsByClassName(
						"faltan-datos"
					)[0].style.display = "none";
				}, 3000);
				event.preventDefault();
				huboError = true;
			}

			formCompra.classList.add("was-validated");

			if (!huboError) {
				event.preventDefault();

				document.getElementsByClassName("alert")[0].style.display = "block";
			}
		},
		false
	);
})();
