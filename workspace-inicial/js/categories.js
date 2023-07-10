const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

//Ordenar Categorias

function sortCategories(criteria, array) {
	let result = [];
	if (criteria === ORDER_ASC_BY_NAME) {
		result = array.sort(function (a, b) {
			if (a.name < b.name) {
				return -1;
			}
			if (a.name > b.name) {
				return 1;
			}
			return 0;
		});
	} else if (criteria === ORDER_DESC_BY_NAME) {
		result = array.sort(function (a, b) {
			if (a.name > b.name) {
				return -1;
			}
			if (a.name < b.name) {
				return 1;
			}
			return 0;
		});
	} else if (criteria === ORDER_BY_PROD_COUNT) {
		result = array.sort(function (a, b) {
			let aCount = parseInt(a.productCount);
			let bCount = parseInt(b.productCount);

			if (aCount > bCount) {
				return -1;
			}
			if (aCount < bCount) {
				return 1;
			}
			return 0;
		});
	}

	return result;
}

//Hace referencia al id que seleccionamos

function setCatID(id) {
	localStorage.setItem("catID", id);
	window.location = "products.html";
}

//Muestra la lista de Categorías

function showCategoriesList() {
	let htmlContentToAppend = "";
	for (const element of currentCategoriesArray) {
		let category = element;

		if (
			(minCount == undefined ||
				(minCount != undefined &&
					parseInt(category.productCount) >= minCount)) &&
			(maxCount == undefined ||
				(maxCount != undefined &&
					parseInt(category.productCount) <= maxCount))
		) {
			htmlContentToAppend += `
            <div onclick="setCatID(${category.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${category.imgSrc}" alt="${category.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${category.name}</h4>
                            <small class="text-muted">${category.productCount} artículos</small>
                        </div>
                        <p class="mb-1">${category.description}</p>
                    </div>
                </div>
            </div>
            `;
		}

		document.getElementById("cat-list-container").innerHTML =
			htmlContentToAppend;
	}
}

function sortAndShowCategories(sortCriteria, categoriesArray) {
	currentSortCriteria = sortCriteria;

	if (categoriesArray != undefined) {
		currentCategoriesArray = categoriesArray;
	}

	currentCategoriesArray = sortCategories(
		currentSortCriteria,
		currentCategoriesArray
	);

	//Muestro las categorías ordenadas
	showCategoriesList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
	//Limpio categoria y producto del local storage
	localStorage.removeItem("catID");
	localStorage.removeItem("productosInfo");

	getJSONData(CATEGORIES_URL).then(function (resultObj) {
		if (resultObj.status === "ok") {
			currentCategoriesArray = resultObj.data;
			showCategoriesList();
		}
	});

	document.getElementById("sortAsc").addEventListener("click", function () {
		sortAndShowCategories(ORDER_ASC_BY_NAME);
	});

	document.getElementById("sortDesc").addEventListener("click", function () {
		sortAndShowCategories(ORDER_DESC_BY_NAME);
	});

	document
		.getElementById("sortByCount")
		.addEventListener("click", function () {
			sortAndShowCategories(ORDER_BY_PROD_COUNT);
		});

	document
		.getElementById("clearFilter")
		.addEventListener("click", function () {
			document.getElementById("CountMin").value = "";
			document.getElementById("CountMax").value = "";

			minCount = undefined;
			maxCount = undefined;

			showCategoriesList();
		});

	document
		.getElementById("rangeFilter")
		.addEventListener("click", function () {
			//Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
			//de productos por categoría.
			minCount = document.getElementById("CountMin").value;
			maxCount = document.getElementById("CountMax").value;

			if (
				minCount != undefined &&
				minCount != "" &&
				parseInt(minCount) >= 0
			) {
				minCount = parseInt(minCount);
			} else {
				minCount = undefined;
			}

			if (
				maxCount != undefined &&
				maxCount != "" &&
				parseInt(maxCount) >= 0
			) {
				maxCount = parseInt(maxCount);
			} else {
				maxCount = undefined;
			}

			showCategoriesList();
		});
});
