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
    const contenedorRegistros = document.getElementById('contenedor-registros');
    const contadorTotal = document.getElementById('contador-total');
    const mensajeVacio = document.getElementById('mensaje-vacio');

    let totalRegistros = 0;

    // --- 2. Event Listeners para validación en tiempo real (input, blur, change) ---
    
    // Eventos para el campo Nombre
    inputNombre.addEventListener('input', validarNombre);
    inputNombre.addEventListener('blur', validarNombre);

    // Eventos para el campo Categoría (select usa 'change' y 'blur')
    inputCategoria.addEventListener('change', validarCategoria);
    inputCategoria.addEventListener('blur', validarCategoria);

    // Eventos para el campo descripción
    inputDescripcion.addEventListener('input', validarDescripcion);
    inputDescripcion.addEventListener('blur', validarDescripcion);

    // Evento Submit del formulario
    form.addEventListener('submit', manejarSubmit);


    // --- 3. Funciones reutilizables de interfaz ---

    /**
     * Aplica estilos de error (is-invalid y alert-danger)
     */
    function establecerError(input, contenedorMensaje, mensaje) {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        
        contenedorMensaje.className = 'mt-1 p-2 small rounded d-block alert alert-danger mb-0';
        contenedorMensaje.innerHTML = `<i class="bi bi-x-circle-fill me-1"></i> ${mensaje}`;
    }

    /**
     * Aplica estilos de éxito (is-valid y alert-success)
     */
    function establecerExito(input, contenedorMensaje, mensaje) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        
        contenedorMensaje.className = 'mt-1 p-2 small rounded d-block alert alert-success mb-0';
        contenedorMensaje.innerHTML = `<i class="bi bi-check-circle-fill me-1"></i> ${mensaje}`;
    }

    /**
     * Limpia completamente los estilos de validación del formulario
     */
    function limpiarFormulario() {
        form.reset();
        
        const inputs = [inputNombre, inputCategoria, inputDescripcion];
        const msgs = [msgNombre, msgCategoria, msgDescripcion];
        
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
        
        msgs.forEach(msg => {
            msg.className = 'd-none';
            msg.innerHTML = '';
        });
    }

    // --- 4. Funciones Específicas de validación lógica ---

    function validarNombre() {
        const valor = inputNombre.value.trim();
        
        // Regla 1: No debe estar vacío
        if (valor === '') {
            establecerError(inputNombre, msgNombre, 'El campo nombre no puede estar vacío.');
            return false;
        }
        
        // Regla 2: Longitud mínima
        if (valor.length < 5) {
            establecerError(inputNombre, msgNombre, 'El nombre debe tener al menos 5 caracteres.');
            return false;
        }

        // Si pasa todas las reglas:
        establecerExito(inputNombre, msgNombre, 'Nombre válido.');
        return true;
    }

    function validarCategoria() {
        const valor = inputCategoria.value;
        
        // Regla 1: Debe seleccionar una opción válida (diferente del valor por defecto)
        if (valor === '' || valor === null) {
            establecerError(inputCategoria, msgCategoria, 'Debe seleccionar una categoría o tipo de servicio.');
            return false;
        }

        establecerExito(inputCategoria, msgCategoria, 'Categoría seleccionada correctamente.');
        return true;
    }

    function validarDescripcion() {
        const valor = inputDescripcion.value.trim();
        
        // Regla 1: No debe estar vacío
        if (valor === '') {
            establecerError(inputDescripcion, msgDescripcion, 'La descripción es obligatoria.');
            return false;
        }

        // Regla 2: Información suficiente (mínimo de caracteres)
        if (valor.length < 15) {
            establecerError(inputDescripcion, msgDescripcion, 'Proporcione más información (Mín. 15 caracteres).');
            return false;
        }

        establecerExito(inputDescripcion, msgDescripcion, 'Descripción detallada aceptada.');
        return true;
    }

    // --- 5. Manejador del evento Submit Principal ---

    function manejarSubmit(evento) {
        // PREVENIR COMPORTAMIENTO POR DEFECTO (Recarga de página)
        evento.preventDefault();

        // Forzar todas las validaciones antes de procesar
        const esNombreValido = validarNombre();
        const esCategoriaValida = validarCategoria();
        const esDescripcionValida = validarDescripcion();

        // Comprobar si todas las reglas pasan exitosamente
        if (esNombreValido && esCategoriaValida && esDescripcionValida) {
            
            // Recolectar datos
            const datosRegistro = {
                nombre: inputNombre.value.trim(),
                categoria: inputCategoria.value,
                descripcion: inputDescripcion.value.trim()
            };

            // Crear el registro dinámico en el DOM
            crearRegistroDinamico(datosRegistro);
            
            // Resetear el formulario tras éxito
            limpiarFormulario();
            
            // Mostrar notificación de éxito general
            mostrarNotificacionGeneral('¡El registro ha sido almacenado en el sistema con éxito!', 'success');

        } else {
            // Mostrar notificación de error general
            mostrarNotificacionGeneral('Error: Verifique que todos los campos del formulario estén correctos.', 'danger');
        }
    }

    // --- 6. Lógica de creación, gestión y eliminación de registros dinámicos ---

    function crearRegistroDinamico(datos) {
        totalRegistros++;
        actualizarContadorUI();

        // Contenedor columna
        const colDiv = document.createElement('div');
        colDiv.className = 'col-md-6 mb-3';

        // Estructura de la tarjeta card (Glassmorphism)
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card bg-dark text-light border border-info border-opacity-25 h-100 shadow-sm';
        cardDiv.style.background = 'rgba(12, 30, 60, 0.8)';
        cardDiv.style.backdropFilter = 'blur(6px)';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body d-flex flex-column justify-content-between p-3';

        // Determinar Badge según la categoría
        let badgeStyle = 'bg-info text-dark';
        if (datos.categoria === 'Incidente de Seguridad') badgeStyle = 'bg-danger text-light';
        if (datos.categoria === 'Auditoría OWASP') badgeStyle = 'bg-warning text-dark';
        if (datos.categoria === 'Soporte de Infraestructura') badgeStyle = 'bg-success text-light';

        // Elementos internos dinámicos
        cardBody.innerHTML = `
            <h4 class="h6 card-title text-uppercase m-0 fw-bold border-bottom border-secondary pb-1" style="color: var(--cyan-neon);">
                ${datos.nombre}
            </h4>
            <span class="badge ${badgeStyle} my-2 align-self-start text-uppercase small font-monospace">
                ${datos.categoria}
            </span>
            <p class="card-text text-secondary-emphasis small mb-4 text-light">
                ${datos.descripcion}
            </p>
        `;

        // Botón Eliminar utilizando createElement para poder adjuntarle el EventListener de forma segura
        const botonEliminar = document.createElement('button');
        botonEliminar.className = 'btn btn-outline-danger btn-sm w-100 mt-auto';
        botonEliminar.innerHTML = '<i class="bi bi-trash3 me-1"></i>Eliminar Registro';
        
        // Manejar evento de eliminación
        botonEliminar.addEventListener('click', function() {
            colDiv.remove();
            totalRegistros--;
            actualizarContadorUI();
            mostrarNotificacionGeneral('Registro eliminado de la consola.', 'warning');
        });

        // Ensamblar DOM (appendChild)
        cardBody.appendChild(botonEliminar);
        cardDiv.appendChild(cardBody);
        colDiv.appendChild(cardDiv);
        contenedorRegistros.appendChild(colDiv);
    }

    function actualizarContadorUI() {
        contadorTotal.textContent = totalRegistros;
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
        
        // Eliminar automáticamente tras 3.5 segundos
        setTimeout(() => {
            if (alerta.parentNode) alerta.remove();
        }, 3500);
    }

    // 1. Arreglo de objetos para renderizar el catálogo con botones para abrir el Modal
    const catalogoServicios = [
        {
            titulo: "Desarrollo Web Seguro",
            descripcion: "Creación de sitios corporativos y aplicaciones optimizados bajo normativas estrictas contra vulnerabilidades web.",
            categoria: "Desarrollo Web",
            disponible: true
        },
        {
            titulo: "Auditoría y Pentesting",
            descripcion: "Pruebas de penetración controladas para identificar y mitigar fallos antes de que sean explotados por terceros.",
            categoria: "Ciberseguridad",
            disponible: true
        },
        {
            titulo: "Infraestructura y Redes",
            descripcion: "Soporte técnico especializado, mantenimiento preventivo de equipos y configuración segura de redes.",
            categoria: "Mantenimiento IT",
            disponible: true
        },
        {
            titulo: "Consultoría Integral",
            descripcion: "Asesoría estratégica para el cumplimiento de normativas de protección de datos y gestión de riesgos.",
            categoria: "Ciberseguridad",
            disponible: false
        },
        {
            titulo: "Infraestructura y Redes",
            descripcion: "Soporte Técnico Red, mantenimiento preventivo de equipos y configuración de infraestructura de red.",
            categoria: "Mantenimiento IT",
            disponible: true
        }
    ];

    const contenedorCatalogo = document.getElementById('contenedorCatalogo');
    const modalTextoDetalle = document.getElementById('modalTextoDetalle');
    const modalElement = document.getElementById('modalDetalleServicio');
    const bootstrapModal = new bootstrap.Modal(modalElement);

    function renderizarCatalogo() {
        if (!contenedorCatalogo) return;
        contenedorCatalogo.innerHTML = '';

        for (const servicio of catalogoServicios) {
            const colDiv = document.createElement('div');
            colDiv.className = 'col-md-6 col-lg-3';

            const cardDiv = document.createElement('div');
            cardDiv.className = 'card card-custom h-100 p-3 border shadow-sm';

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body d-flex flex-column justify-content-between';

            let badgeEstadoHtml = servicio.disponible 
                ? '<span class="badge bg-success mb-2">Disponible</span>' 
                : '<span class="badge bg-secondary mb-2">Próximamente</span>';

            cardBody.innerHTML = `
                <div>
                    ${badgeEstadoHtml}
                    <h5 class="card-title fw-bold text-info">${servicio.titulo}</h5>
                    <p class="card-text text-muted small">${servicio.descripcion}</p>
                </div>
                <div>
                    <span class="badge bg-dark text-light mb-3 d-block">${servicio.categoria}</span>
                    <button class="btn btn-outline-info btn-sm w-100 btn-detalles">Ver Detalles</button>
                </div>
            `;

            // Evento para activar el Modal de Bootstrap con la información del servicio
            const btnDetalles = cardBody.querySelector('.btn-detalles');
            btnDetalles.addEventListener('click', () => {
                modalTextoDetalle.innerHTML = `<strong>${servicio.titulo}</strong><br><br>${servicio.descripcion}<br><br><em>Categoría: ${servicio.categoria}</em>`;
                bootstrapModal.show();
            });

            cardDiv.appendChild(cardBody);
            colDiv.appendChild(cardDiv);
            contenedorCatalogo.appendChild(colDiv);
        }
    }

    renderizarCatalogo();

    // 2. Lógica del formulario, validaciones, spinner y alertas
    const formRegistro = document.getElementById('formRegistro');
    const inputNombre = document.getElementById('inputNombre');
    const inputDescripcion = document.getElementById('inputDescripcion');
    const inputCategoria = document.getElementById('inputCategoria');
    const contenedorLista = document.getElementById('contenedorLista');
    const contadorRegistros = document.getElementById('contadorRegistros');
    const mensajeVacio = document.getElementById('mensajeVacio');
    const alertaGeneral = document.getElementById('alerta-general');
    const spinnerCarga = document.getElementById('spinnerCarga');

    let totalRegistros = 0;

    function actualizarContador() {
        contadorRegistros.textContent = totalRegistros;
        mensajeVacio.classList.toggle('d-none', totalRegistros > 0);
    }

    function validarNombre() {
        const valido = inputNombre.value.trim().length >= 3;
        inputNombre.classList.toggle('is-valid', valido);
        inputNombre.classList.toggle('is-invalid', !valido);
        return valido;
    }

    function validarDescripcion() {
        const valido = inputDescripcion.value.trim().length >= 10;
        inputDescripcion.classList.toggle('is-valid', valido);
        inputDescripcion.classList.toggle('is-invalid', !valido);
        return valido;
    }

    function validarCategoria() {
        const valido = inputCategoria.value !== '';
        inputCategoria.classList.toggle('is-valid', valido);
        inputCategoria.classList.toggle('is-invalid', !valido);
        return valido;
    }

    inputNombre.addEventListener('input', validarNombre);
    inputDescripcion.addEventListener('input', validarDescripcion);
    inputCategoria.addEventListener('change', validarCategoria);

    formRegistro.addEventListener('submit', (evento) => {
        evento.preventDefault();

        if (!validarNombre() || !validarDescripcion() || !validarCategoria()) {
            mostrarAlertaGeneral('Por favor, corrija los campos marcados en rojo.', 'danger');
            return;
        }

        // Mostrar spinner de Bootstrap simulando proceso de guardado
        spinnerCarga.classList.remove('d-none');
        formRegistro.style.opacity = '0.5';

        setTimeout(() => {
            spinnerCarga.classList.add('d-none');
            formRegistro.style.opacity = '1';

            const nombre = inputNombre.value.trim();
            const descripcion = inputDescripcion.value.trim();
            const categoria = inputCategoria.value;

            totalRegistros++;
            actualizarContador();
            crearTarjetaRegistro(nombre, descripcion, categoria);

            formRegistro.reset();
            inputNombre.classList.remove('is-valid', 'is-invalid');
            inputDescripcion.classList.remove('is-valid', 'is-invalid');
            inputCategoria.classList.remove('is-valid', 'is-invalid');

            mostrarAlertaGeneral('¡Registro agregado correctamente al sistema!', 'success');
        }, 1000);
    });

    function crearTarjetaRegistro(nombre, descripcion, categoria) {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-md-6';

        const cardDiv = document.createElement('div');
        cardDiv.className = 'card card-custom h-100 p-3 border shadow-sm';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body d-flex flex-column justify-content-between';

        cardBody.innerHTML = `
            <div>
                <span class="badge bg-info text-dark mb-2">${categoria}</span>
                <h5 class="card-title fw-bold text-primary">${nombre}</h5>
                <p class="card-text text-muted small">${descripcion}</p>
            </div>
            <button class="btn btn-outline-danger btn-sm mt-3 align-self-start btn-eliminar">Eliminar Registro</button>
        `;

        cardBody.querySelector('.btn-eliminar').addEventListener('click', () => {
            colDiv.remove();
            totalRegistros--;
            actualizarContador();
            mostrarAlertaGeneral('Registro eliminado correctamente.', 'warning');
        });

        cardDiv.appendChild(cardBody);
        colDiv.appendChild(cardDiv);
        contenedorLista.appendChild(colDiv);
    }

    function mostrarAlertaGeneral(mensaje, tipo) {
        if (!alertaGeneral) return;
        alertaGeneral.textContent = mensaje;
        alertaGeneral.className = `alert alert-${tipo} mb-3 shadow-sm`;
        alertaGeneral.classList.remove('d-none');

        setTimeout(() => {
            alertaGeneral.classList.add('d-none');
        }, 4000);
    }
});