        function filtrar(tipo, btn) {
            // Actualizar botones
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active', 'all','b1','b2','b3','b4','feriado','evento','vacacion','examen');
            });
            btn.classList.add('active', tipo);

            // Mostrar/ocultar items
            document.querySelectorAll('.tl-item').forEach(item => {
                if (tipo === 'all' || item.dataset.tipo === tipo) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });

            // Mostrar/ocultar separadores de mes
            document.querySelectorAll('.mes-sep').forEach(sep => {
                // Buscar el siguiente item visible
                let next = sep.nextElementSibling;
                let visible = false;
                while (next && !next.classList.contains('mes-sep')) {
                    if (next.classList.contains('tl-item') && !next.classList.contains('hidden')) {
                        visible = true;
                        break;
                    }
                    next = next.nextElementSibling;
                }
                sep.style.display = visible ? '' : 'none';
            });
        }