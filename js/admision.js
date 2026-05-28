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

    function ocultarMensajes() {
        boxExito.style.display = "none";
        boxError.style.display = "none";
    }

    function mostrarExito(mensaje) {
        ocultarMensajes();
        textoExito.textContent = mensaje;
        boxExito.style.display = "block";
        form.reset();
        boxExito.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function mostrarError(mensaje) {
        ocultarMensajes();
        textoError.textContent = mensaje;
        boxError.style.display = "block";
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        ocultarMensajes();
        btn.disabled = true;
        btn.innerHTML = '<i class="fa fa-spinner fa-spin me-2"></i>Enviando...';

        fetch("php/admision.php", { method: "POST", body: new FormData(form) })
            .then(function (res) {
                if (!res.ok) throw new Error("Error del servidor");
                return res.json();
            })
            .then(function (data) {
                if (data.status === "success") {
                    mostrarExito(data.message);
                } else {
                    mostrarError(data.message || "No se pudo enviar la solicitud.");
                }
            })
            .catch(function () {
                mostrarError("No se pudo conectar con el servidor. Usa XAMPP o un hosting con PHP.");
            })
            .finally(function () {
                btn.disabled = false;
                btn.innerHTML = btnHtmlOriginal;
            });
    });
})();
