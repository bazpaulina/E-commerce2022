const ORDER_ASC_BY_MIN = "Min";
const ORDER_DESC_BY_MAX = "Max";
const ORDER_BY_PROD_REL = "Relevancia"; 
let datoscategorias = [];
let classificationCriteria = undefined; 
let minCount = undefined;
let maxCount = undefined;

//Ordenar artículos

function sortArticles(criterio, array){
    let result = []; 
    if (criterio === ORDER_ASC_BY_MIN)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; } 
            if ( a.cost > b.cost ){ return 1; } 
            return 0; 
        });
    }else if (criterio === ORDER_DESC_BY_MAX){ 
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criterio === ORDER_BY_PROD_REL){ 
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount); 
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }
 
    return result;
}

function setProductsID(id) {
    localStorage.setItem("productosInfo", id);
    window.location = "product-info.html"
}

//Lista de Productos

function listproducts(){

    let proparticulos = ""; 
    for(let productos of datoscategorias){

        if (((minCount == undefined) || (minCount != undefined && parseInt(productos.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(productos.cost) <= maxCount))){

            proparticulos += `  
            <div onclick="setProductsID(${productos.id})" class="list-group-item list-group-item-action cursor-active">         
            <div class="list-group-item list-group-item-action cursor-active">
            <div class="row">
                <div class="col-3">
                    <img src="${productos.image}" alt="${productos.description}" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1">${productos.name} - ${productos.currency} ${productos.cost}</h4>
                        <small class="text-muted">${productos.soldCount} vendidos</small>
                    </div>
                    <p class="mb-1">${productos.description}</p>
                </div>
            </div>
         </div>
         </div>
            `
        }

        document.getElementById("listproducts").innerHTML = proparticulos;
    }
}

//Muestro las productos segun el críterio elegido

function sortAndShowProducts(sortCriteria, productsArray){ 
    classificationCriteria = sortCriteria; 
    
    if(productsArray != undefined){
        datoscategorias = productsArray; 
    }

    datoscategorias = sortArticles(classificationCriteria, datoscategorias);

    listproducts();
}

//Creamos un DOMContentLoaded que cargara el contenido de la pagina una vez que se haya comprobado que 
//no haya ningun error (para eso utilizamos resultObj) si esta todo okey y si es asi
//nos muestre los productos en orden ascendente por precio minimo
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            sortAndShowProducts(ORDER_ASC_BY_MIN, resultObj.data.products);
        }
    });

    document.getElementById("sortMin").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_MIN);
    });

    document.getElementById("sortMax").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_MAX);
    });

    document.getElementById("sortByRel").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_PROD_REL);
    });

    document.getElementById("clearFilter").addEventListener("click", function(){ //hace referencia cuando esta filtrando
        document.getElementById("CountMin").value = ""; //por precios
        document.getElementById("CountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        listproducts();
    });

//Realizamos una funcion para que la busqueda de los articulos por precios sea segun 4 criterios de busqueda 
//en las casillas de precio que el minimo tenga un valor y el maximo ninguno, al revez, que ambos tengan un valor y
//por ultimo que ninguno tenga un valor
    document.getElementById("rangeFilter").addEventListener("click", function(){
        minCount = document.getElementById("CountMin").value;
        maxCount = document.getElementById("CountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }

        listproducts();
    });
});

//Buscador de productos

//todo lo que toques en el Search te muestre automaticamente
let buscador = datoscategorias;
document.getElementById("busc").addEventListener("keyup", function () {
    filterSerch = document.getElementById("busc").value;

    if (filterSerch != undefined) {
        buscador = datoscategorias;
        datoscategorias = datoscategorias.filter(function (elemento) {
            return elemento.name.toLowerCase().includes(filterSerch.toLowerCase()) || elemento.description.toLowerCase().includes(filterSerch.toLowerCase())
        })
    }
    listproducts();

    datoscategorias = buscador;
})