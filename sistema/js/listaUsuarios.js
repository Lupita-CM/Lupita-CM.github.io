/*var arreglo=[];
arreglo[0]=3;
arreglo[5]="Hola";
arreglo.push("Mundo");
var usuario={nombre:"Uriel Perez",
            correo:"uriel@gmail.com",
            telefono:'1234567890'};
usuario.password="123";
var usuario2={};
usuario2.nombre="Karina";
arreglo.push(usuario);
arreglo.push(usuario2);
console.log(arreglo);
*/
//JSON (JavaScript Object Notation)
//{atributo1:valor,atributo2:valor}
/*sessionStorage (tiempo de vida limitado al cierre del navegador)
localStorage (tiempo de vida dependiente de que el usuario borre)*/

document.addEventListener("DOMContentLoaded", () => {
  inicializarDatos();
  cargarTabla();
  document.getElementById("txtNombre").onkeyup = (e) =>
    revisarControl(e, 2, 60);

  document.getElementById("txtTelefono").onkeyup = (e) => {
    if (e.target.value.trim().length > 0) revisarControl(e, 10, 10);
  };
  document.getElementById("txtPassword").onkeyup = (e) => {
    revisarControl(e, 6, 20);
  };
  document.getElementById("txtConfirmarPassword").onkeyup = (e) => {
    revisarControl(e, 6, 20);
  };
  document.getElementById("txtCambioPassword").onkeyup = (e) => {
    revisarControl(e, 6, 20);
  };
  document.getElementById("txtConfirmPassword").onkeyup = (e) => {
    revisarControl(e, 6, 20);
  };

  document.getElementById("btnLimpiar").addEventListener("click", (e) => {
    e.target.form.classList.remove("validado");
    //Iterar todos los controles del form
    //debugger;
    let controles = e.target.form.querySelectorAll("input,select");
    controles.forEach((control) => {
      control.classList.remove("valido");
      control.classList.remove("novalido");
    });
    //console.log(controles);
  });

  document.getElementById("btnAceptar").addEventListener("click", (e) => {
    let alert = e.target.parentElement.querySelector(".alert");

    if (alert) {
      alert.remove();
    }

    e.target.form.classList.add("validado");
    /*debugger;
    let txtNombre = document.getElementById("txtNombre");
    let txtEmail = document.getElementById("txtEmail");
    let txtTel = document.getElementById("txtTelefono");
    txtNombre.setCustomValidity("");
    txtEmail.setCustomValidity("");
    txtTel.setCustomValidity("");

    if (
      txtNombre.value.trim().length < 2 ||
      txtNombre.value.trim().length > 60
    ) {
      txtNombre.setCustomValidity(
        "El nombre es obligatorio (entre 2 y 60 caracteres)"
      );
    }
    console.log(e.target.form.checkValidity());*/
    let txtNombre = document.getElementById("txtNombre");
    let txtContrasenia = document.getElementById("txtPassword");
    let txtContrasenia2 = document.getElementById("txtConfirmarPassword");
    let txtEmail = document.getElementById("txtEmail");
    let txtTel = document.getElementById("txtTelefono");
    txtNombre.setCustomValidity("");
    txtContrasenia.setCustomValidity("");
    txtContrasenia2.setCustomValidity("");
    txtEmail.setCustomValidity("");
    txtTel.setCustomValidity("");

    if (txtNombre.value.trim().length < 2 ||
        txtNombre.value.trim().length > 60) {
        txtNombre.setCustomValidity("El nombre es obligatorio (entre 2 y 60 caracteres)");
    }
    
    if (txtTel.value.trim().length > 0 && txtTel.value.trim().length != 10) {
        txtTel.setCustomValidity("El teléfono debe tener 10 dígitos");
    }
    var expresionCorreo = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
    let errorEmail = document.getElementById("divEmail");

    if(!expresionCorreo.test(txtEmail.value.trim())){
      txtEmail.setCustomValidity("No");
      errorEmail.innerText="El formato del correo no es válido";      
      if(txtEmail.value.length == 0){
        errorEmail.innerText="El correo es obligatorio";      
      }
    }

    if (e.target.form.checkValidity()) {
      let correoOriginal = document
        .getElementById("txtCorreoOriginal")
        .value.trim();
      let nuevoCorreo = txtEmail.value.trim();
      let usuarios = JSON.parse(localStorage.getItem("usuarios"));

      if (document.querySelector("#mdlRegistro .modal-title").innerText == "Agregar") {
        if (txtContrasenia.value.trim().length < 6 || txtContrasenia.value.trim().length > 20) {
          txtContrasenia.setCustomValidity("La contraseña es obligatoria (entre 2 y 60 caracteres)");
        }
        if (txtContrasenia2.value.trim().length < 6 || txtContrasenia2.value.trim().length > 20) {
          txtContrasenia2.setCustomValidity("Confirma la contraseña");
        }
        let error = document.getElementById("divmensaje");
        if (txtContrasenia.value.trim() != txtContrasenia2.value.trim()) {
          txtContrasenia2.setCustomValidity("Las contraseñas deben coincidir");
          error.innerText = "Las contraseñas deben coincidir";
          e.preventDefault();
          return;
        }else{
          txtContrasenia2.setCustomValidity("");
          error.innerText = "La longitud de la contraseña no cumple con los caracteres requeridos (entre 2 y 60 caracteres)";
        }

        let usuarioExistente = usuarios.find(
          (element) => element.correo === nuevoCorreo
        );
        if (usuarioExistente) {
          mostrarMensajeCorreoDuplicado();
          e.preventDefault();
          return;
        }

        let usuario = {
          nombre: txtNombre.value.trim(),
          correo: txtEmail.value.trim(),
          password: document.getElementById("txtPassword").value.trim(), // Conserva la contraseña al agregar un nuevo usuario
          telefono: txtTelefono.value.trim(),
        };
        usuarios.push(usuario);
      } else {
        if (correoOriginal !== nuevoCorreo) {
          let usuarioExistente = usuarios.find(
            (element) => element.correo === nuevoCorreo
          );
          if (usuarioExistente) {
            mostrarMensajeCorreoDuplicado();
            e.preventDefault();
            return;
          }
        }

        // Actualizar los datos del usuario en el array, pero conserva la contraseña existente
        let usuarioIndex = usuarios.findIndex(
          (element) => element.correo === correoOriginal
        );
        usuarios[usuarioIndex].nombre = txtNombre.value.trim();
        usuarios[usuarioIndex].correo = txtEmail.value.trim();
        usuarios[usuarioIndex].telefono = txtTelefono.value.trim();
      }

      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    } else {
      e.preventDefault();
    }
  });

  function mostrarMensajeCorreoDuplicado() {
    let alerta = document.createElement("div");
    alerta.innerHTML =
      'Este correo ya se encuentra registrado, favor de usar otro <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
    alerta.className = "alert alert-warning alert-dismissible fade show";

    let modalBody = document.querySelector("#mdlRegistro .modal-body");
    modalBody.insertBefore(alerta, modalBody.firstChild);

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }

  // Finaliza el nuevo metodo

  document
    .getElementById("mdlRegistro")
    .addEventListener("shown.bs.modal", (e) => {
      document.getElementById("btnLimpiar").click();

      let operacion = e.relatedTarget.innerText;
      e.target.querySelector(".modal-title").innerText = operacion;

      //Identificar si vamos editar para cargar los datos
      if (operacion == "Editar") {
        let correo = e.relatedTarget.value;
        let usuarios = JSON.parse(localStorage.getItem("usuarios"));
        let usuario = usuarios.find((element) => element.correo == correo);

        document.getElementById("txtNombre").value = usuario.nombre;
        document.getElementById("txtEmail").value = usuario.correo;
        document.getElementById("txtCorreoOriginal").value = usuario.correo;
        document.getElementById("txtTelefono").value = usuario.telefono;

        // Ocultar las cajas de las contraseñas
        document.getElementById("txtPassword").style.display = "none";
        document.getElementById(
          "txtPassword"
        ).previousElementSibling.style.display = "none"; // Ocultar la etiqueta
        document.getElementById("txtConfirmarPassword").style.display = "none";
        document.getElementById(
          "txtConfirmarPassword"
        ).previousElementSibling.style.display = "none"; // Ocultar la etiqueta

        var passwordInput = document.getElementById("txtPassword");
        var confirmarPasswordInput = document.getElementById(
          "txtConfirmarPassword"
        );

        passwordInput.removeAttribute("minlength");
        passwordInput.removeAttribute("maxlength");
        passwordInput.removeAttribute("required");

        confirmarPasswordInput.removeAttribute("minlength");
        confirmarPasswordInput.removeAttribute("maxlength");
        confirmarPasswordInput.removeAttribute("required");
      } else if (operacion == "Agregar") {
        // Restablecer la visualización de los campos de contraseña y sus etiquetas
        document.getElementById("txtPassword").style.display = ""; // Restablecer la visualización a su valor original
        document.getElementById(
          "txtPassword"
        ).previousElementSibling.style.display = ""; // Restablecer la visualización a su valor original (etiqueta)
        document.getElementById("txtConfirmarPassword").style.display = ""; // Restablecer la visualización a su valor original
        document.getElementById(
          "txtConfirmarPassword"
        ).previousElementSibling.style.display = ""; // Restablecer la visualización a su valor original (etiqueta)

        var passwordInput = document.getElementById("txtPassword");
        var confirmarPasswordInput = document.getElementById(
          "txtConfirmarPassword"
        );

        passwordInput.minLength = 6;
        passwordInput.maxLength = 20;
        passwordInput.required = true;

        confirmarPasswordInput.minLength = 6;
        confirmarPasswordInput.maxLength = 20;
        confirmarPasswordInput.required = true;
      }

      document.getElementById("txtNombre").focus();
    });
});

function revisarControl(e, min, max) {
  txt = e.target;
  txt.setCustomValidity("");
  txt.classList.remove("valido");
  txt.classList.remove("novalido");

  // Verificar si el campo está oculto (si es un campo de contraseña y está oculto)
  if (txt.id === "txtPassword" && txt.style.display === "none") {
    return; // No realizar validación si el campo de contraseña está oculto
  }

  // Realizar la validación si no es un campo de contraseña oculto
  if (txt.value.trim().length < min || txt.value.trim().length > max) {
    txt.setCustomValidity("Campo no válido");
    txt.classList.add("novalido");
  } else {
    txt.classList.add("valido");
  }
}

function editar(correo) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios"));
  let usuario = usuarios.find((element) => element.correo === correo);

  document.getElementById("txtNombre").value = usuario.nombre;
  document.getElementById("txtEmail").value = usuario.correo;
  document.getElementById("txtCorreoOriginal").value = usuario.correo;
  document.getElementById("txtTelefono").value = usuario.telefono;
}

function cargarTabla() {
  let usuarios = JSON.parse(localStorage.getItem("usuarios"));
  let tbody = document.querySelector("#tblUsuarios tbody");

  // Limpiar contenido previo de la tabla
  tbody.innerHTML = "";

  for (var i = 0; i < usuarios.length; i++) {
    let usuario = usuarios[i];
    let fila = document.createElement("tr");

    // Celdas de los datos de usuario
    let celdaNombre = document.createElement("td");
    celdaNombre.innerText = usuario.nombre;
    fila.appendChild(celdaNombre);

    let celdaCorreo = document.createElement("td");
    celdaCorreo.innerText = usuario.correo;
    fila.appendChild(celdaCorreo);

    let celdaTelefono = document.createElement("td");
    celdaTelefono.innerText = usuario.telefono;
    fila.appendChild(celdaTelefono);

    // Celda para botones de acción
    let celdaAcciones = document.createElement("td");

    // Botón de editar
    let btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.className = "btn btn-primary me-2";
    btnEditar.setAttribute("data-bs-toggle", "modal");
    btnEditar.setAttribute("data-bs-target", "#mdlRegistro");
    btnEditar.value = usuario.correo;
    btnEditar.onclick = function () {
      editar(i);
    };
    celdaAcciones.appendChild(btnEditar);

    // Botón de eliminar
    let btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "btn btn-danger me-2";
    btnEliminar.onclick = function () {
      eliminar(usuario.correo,usuario.nombre);
    };
    celdaAcciones.appendChild(btnEliminar);
    // Botón de cambiar contraseña
    let btnCambiarPassword = document.createElement("button");
    btnCambiarPassword.textContent = "Cambiar contraseña";
    btnCambiarPassword.className = "btn btn-primary me-2";
    btnCambiarPassword.setAttribute("data-bs-toggle", "modal");
    btnCambiarPassword.setAttribute("data-bs-target", "#mdlModificarPassword");
    btnCambiarPassword.value = usuario.correo;
    btnCambiarPassword.onclick = function () {
      cambiarPassword(usuario.correo);
    };
    celdaAcciones.appendChild(btnCambiarPassword);

    fila.appendChild(celdaAcciones);

    tbody.appendChild(fila);
  }
}

// función para cambiar la contraseña de un usuario 
function cambiarPassword(correo){
  document.getElementById("btnAceptarPassword").addEventListener("click", (e) => {
    let alert = e.target.parentElement.querySelector(".alert");

    if (alert) {
      alert.remove();
    }

    e.target.form.classList.add("validado");
    // debugger;
    let txtCambioPassword = document.getElementById("txtCambioPassword");
    let txtConfirmarPassword = document.getElementById("txtConfirmPassword");
    txtCambioPassword.setCustomValidity("");
    txtConfirmarPassword.setCustomValidity("");

    if (
      txtCambioPassword.value.trim().length < 6 ||
      txtCambioPassword.value.trim().length > 20
    ) {
      txtCambioPassword.setCustomValidity(
        "La longitud de la contraseña no cumple con los caracteres requeridos (entre 2 y 60 caracteres)"
      );
    }
    if (
      txtConfirmarPassword.value.trim().length < 6 ||
      txtConfirmarPassword.value.trim().length > 20
    ) {
      txtConfirmarPassword.setCustomValidity(
        "La longitud de la contraseña no cumple con los caracteres requeridos (entre 2 y 60 caracteres)"
      );
    }
    let error = document.getElementById("divmensaje");
    if (
      txtCambioPassword.value.trim() != txtConfirmarPassword.value.trim()
    ) {
      txtConfirmarPassword.setCustomValidity(
        "Las contraseñas deben coincidir"
      );
      error.innerText = "Las contraseñas deben coincidir";
    }else{
      debugger;
      error.innerText = "La longitud de la contraseña no cumple con los caracteres requeridos (entre 2 y 60 caracteres)";
      txtConfirmarPassword.setCustomValidity("");
    }
    if (e.target.form.checkValidity()) {
      let usuarios = JSON.parse(localStorage.getItem("usuarios"));
      let usuarioIndex = usuarios.findIndex(
        (element) => element.correo === correo
      );
      usuarios[usuarioIndex].password = txtConfirmarPassword.value.trim();
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }else {
      e.preventDefault();
    }

  });
}

function eliminar(correo,nombre) {

  document.getElementById("spanUsuarioEliminar").innerText = nombre;
  let modalEliminar = new bootstrap.Modal(
    document.getElementById("mdlConfirmacionEliminar")
  );
  modalEliminar.show();

  // Configurar el evento de clic para el botón de confirmar eliminación
  document.getElementById("btnConfirmarEliminar").onclick = function () {
    let usuarios = JSON.parse(localStorage.getItem("usuarios"));
    let index = usuarios.findIndex((element) => element.correo === correo);
    if (index !== -1) {
      usuarios.splice(index, 1); // Elimina el usuario del array
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      cargarTabla(); // Vuelve a cargar la tabla para reflejar los cambios
    } else {
      console.log("El usuario no se encontró");
    }
    modalEliminar.hide();
  };
}

function inicializarDatos() {
  let usuarios = localStorage.getItem("usuarios");
  if (!usuarios) {
    usuarios = [
      {
        nombre: "Uriel Perez Gomez",
        correo: "uriel@gmail.com",
        password: "123456",
        telefono: "",
      },
      {
        nombre: "Lorena Garcia Hernandez",
        correo: "lorena@gmail.com",
        password: "567890",
        telefono: "4454577468",
      },
    ];

    //let usuarios=[];
    usuarios.push({
      nombre: "Uriel Perez Gomez",
      correo: "uriel1@gmail.com",
      password: "123456",
      telefono: "",
    });
    usuarios.push({
      nombre: "Lorena Garcia Hernandez",
      correo: "lorena1@gmail.com",
      password: "567890",
      telefono: "4454577468",
    });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
}
