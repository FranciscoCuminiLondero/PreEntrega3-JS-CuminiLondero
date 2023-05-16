// Cargar archivo JSON
const cargarProductos = async () => {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error al cargar el archivo JSON:', error);
        return [];
    }
};

// Variables globales
let productos = [];
let botonAgregar = document.querySelectorAll('.add-product');
let listaProductos = document.getElementById('product-list');
let total = 0;
let hayProductos;

// Llamar a la función para cargar los productos
cargarProductos()
    .then((data) => {
        productos = data;
    });

// Agregar producto a la lista
botonAgregar.forEach((boton) => {
    boton.addEventListener('click', () => {
        const index = boton.dataset.index;
        const producto = productos[index];
        const nombre = producto.nombre;
        const precio = producto.precio;
        const nuevoProducto = document.createElement('li');
        nuevoProducto.innerText = `${nombre}: $${precio}`;
        const eliminarBtn = document.createElement('button');
        eliminarBtn.innerText = 'Eliminar';
        eliminarBtn.addEventListener('click', () => {
            total -= parseInt(precio);
            nuevoProducto.remove();
            boton.disabled = false;
            actualizarTotal();
            if (listaProductos.childElementCount === 0) {
                location.reload();
            }
        });
        nuevoProducto.appendChild(eliminarBtn);
        listaProductos.appendChild(nuevoProducto);
        total += parseInt(precio);
        actualizarTotal();
        hayProductos = true;
        document.querySelector('.checkout').style.display = 'block';
        boton.disabled = true;
        window.location.href = '#product-list';
    });
});

// Función para actualizar el elemento #total
const actualizarTotal = () => {
    document.getElementById('total').innerText = `Total: $${total} ARS`;
};

// Selección del botón de "Finalizar Compra"
const checkoutBtn = document.querySelector('.checkout');

// Selección de los elementos del formulario y del mensaje de agradecimiento
const formContainer = document.querySelector('#form-container');
const nombreInput = document.querySelector('#nombre');
const apellidoInput = document.querySelector('#apellido');
const dniInput = document.querySelector('#dni');
const emailInput = document.querySelector('#email');
const enviarBtn = document.querySelector('#enviar');
const mensajeDiv = document.querySelector('#mensaje');

// Evento de clic en el botón de Finalizar Compra
checkoutBtn.addEventListener('click', () => {
    formContainer.style.display = 'block';
    formContainer.scrollIntoView({ behavior: "smooth" });
});

// Evento de clic en el botón de Enviar del formulario
enviarBtn.addEventListener('click', (event) => {
    event.preventDefault();
    if (nombreInput.value && apellidoInput.value && dniInput.value && emailInput.checkValidity()) {
        formContainer.style.display = 'none';
        mensajeDiv.innerText = `Gracias por tu compra, a la brevedad nos comunicaremos con usted en su casilla de correo: ${emailInput.value}!`;
        mensajeDiv.style.display = 'block';
        if (nombreInput.value && apellidoInput.value && dniInput.value && emailInput.checkValidity()) {
            formContainer.style.display = 'none';
            const confirmacion = confirm(`El total de su compra es de $${total} ARS. ¿Desea finalizar la compra?`);
            if (confirmacion) {
                formContainer.style.display = 'block';
                mensajeDiv.style.display = 'block';
                mensajeDiv.scrollIntoView({ behavior: "smooth" });
                mensajeDiv.innerText = `Gracias por tu compra de $${total} ARS, a la brevedad nos comunicaremos con usted en su casilla de correo: ${emailInput.value}! Para coordinar el pago.`;
                setTimeout(() => {
                    location.reload();
                }, 5000);
            } else {
                mensajeDiv.style.display = 'none';
            }
        }
    } else {
        mensajeDiv.innerText = 'Por favor complete todos los campos correctamente. Gracias.';
        mensajeDiv.style.display = 'block';
        mensajeDiv.scrollIntoView({ behavior: "smooth" });
    }
});

// Ocultar el botón de "Finalizar Compra" si no hay productos
if (!hayProductos) {
    checkoutBtn.style.display = 'none';
}
