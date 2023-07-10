var email = document.getElementById("correo");
var pass = document.getElementById("form2Example2");

const war = document.getElementById("warnings");
form.addEventListener("submit", (e) => {
	e.preventDefault();
	let warnings = "";
	let hayError = false;
	war.innerHTML = "";

	if (email.value.length < 10) {
		warnings += `Email invalido <br>`;
		hayError = true;
	}

	if (pass.value.length < 8) {
		warnings += `Contraseña invalida <br>`;
		hayError = true;
	}

	if (hayError) {
		war.innerHTML = warnings;
	} else {
		//creamos una variable donde dentro hacemos una propiedad
		let emailuser = {
			correouser: document.getElementById("correo").value,
		};

		localStorage.setItem("infouser", JSON.stringify(emailuser));
		window.location.href = "inicio.html";
		war.innerHTML = "Enviado";
	}
});
