(function () {
    "use strict";

    const form = document.getElementById("contactForm");
    if (!form) return;

    const btn = document.getElementById("btnEnviar");
    const boxExito = document.getElementById("mensajeExito");
    const boxError = document.getElementById("mensajeError");
    const textoExito = document.getElementById("textoExito");
    const textoError = document.getElementById("textoError");
    const btnHtmlOriginal = '<i class="fa fa-paper-plane me-2"></i>Enviar mensaje';

    const ACCESS_KEY = "4880cb53-98e8-4480-91e0-fc8f125c8cab";

    const ASUNTOS_VALIDOS = ["admision", "becas", "pensiones", "academico", "sga", "otro"];
    const ASUNTO_MAP = {
        admision:  "Admisión y Matrícula 2026",
        becas:     "Programa de Becas",
        pensiones: "Información sobre Pensiones",
        academico: "Consulta Académica",
        sga:       "Sistema SGA",
        otro:      "Otro",
    };

    const REGEX_NOMBRE   = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü][A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]{1,49}$/;
    const REGEX_EMAIL    = /^[a-zA-Z0-9._%+-]+@((gmail|outlook|hotmail)\.com|senati\.com\.pe|senati\.pe)$/i;
    const REGEX_TELEFONO = /^9[0-9]{8}$/;

    const campos = {
        nombre: {
            el: document.getElementById("nombre"),
            error: document.getElementById("errorNombre"),
            validar: function () {
                const v = this.el.value.trim();
                if (!v) return "El nombre es obligatorio.";
                if (!REGEX_NOMBRE.test(v)) return "Solo letras (mínimo 2 caracteres).";
                return "";
            }
        },
        apellido: {
            el: document.getElementById("apellido"),
            error: document.getElementById("errorApellido"),
            validar: function () {
                const v = this.el.value.trim();
                if (!v) return "El apellido es obligatorio.";
                if (!REGEX_NOMBRE.test(v)) return "Solo letras (mínimo 2 caracteres).";
                return "";
            }
        },
        email: {
            el: document.getElementById("email"),
            error: document.getElementById("errorEmail"),
            validar: function () {
                const v = this.el.value.trim();
                if (!v) return "El correo es obligatorio.";
                if (!REGEX_EMAIL.test(v)) {
                    return "Usa @gmail.com, @outlook.com, @hotmail.com, @senati.com.pe o @senati.pe (ej: nombre@gmail.com).";
                }
                return "";
            }
        },
        telefono: {
            el: document.getElementById("telefono"),
            error: document.getElementById("errorTelefono"),
            validar: function () {
                const v = this.el.value.trim();
                if (!v) return "";
                if (!REGEX_TELEFONO.test(v)) {
                    return "El celular debe tener 9 dígitos y comenzar con 9.";
                }
                return "";
            }
        },
        asunto: {
            el: document.getElementById("asunto"),
            error: document.getElementById("errorAsunto"),
            validar: function () {
                const v = this.el.value;
                if (!v) return "Selecciona un asunto.";
                if (ASUNTOS_VALIDOS.indexOf(v) === -1) return "Asunto no válido.";
                return "";
            }
        },
        mensaje: {
            el: document.getElementById("mensaje"),
            error: document.getElementById("errorMensaje"),
            validar: function () {
                const v = this.el.value.trim();
                if (!v) return "El mensaje es obligatorio.";
                if (v.length < 10) return "El mensaje debe tener al menos 10 caracteres.";
                if (v.length > 1000) return "El mensaje no puede superar 1000 caracteres.";
                return "";
            }
        }
    };

    function ocultarMensajes() {
        boxExito.style.display = "none";
        boxError.style.display = "none";
    }

    function mostrarExito(mensaje) {
        ocultarMensajes();
        textoExito.textContent = mensaje;
        boxExito.style.display = "block";
        limpiarEstados();
        form.reset();
        actualizarContadorMensaje();
    }

    function mostrarError(mensaje) {
        ocultarMensajes();
        textoError.textContent = mensaje;
        boxError.style.display = "block";
    }

    function marcarCampo(campo, mensaje) {
        const tieneError = Boolean(mensaje);
        campo.el.classList.toggle("is-invalid", tieneError);
        campo.el.classList.toggle("is-valid", !tieneError && campo.el.value.trim() !== "");
        if (campo.error) {
            campo.error.textContent = mensaje;
            campo.error.style.display = tieneError ? "block" : "none";
        }
    }

    function limpiarEstados() {
        Object.keys(campos).forEach(function (key) {
            const campo = campos[key];
            campo.el.classList.remove("is-invalid", "is-valid");
            if (campo.error) {
                campo.error.textContent = "";
                campo.error.style.display = "none";
            }
        });
    }

    function validarCampo(key) {
        const campo = campos[key];
        const mensaje = campo.validar();
        marcarCampo(campo, mensaje);
        return mensaje === "";
    }

    function validarFormulario() {
        let valido = true;
        Object.keys(campos).forEach(function (key) {
            if (!validarCampo(key)) valido = false;
        });
        return valido;
    }

    function actualizarContadorMensaje() {
        const contador = document.getElementById("contadorMensaje");
        if (!contador || !campos.mensaje.el) return;
        const len = campos.mensaje.el.value.length;
        contador.textContent = len + " / 1000";
    }

    function filtrarSoloNumeros(input) {
        input.addEventListener("input", function () {
            const limpio = this.value.replace(/\D/g, "").slice(0, 9);
            if (this.value !== limpio) this.value = limpio;
            validarCampo("telefono");
        });
        input.addEventListener("keypress", function (e) {
            if (e.key.length === 1 && !/[0-9]/.test(e.key)) e.preventDefault();
        });
    }

    function filtrarSoloLetras(input, key) {
        input.addEventListener("input", function () {
            this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]/g, "");
            validarCampo(key);
        });
    }

    filtrarSoloNumeros(campos.telefono.el);
    filtrarSoloLetras(campos.nombre.el, "nombre");
    filtrarSoloLetras(campos.apellido.el, "apellido");

    campos.mensaje.el.addEventListener("input", function () {
        if (this.value.length > 1000) this.value = this.value.slice(0, 1000);
        actualizarContadorMensaje();
        validarCampo("mensaje");
    });

    Object.keys(campos).forEach(function (key) {
        campos[key].el.addEventListener("blur", function () {
            validarCampo(key);
        });
    });

    actualizarContadorMensaje();

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        ocultarMensajes();

        if (!validarFormulario()) {
            mostrarError("Revisa los campos marcados en rojo antes de enviar.");
            const primero = form.querySelector(".is-invalid");
            if (primero) primero.focus();
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<i class="fa fa-spinner fa-spin me-2"></i>Enviando...';

        const asuntoTexto = ASUNTO_MAP[campos.asunto.el.value] || campos.asunto.el.value;
        const telefonoVal = campos.telefono.el.value.trim() || "No proporcionado";

        const payload = {
            access_key: ACCESS_KEY,
            subject: "Harrow School — Nuevo mensaje de contacto: " + asuntoTexto,
            from_name: "Harrow School Web",
            name: campos.nombre.el.value.trim() + " " + campos.apellido.el.value.trim(),
            email: campos.email.el.value.trim(),
            message:
                "📩 MENSAJE DE CONTACTO\n\n" +
                "── DATOS DEL REMITENTE ──\n" +
                "Nombre: "   + campos.nombre.el.value.trim() + " " + campos.apellido.el.value.trim() + "\n" +
                "Correo: "   + campos.email.el.value.trim() + "\n" +
                "Teléfono: " + telefonoVal + "\n\n" +
                "── ASUNTO ──\n" + asuntoTexto + "\n\n" +
                "── MENSAJE ──\n" + campos.mensaje.el.value.trim()
        };

        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.success) {
                    mostrarExito("¡Mensaje enviado! Nos comunicaremos contigo pronto.");
                } else {
                    mostrarError(data.message || "No se pudo enviar el mensaje. Revisa los datos e inténtalo de nuevo.");
                }
            })
            .catch(function () {
                mostrarError("No se pudo conectar. Verifica tu conexión a internet e inténtalo de nuevo.");
            })
            .finally(function () {
                btn.disabled = false;
                btn.innerHTML = btnHtmlOriginal;
            });
    });
})();