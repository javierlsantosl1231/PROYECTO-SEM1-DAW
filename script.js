// Se asegura de que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Referencias al DOM (Elementos del formulario) ---
    const form = document.getElementById('formulario-registro');
    
    const inputNombre = document.getElementById('form-nombre');
    const inputCategoria = document.getElementById('form-categoria');
    const inputDescripcion = document.getElementById('form-descripcion');
    
    const msgNombre = document.getElementById('msg-nombre');
    const msgCategoria = document.getElementById('msg-categoria');
    const msgDescripcion = document.getElementById('msg-descripcion');
    
    const contenedorAlertas = document.getElementById('contenedor-alertas');
    const spinnerCarga = document.getElementById('spinner-carga');
    const contenedorRegistros = document.getElementById('contenedor-registros');
    const contadorTotal = document.getElementById('contador-total');
    const mensajeVacio = document.getElementById('mensaje-vacio');

    // Arreglo en JavaScript para representar datos del proyecto (Estructura repetitiva)
    let registrosProyecto = [];
    let totalRegistros = 0;

    // --- 2. Event Listeners para Validación en Tiempo Real ---
    inputNombre.addEventListener('input', validarNombre);
    inputNombre.addEventListener('blur', validarNombre);

    inputCategoria.addEventListener('change', validarCategoria);
    inputCategoria.addEventListener('blur', validarCategoria);

    inputDescripcion.addEventListener('input', validarDescripcion);
    inputDescripcion.addEventListener('blur', validarDescripcion);

    form.addEventListener('submit', manejarSubmit);


    // --- 3. Funciones Reutilizables de Interfaz ---

    function establecerError(input, contenedorMensaje, mensaje) {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        
        contenedorMensaje.className = 'mt-1 p-2 small rounded d-block alert alert-danger mb-0';
        contenedorMensaje.innerHTML = `<i class="bi bi-x-circle-fill me-1"></i> ${mensaje}`;
    }

    function establecerExito(input, contenedorMensaje, mensaje) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        
        contenedorMensaje.className = 'mt-1 p-2 small rounded d-block alert alert-success mb-0';
        contenedorMensaje.innerHTML = `<i class="bi bi-check-circle-fill me-1"></i> ${mensaje}`;
    }

    function limpiarFormulario() {
        form.reset();
        const inputs = [inputNombre, inputCategoria, inputDescripcion];
        const msgs = [msgNombre, msgCategoria, msgDescripcion];
        
        inputs.forEach(input => input.classList.remove('is-valid', 'is-invalid'));
        msgs.forEach(msg => {
            msg.className = 'd-none';
            msg.innerHTML = '';
        });
    }


    // --- 4. Funciones Específicas de Validación Lógica ---

    function validarNombre() {
        const valor = inputNombre.value.trim();
        if (valor === '') {
            establecerError(inputNombre, msgNombre, 'El campo nombre no puede estar vacío.');
            return false;
        }
        if (valor.length < 5) {
            establecerError(inputNombre, msgNombre, 'El nombre debe tener al menos 5 caracteres.');
            return false;
        }
        establecerExito(inputNombre, msgNombre, 'Nombre válido.');
        return true;
    }

    function validarCategoria() {
        const valor = inputCategoria.value;
        if (valor === '' || valor === null) {
            establecerError(inputCategoria, msgCategoria, 'Debe seleccionar una categoría o tipo de servicio.');
            return false;
        }
        establecerExito(inputCategoria, msgCategoria, 'Categoría seleccionada correctamente.');
        return true;
    }

    function validarDescripcion() {
        const valor = inputDescripcion.value.trim();
        if (valor === '') {
            establecerError(inputDescripcion, msgDescripcion, 'La descripción es obligatoria.');
            return false;
        }
        if (valor.length < 15) {
            establecerError(inputDescripcion, msgDescripcion, 'Proporcione más información (Mín. 15 caracteres).');
            return false;
        }
        establecerExito(inputDescripcion, msgDescripcion, 'Descripción detallada aceptada.');
        return true;
    }


    // --- 5. Manejador del Evento Submit Principal con Spinner ---

    function manejarSubmit(evento) {
        evento.preventDefault();

        const esNombreValido = validarNombre();
        const esCategoriaValida = validarCategoria();
        const esDescripcionValida = validarDescripcion();

        if (esNombreValido && esCategoriaValida && esDescripcionValida) {
            
            // Mostrar spinner Bootstrap de carga simulada
            spinnerCarga.classList.remove('d-none');
            form.querySelector('button[type="submit"]').disabled = true;

            setTimeout(() => {
                spinnerCarga.classList.add('d-none');
                form.querySelector('button[type="submit"]').disabled = false;

                // Crear objeto de registro
                const datosRegistro = {
                    id: Date.now(),
                    nombre: inputNombre.value.trim(),
                    categoria: inputCategoria.value,
                    descripcion: inputDescripcion.value.trim()
                };

                // Guardar en el arreglo estructurado
                registrosProyecto.push(datosRegistro);

                // Renderizar datos dinámicamente
                renderizarRegistros();
                limpiarFormulario();
                mostrarNotificacionGeneral('¡El registro ha sido almacenado en el sistema con éxito!', 'success');

            }, 1000); // Retraso simulado de 1 segundo

        } else {
            mostrarNotificacionGeneral('Error: Verifique que todos los campos del formulario estén correctos.', 'danger');
        }
    }


    // --- 6. Renderizado Dinámico mediante Arreglos y Tarjetas Bootstrap ---

    function renderizarRegistros() {
        contenedorRegistros.innerHTML = '';
        totalRegistros = registrosProyecto.length;
        actualizarContadorUI();

        // Estructura repetitiva (forEach) para recorrer los registros
        registrosProyecto.forEach((item) => {
            const colDiv = document.createElement('div');
            colDiv.className = 'col-md-6 mb-3';

            const cardDiv = document.createElement('div');
            cardDiv.className = 'card bg-dark text-light border border-info border-opacity-25 h-100 shadow-sm';
            cardDiv.style.background = 'rgba(12, 30, 60, 0.8)';
            cardDiv.style.backdropFilter = 'blur(6px)';

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body d-flex flex-column justify-content-between p-3';

            // Condición para determinar el estilo del badge según la categoría
            let badgeStyle = 'bg-info text-dark';
            if (item.categoria === 'Incidente de Seguridad') badgeStyle = 'bg-danger text-light';
            if (item.categoria === 'Auditoría OWASP') badgeStyle = 'bg-warning text-dark';
            if (item.categoria === 'Soporte de Infraestructura') badgeStyle = 'bg-success text-light';

            cardBody.innerHTML = `
                <h4 class="h6 card-title text-uppercase m-0 fw-bold border-bottom border-secondary pb-1" style="color: var(--cyan-neon);">
                    ${item.nombre}
                </h4>
                <span class="badge ${badgeStyle} my-2 align-self-start text-uppercase small font-monospace">
                    ${item.categoria}
                </span>
                <p class="card-text text-secondary-emphasis small mb-4 text-light">
                    ${item.descripcion}
                </p>
            `;

            // Botón de detalles (abre el Modal Bootstrap)
            const btnDetalle = document.createElement('button');
            btnDetalle.className = 'btn btn-outline-info btn-sm mb-2';
            btnDetalle.innerHTML = '<i class="bi bi-eye me-1"></i>Ver Detalles (Modal)';
            btnDetalle.addEventListener('click', () => {
                document.getElementById('modal-nombre-txt').textContent = item.nombre;
                document.getElementById('modal-cat-txt').textContent = item.categoria;
                document.getElementById('modal-desc-txt').textContent = item.descripcion;
                
                const modalBootstrap = new bootstrap.Modal(document.getElementById('modalDetalleRegistro'));
                modalBootstrap.show();
            });

            // Botón Eliminar
            const botonEliminar = document.createElement('button');
            botonEliminar.className = 'btn btn-outline-danger btn-sm mt-auto';
            botonEliminar.innerHTML = '<i class="bi bi-trash3 me-1"></i>Eliminar Registro';
            
            botonEliminar.addEventListener('click', function() {
                registrosProyecto = registrosProyecto.filter(r => r.id !== item.id);
                renderizarRegistros();
                mostrarNotificacionGeneral('Registro eliminado de la consola.', 'warning');
            });

            cardBody.appendChild(btnDetalle);
            cardBody.appendChild(botonEliminar);
            cardDiv.appendChild(cardBody);
            colDiv.appendChild(cardDiv);
            contenedorRegistros.appendChild(colDiv);
        });
    }

    function actualizarContadorUI() {
        contadorTotal.textContent = totalRegistros;
        // Condición para mostrar mensaje de vacío si no hay elementos
        if (totalRegistros === 0) {
            mensajeVacio.style.display = 'block';
        } else {
            mensajeVacio.style.display = 'none';
        }
    }

    function mostrarNotificacionGeneral(mensaje, tipo) {
        contenedorAlertas.innerHTML = '';
        const alerta = document.createElement('div');
        alerta.className = `alert alert-${tipo} alert-dismissible fade show small mb-0`;
        alerta.role = 'alert';
        alerta.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        contenedorAlertas.appendChild(alerta);
        
        setTimeout(() => {
            if (alerta.parentNode) alerta.remove();
        }, 3500);
    }
});
