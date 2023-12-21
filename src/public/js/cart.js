const fetchData = async () => {
    const authToken = localStorage.getItem('authToken');
    console.log('que tiene authToken', authToken);

    if (!authToken) {
        console.log('No se encontró un token de autorización en el almacenamiento local.');
        return;
    }
    showProducts();
    setupAddToCartButtons();

};


const showProducts = async () => {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    };
    console.log('que tiene ', headers);
    const method = 'GET';

    try {
        const response = await fetch('/views/product', {
            headers,
            method,
        });

        if (!response.ok) {
            console.log('Error en la solicitud: ', response.status);
            return;
        }


        const producto = await response.json();
        const nombre = document.createElement('h1')
        console.log('que tiene nombre: ', nombre)
        nombre.innerHTML = `
        <h1>Bienvenido ${producto.usuario.name} !</h1>`;
        productList.appendChild(nombre);

        producto.products.forEach(product => {
            const listItem = document.createElement('li');

            listItem.innerHTML = `
                <br>----------------------------------------</br>
                <strong>ID:</strong> ${product._id}<br>
                <strong>Title:</strong> ${product.title}<br>
                <strong>Precio:</strong> $${product.price}<br>
                <strong>Description:</strong> ${product.description}<br>
                <strong>Code:</strong> ${product.code}<br>
                <strong>Status:</strong> ${product.status}<br>
                <strong>Stock:</strong> ${product.stock}<br>
                <strong>Category:</strong> ${product.category}<br>
                <strong>Thumbnails:</strong> ${product.thumbnails}<br>
                <br>
                <form class="addToCartForm">
                    <button type="submit" data-product="${product._id}">Agregar al Carrito</button><br>
                </form>
            `;
            productList.appendChild(listItem);
        });

        setupAddToCartButtons();
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    showProducts();
});



const setupAddToCartButtons = async () => {

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    };
    console.log('que tiene ', headers);
    const method = 'GET';

    try {
        const response = await fetch('/views/product', {
            headers,
            method,
        });

        if (!response.ok) {
            console.log('Error en la solicitud: ', response.status);
            return;
        }

        const producto = await response.json();

        const { cartId } = producto
        console.log('carrito id:', cartId)
        console.log('Valor del nuevo cart ID:', cartId);

        const addToCartForms = document.querySelectorAll('.addToCartForm');
        addToCartForms.forEach(addToCartForm => {
            addToCartForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const productId = event.target.querySelector('button').getAttribute('data-product');
                if (productId) {
                    try {

                        console.log(productId)
                        const url = `/carts/product/${productId}`;

                        console.log('que tiene URL: ', url)
                        const response = await fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ productId, cartId }),
                        });

                        if (response.ok) {
                            console.log('Producto agregado al carrito:', productId);

                        } else {
                            console.log('Error al agregar el producto al carrito.');
                        }
                    } catch (error) {
                        console.error('Error al agregar el producto al carrito:', error);
                    }
                } else {
                    console.log('Error: No se pudo obtener el ID del producto.');
                }
            });
        });
        const verCarritoButton = document.getElementById('verCarritoButton');
        if (verCarritoButton) {
          verCarritoButton.addEventListener('click', () => {
            window.location.href = `/views/carritos/${cartId}`;
          });
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
};


