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
                card.addEventListener("mouseover", () => img.style.transform = "scale(1.05) rotate(2deg)");
                card.addEventListener("mouseout", () => img.style.transform = "scale(1) rotate(0)");

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
            let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
            const orderDetails = document.getElementById("orderDetails");
            const totalPrice = document.getElementById("totalPrice");
        
            if (!orderDetails || !totalPrice) return;
        
            orderDetails.innerHTML = "";
            let total = 0;
        
            pedidos.forEach((pedido, index) => {
                const item = document.createElement("div");
                item.classList.add("pedido-item");
        
                item.innerHTML = `
                <img src="${pedido.imagen}" class="pedido-img">
                <div class="pedido-info">
                    <p class="pedido-nombre">${pedido.nombre}</p>
                    <p class="pedido-precio">C$<span class="pedido-precio-total">${pedido.precio * pedido.cantidad}</span></p> <br>
                    <div class="pedido-contador">
                        <button class="btn-restar" data-index="${index}">-</button>
                        <span class="pedido-cantidad">${pedido.cantidad}</span>
                        <button class="btn-sumar" data-index="${index}">+</button>
                    </div>
                </div>
            `;
            
        
                orderDetails.appendChild(item);
                total += pedido.precio * pedido.cantidad;
            });
        
            totalPrice.textContent = total;
            document.getElementById("orderModal").style.display = "flex";
        
            // **Eventos para los botones de sumar y restar dentro del modal**
            document.querySelectorAll(".btn-sumar").forEach(btn => {
                btn.addEventListener("click", function () {
                    let index = this.getAttribute("data-index");
                    pedidos[index].cantidad++;
                    actualizarPedidoModal(pedidos);
                });
            });
        
            document.querySelectorAll(".btn-restar").forEach(btn => {
                btn.addEventListener("click", function () {
                    let index = this.getAttribute("data-index");
                    if (pedidos[index].cantidad > 1) {
                        pedidos[index].cantidad--;
                    } else {
                        pedidos.splice(index, 1); // **Elimina el producto si llega a 0**
                    }
                    actualizarPedidoModal(pedidos);
                });
            });

            function actualizarPedidoModal(pedidos) {
                localStorage.setItem("pedidos", JSON.stringify(pedidos));
                mostrarPedidoEnModal(); // Vuelve a renderizar el modal con los cambios
            }
            
        }
    
    document.getElementById("whatsapp-button")?.addEventListener("click", () => {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        let mensaje = "Buen dia! \nMe gustaria ordenar: \n\n";
    
        let total = 0;
        pedidos.forEach(pedido => {
            mensaje += `${pedido.nombre} x${pedido.cantidad} - C$${pedido.precio * pedido.cantidad} Cordobas\n`;
            total += pedido.precio * pedido.cantidad; 
        });
    
        mensaje += `\nTotal a pagar: C$${total} Cordobas`;
    
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
