
const CART_KEY = "nexusplayCarrito";

let carrito = [];

function cargarCarrito() {
    try {
        const guardado = localStorage.getItem(CART_KEY);
        carrito = guardado ? JSON.parse(guardado) : [];

        if (!Array.isArray(carrito)) {
            carrito = [];
        }
    } catch (error) {
        carrito = [];
    }
}

function guardarCarrito() {
    localStorage.setItem(CART_KEY, JSON.stringify(carrito));
    mostrarCarrito();
}

// AGREGAR PRODUCTOS
function addToCart(nombre, precio) {
    precio = Number(precio);

    if (!nombre || !Number.isFinite(precio) || precio < 0) {
        alert("No se pudo agregar este producto.");
        return;
    }

    const productoExistente = carrito.find(
        producto => producto.nombre === nombre
    );

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    guardarCarrito();
    alert(nombre + " agregado al carrito");
}

// MOSTRAR CARRITO Y CALCULAR TOTAL
function mostrarCarrito() {
    const lista = document.querySelector("[data-cart-list]");
    const totalElemento = document.querySelector("[data-cart-total]");
    const contador = document.querySelector("[data-cart-count]");

    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;
        cantidadTotal += producto.cantidad;
    });

    // Actualizar contador
    if (contador) {
        contador.textContent = cantidadTotal;
    }

    // Actualizar total
    if (totalElemento) {
        totalElemento.textContent = total.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        });
    }

    // Mostrar productos
    if (lista) {
        lista.innerHTML = "";

        if (carrito.length === 0) {
            lista.innerHTML = "<li>Tu carrito está vacío.</li>";
            return;
        }

        carrito.forEach((producto, indice) => {
            const elemento = document.createElement("li");

            elemento.innerHTML = `
                <span>
                    ${producto.nombre} 
                    x ${producto.cantidad}
                    — ${(
                        producto.precio * producto.cantidad
                    ).toLocaleString("es-CO")} COP
                </span>

                <button type="button" onclick="eliminarProducto(${indice})">
                    Eliminar
                </button>
            `;

            lista.appendChild(elemento);
        });
    }
}

// ELIMINAR UN PRODUCTO
function eliminarProducto(indice) {
    if (indice < 0 || indice >= carrito.length) return;

    carrito.splice(indice, 1);
    guardarCarrito();
}

// VACIAR TODO EL CARRITO
function clearCart() {
    carrito = [];
    guardarCarrito();
}

// HACER LAS FUNCIONES ACCESIBLES DESDE EL HTML
window.addToCart = addToCart;
window.clearCart = clearCart;
window.eliminarProducto = eliminarProducto;

// INICIAR CARRITO AL CARGAR LA PÁGINA
document.addEventListener("DOMContentLoaded", function () {
    cargarCarrito();
    mostrarCarrito();
});
