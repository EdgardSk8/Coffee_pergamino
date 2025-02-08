document.addEventListener("DOMContentLoaded", () => {
    fetch('menu.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el JSON');
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error('Formato incorrecto de JSON');
            }

            const container = document.getElementById('menu-container');
            if (!container) return;

            data.forEach(item => {
                // Crear los elementos de la tarjeta
                const card = document.createElement('div');
                card.classList.add('card');

                const cardInterior = document.createElement('div');
                cardInterior.classList.add('card-interior');

                const cardImagen = document.createElement('div');
                cardImagen.classList.add('card-imagen');

                const img = document.createElement('img');
                img.classList.add('card-img');
                img.src = item.imagen;
                img.alt = item.nombre;

                // Efecto al pasar el mouse
                img.addEventListener("mouseover", () => img.style.transform = "scale(1.05) rotate(2deg)");
                img.addEventListener("mouseout", () => img.style.transform = "scale(1) rotate(0)");

                cardImagen.appendChild(img);

                const contenedorTexto = document.createElement('div');
                contenedorTexto.classList.add('contenedor-texto');

                const cardTitle = document.createElement('div');
                cardTitle.classList.add('card-title');
                cardTitle.textContent = item.nombre;

                const cardDescription = document.createElement('div');
                cardDescription.classList.add('card-description');
                cardDescription.textContent = item.descripcion;

                const cardPrecio = document.createElement('div');
                cardPrecio.classList.add('card-precio');
                cardPrecio.textContent = `Precio ${item.precio} C$`;

                // Contenedor de cantidad y botones
                const contenedorPedidos = document.createElement('div');
                contenedorPedidos.classList.add('contenedorpedidos');

                const btnDecrease = document.createElement('button');
                btnDecrease.classList.add('btncantidad');
                btnDecrease.textContent = '-';

                const cantidad = document.createElement('span');
                cantidad.classList.add('cantidad');
                cantidad.textContent = '0';

                const btnIncrease = document.createElement('button');
                btnIncrease.classList.add('btncantidad');
                btnIncrease.textContent = '+';

                contenedorPedidos.appendChild(btnDecrease);
                contenedorPedidos.appendChild(cantidad);
                contenedorPedidos.appendChild(btnIncrease);

                let cantidadActual = 0;

                btnIncrease.addEventListener("click", () => {
                    cantidadActual++;
                    cantidad.textContent = cantidadActual;
                });

                btnDecrease.addEventListener("click", () => {
                    if (cantidadActual > 0) {
                        cantidadActual--;
                        cantidad.textContent = cantidadActual;
                    }
                });

                // Agregar todo al contenedor de texto
                contenedorTexto.appendChild(cardTitle);
                contenedorTexto.appendChild(cardDescription);
                contenedorTexto.appendChild(cardPrecio);
                contenedorTexto.appendChild(contenedorPedidos);

                // Agregar todo a la tarjeta
                cardInterior.appendChild(cardImagen);
                cardInterior.appendChild(contenedorTexto);
                card.appendChild(cardInterior);
                container.appendChild(card);
            });
        })
        .catch(error => console.error('Error al cargar el menú:', error));

    // Manejo del botón de pedido
    const btnOrder = document.getElementById("btnOrder");
    if (btnOrder) {
        btnOrder.addEventListener("click", () => {
            const pedidos = [];
            document.querySelectorAll(".card").forEach(card => {
                const nombre = card.querySelector(".card-title").textContent;
                const imagen = card.querySelector(".card-img").src;
                const cantidad = parseInt(card.querySelector(".cantidad").textContent);
                const precio = parseFloat(card.querySelector(".card-precio").textContent.replace(/[^0-9.]/g, ''));

                if (cantidad > 0) {
                    pedidos.push({ nombre, imagen, cantidad, precio });
                }
            });

            if (pedidos.length === 0) {
                alert("No tienes productos en el pedido.");
                return;
            }

            localStorage.setItem("pedidos", JSON.stringify(pedidos));

            // Mostrar el modal con la información del pedido
            mostrarPedidoEnModal();
        });
    }

    function mostrarPedidoEnModal() {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        const orderDetails = document.getElementById("orderDetails");
        const totalPrice = document.getElementById("totalPrice");
    
        if (!orderDetails || !totalPrice) return;
    
        orderDetails.innerHTML = "";
        let total = 0;
    
        pedidos.forEach(pedido => {
            const item = document.createElement("div");
            item.classList.add("pedido-item");
    
            item.innerHTML = `
                <img src="${pedido.imagen}" class="pedido-img">
                <div class="pedido-info">
                    <p class="pedido-nombre">${pedido.nombre} <span class="pedido-cantidad">x${pedido.cantidad}</span></p>
                    <p class="pedido-precio">C$${pedido.precio * pedido.cantidad}</p>
                </div>
            `;
    
            orderDetails.appendChild(item);
            total += pedido.precio * pedido.cantidad;
        });
    
        totalPrice.textContent = total;
        document.getElementById("orderModal").style.display = "flex";
    }

    document.getElementById("whatsapp-button")?.addEventListener("click", () => {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        let mensaje = "Pedido:\n\n";
    
        let total = 0;
        pedidos.forEach(pedido => {
            mensaje += `${pedido.nombre} x${pedido.cantidad} - C$${pedido.precio * pedido.cantidad}\n`;
            total += pedido.precio * pedido.cantidad;
        });
    
        mensaje += `\nTotal a pagar: C$${total}`;
    
        // Número de WhatsApp al que enviar el mensaje (sin el "+")
        const numeroWhatsApp = "50578021069"; // Cambia este número por el real
    
        // Crear el enlace de WhatsApp con el mensaje codificado correctamente
        const mensajeCodificado = encodeURIComponent(mensaje);
        const url = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
    
        // Usar window.location.href para forzar la redirección
        window.location.href = url;  // Esto abrirá WhatsApp directamente con el mensaje
    });
    
    
    
    

    // Cerrar modal
    const closeModal = document.querySelector(".close");
    if (closeModal) {
        closeModal.addEventListener("click", () => {
            document.getElementById("orderModal").style.display = "none";
        });
    }
});
