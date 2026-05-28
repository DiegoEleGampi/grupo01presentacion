(function () {
    "use strict";

    const form = document.getElementById("admisionForm");
    if (!form) return;

    const btn = document.getElementById("btnEnviarAdmision");
    const boxExito = document.getElementById("admisionExito");
    const boxError = document.getElementById("admisionError");
    const textoExito = document.getElementById("textoAdmisionExito");
    const textoError = document.getElementById("textoAdmisionError");
    const btnHtmlOriginal = '<i class="fa fa-paper-plane me-2"></i>Enviar solicitud';

    const ACCESS_KEY = "4880cb53-98e8-4480-91e0-fc8f125c8cab";

    const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü][A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]{1,49}$/;
    const REGEX_EMAIL  = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
    const REGEX_TELEFONO = /^9[0-9]{8}$/;

    const GRADOS_VALIDOS = ["p1","p2","p3","p4","p5","p6","s1","s2","s3","s4","s5"];
    const TIPOS_VALIDOS  = ["nuevo","traslado"];

    const GRADO_MAP = {
        p1: "Primaria — 1° grado", p2: "Primaria — 2° grado",
        p3: "Primaria — 3° grado", p4: "Primaria — 4° grado",
        p5: "Primaria — 5° grado", p6: "Primaria — 6° grado",
        s1: "Secundaria — 1° año",  s2: "Secundaria — 2° año",
        s3: "Secundaria — 3° año",  s4: "Secundaria — 4° año",
        s5: "Secundaria — 5° año",
    };

    const TIPO_MAP = {
        nuevo: "Alumno nuevo",
        traslado: "Alumno por traslado",
    };

    // ── Definición de campos con sus validadores ──
    const campos = {
        nombre_apoderado: {
            el: document.getElementById("nombre_apoderado"),
            error: null,
            validar() {
                const v = this.el.value.trim();
                if (!v) return "El nombre del apoderado es obligatorio.";
                if (!REGEX_NOMBRE.test(v)) return "Solo letras (mínimo 2 caracteres).";
                return "";
            }
        },
        apellido_apoderado: {
            el: document.getElementById("apellido_apoderado"),
            error: null,
            validar() {
                const v = this.el.value.trim();
                if (!v) return "El apellido del apoderado es obligatorio.";
                if (!REGEX_NOMBRE.test(v)) return "Solo letras (mínimo 2 caracteres).";
                return "";
            }
        },
        email: {
            el: document.getElementById("email"),
            error: null,
            validar() {
                const v = this.el.value.trim();
                if (!v) return "El correo es obligatorio.";
                if (!REGEX_EMAIL.test(v)) return "Ingresa un correo válido (ej: nombre@gmail.com).";
                return "";
            }
        },
        telefono: {
            el: document.getElementById("telefono"),
            error: null,
            validar() {
                const v = this.el.value.trim();
                if (!v) return "El teléfono es obligatorio.";
                if (!REGEX_TELEFONO.test(v)) return "El celular debe tener 9 dígitos y comenzar con 9.";
                return "";
            }
        },
        alumno_nombre: {
            el: document.getElementById("alumno_nombre"),
            error: null,
            validar() {
                const v = this.el.value.trim();
                if (!v) return "El nombre del postulante es obligatorio.";
                if (v.length < 3) return "Ingresa el nombre completo del postulante.";
                return "";
            }
        },
        grado: {
            el: document.getElementById("grado"),
            error: null,
            validar() {
                const v = this.el.value;
                if (!v) return "Selecciona el grado al que postula.";
                if (!GRADOS_VALIDOS.includes(v)) return "Grado no válido.";
                return "";
            }
        },
        tipo_ingreso: {
            el: document.getElementById("tipo_ingreso"),
            error: null,
            validar() {
                const v = this.el.value;
                if (!v) return "Selecciona el tipo de ingreso.";
                if (!TIPOS_VALIDOS.includes(v)) return "Tipo de ingreso no válido.";
                return "";
            }
        }
        // mensaje es opcional, no se valida
    };

    // ── Crear divs de error dinámicamente debajo de cada campo ──
    Object.keys(campos).forEach(function (key) {
        const campo = campos[key];
        if (!campo.el) return;
        const div = document.createElement("div");
        div.className = "invalid-feedback";
        div.id = "error_" + key;
        campo.el.parentElement.insertAdjacentElement("afterend", div);
        campo.error = div;
    });

    // ── Helpers ──
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
        boxExito.scrollIntoView({ behavior: "smooth", block: "nearest" });
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

    // ── Filtros de entrada ──
    function filtrarSoloNumeros(input, key) {
        input.addEventListener("input", function () {
            const limpio = this.value.replace(/\D/g, "").slice(0, 9);
            if (this.value !== limpio) this.value = limpio;
            validarCampo(key);
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

    if (campos.telefono.el)        filtrarSoloNumeros(campos.telefono.el, "telefono");
    if (campos.nombre_apoderado.el) filtrarSoloLetras(campos.nombre_apoderado.el, "nombre_apoderado");
    if (campos.apellido_apoderado.el) filtrarSoloLetras(campos.apellido_apoderado.el, "apellido_apoderado");

    // ── Validar al perder foco ──
    Object.keys(campos).forEach(function (key) {
        if (campos[key].el) {
            campos[key].el.addEventListener("blur", function () {
                validarCampo(key);
            });
        }
    });

    // ── Envío del formulario con Web3Forms ──
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

        // Construir el mensaje para Web3Forms
        const gradoTexto  = GRADO_MAP[campos.grado.el.value] || campos.grado.el.value;
        const tipoTexto   = TIPO_MAP[campos.tipo_ingreso.el.value] || campos.tipo_ingreso.el.value;
        const mensajeOpc  = document.getElementById("mensaje")
                            ? document.getElementById("mensaje").value.trim() || "Sin comentarios adicionales."
                            : "Sin comentarios adicionales.";

        const payload = {
            access_key: ACCESS_KEY,
            subject: "Harrow School — Nueva solicitud de admisión 2026",
            from_name: "Harrow School Web",
            name: campos.nombre_apoderado.el.value.trim() + " " + campos.apellido_apoderado.el.value.trim(),
            email: campos.email.el.value.trim(),
            message:
                "📋 SOLICITUD DE ADMISIÓN 2026\n\n" +
                "── DATOS DEL APODERADO ──\n" +
                "Nombre: "    + campos.nombre_apoderado.el.value.trim() + " " + campos.apellido_apoderado.el.value.trim() + "\n" +
                "Correo: "    + campos.email.el.value.trim() + "\n" +
                "Teléfono: "  + campos.telefono.el.value.trim() + "\n\n" +
                "── DATOS DEL POSTULANTE ──\n" +
                "Nombre: "         + document.getElementById("alumno_nombre").value.trim() + "\n" +
                "Grado solicitado: " + gradoTexto + "\n" +
                "Tipo de ingreso: "  + tipoTexto + "\n\n" +
                "── COMENTARIOS ──\n" + mensajeOpc
        };

        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.success) {
                    mostrarExito("¡Solicitud enviada! Un asesor de admisiones se comunicará contigo pronto.");
                } else {
                    mostrarError(data.message || "No se pudo enviar la solicitud. Inténtalo de nuevo.");
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