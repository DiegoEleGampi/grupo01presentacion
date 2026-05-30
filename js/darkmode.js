/* ══ Harrow School — Dark Mode ══ */
(function () {
    "use strict";

    const btn = document.getElementById("btnDarkMode");
    const icon = document.getElementById("iconDarkMode");
    const KEY = "harrow-dark-mode";

    function activarDark() {
        document.body.classList.add("dark-mode");
        localStorage.setItem(KEY, "true");
        if (icon) {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
        }
    }

    function desactivarDark() {
        document.body.classList.remove("dark-mode");
        localStorage.setItem(KEY, "false");
        if (icon) {
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
        }
    }

    // Aplicar al cargar la página
    if (localStorage.getItem(KEY) === "true") {
        activarDark();
    }

    // Botón toggle
    if (btn) {
        btn.addEventListener("click", function () {
            if (document.body.classList.contains("dark-mode")) {
                desactivarDark();
            } else {
                activarDark();
            }
        });
    }
})();