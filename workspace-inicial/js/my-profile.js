const infoUser = localStorage.getItem("infouser");

let datosUsuario = {
	correouser: infoUser.correouser,
	pnombre: "",
	snombre: "",
	papellido: "",
	sapellido: "",
	telefono: "",
};

/**
 * @desc Guarda los datos del usuario en el local storage
 */
function guardadoDatos() {
	datosUsuario.pnombre = document.getElementById("pnombre").value || "";
	datosUsuario.snombre = document.getElementById("snombre").value || "";
	datosUsuario.papellido = document.getElementById("papellido").value || "";
	datosUsuario.sapellido = document.getElementById("sapellido").value || "";
	datosUsuario.telefono = document.getElementById("telefono").value || "";
	datosUsuario.correouser =
		document.getElementById("emailusuario").value || "";

	localStorage.setItem("infouser", JSON.stringify(datosUsuario));
}

/**
 * @desc Obtiene los datos del usuario del local storage y los coloca en los campos
 */
function getDatos() {
	const usuario = JSON.parse(localStorage.getItem("infouser"));

	document.getElementById("pnombre").value = usuario.pnombre || "";
	document.getElementById("snombre").value = usuario.snombre || "";
	document.getElementById("papellido").value = usuario.papellido || "";
	document.getElementById("sapellido").value = usuario.sapellido || "";
	document.getElementById("telefono").value = usuario.telefono || "";
	document.getElementById("emailusuario").value = usuario.correouser || "";
}

/**
 * @desc Valida que los campos no estén vacíos
 */
function datosCompleted() {
	const datobligatorios = document.getElementById("datosobligatorios").checked;

	if (datobligatorios) {
		const prnombre = document.getElementById("pnombre").value;
		const prapellido = document.getElementById("papellido").value;
		const correodelusuario = document.getElementById("emailusuario").value;

		if (prnombre == "" || prapellido == "" || correodelusuario == "") {
			return true;
		}
	}
}

//////////////////////////  INICIO Y VALIDACIONES  //////////////////////////

document.addEventListener("DOMContentLoaded", function () {
	if (localStorage.infouser) {
		getDatos();
	}

	const formPerfil = document.getElementById("frmPerfil");

	formPerfil.addEventListener(
		"submit",
		function (event) {
			let huboError = false;
			event.preventDefault();

			if (!formPerfil.checkValidity()) {
				event.stopPropagation();
				huboError = true;
			}

			if (!huboError) {
				guardadoDatos();

				document.getElementsByClassName("profile-alert")[0].style.display =
					"block";

				setTimeout(function () {
					document.getElementsByClassName(
						"profile-alert"
					)[0].style.display = "none";
				}, 3000);
			}

			formPerfil.classList.add("was-validated");
		},
		false
	);
});

profilePic.addEventListener('click', function(e){
    uploadImg.click()
})

uploadImg.addEventListener("change", function(e){
    let file = uploadImg.files[0]
    let reader = new FileReader()
        reader.onload = function(){
            profilePic.src = reader.result
            localStorage.setItem("profilePic", reader.result)
        }
        reader.readAsDataURL(file)
    
})

if (profilePic.src = localStorage.getItem("profilePic")){
    profilePic.src = localStorage.getItem("profilePic")

} else {
    profilePic.src = "/img/img_perfil.png"
}