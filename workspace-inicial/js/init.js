const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = `https://japceibal.github.io/emercado-api/cats_products/${localStorage.getItem("catID")}.json`;
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/25801.json";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function () {
	document.getElementById("spinner-wrapper").style.display = "block";
};

let hideSpinner = function () {
	document.getElementById("spinner-wrapper").style.display = "none";
};

let getJSONData = function (url) {
	let result = {};
	showSpinner();
	return fetch(url)
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw Error(response.statusText);
			}
		})
		.then(function (response) {
			result.status = "ok";
			result.data = response;
			hideSpinner();
			return result;
		})
		.catch(function (error) {
			result.status = "error";
			result.data = error;
			hideSpinner();
			return result;
		});
};

//creamos un evento que cuando cargue todo el documento nos muestre los datos
document.addEventListener("DOMContentLoaded", function () {
	let userLoad = JSON.parse(localStorage.getItem("infouser"));
	document.getElementById("loginuser").innerHTML += `
  <div class="dropdown"> 
    <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
    ${userLoad.correouser}
    </a>

  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
    <li><a class="dropdown-item" href="cart.html">Carrito</a></li>
    <li><a class="dropdown-item" id="logout" href="#">Cerrar sesión</a></li>
  </ul>
</div>
`;
	//dropdown = menu desplegable
	document.getElementById("loginuser").style.color = "white";
	document.getElementById("logout").addEventListener("click", function () {
		localStorage.removeItem("infouser");
		window.location.replace("index.html");
	});
});
//nos redirije al login
