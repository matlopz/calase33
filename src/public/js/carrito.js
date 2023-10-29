async function incrementQuantity(productId) {
    const quantityElement = document.getElementById(`quantity_${productId}`);
    let currentQuantity = parseInt(quantityElement.textContent);
    currentQuantity += 1;
    quantityElement.textContent = currentQuantity;

    const urlActual = window.location.href;
    const partesURL = urlActual.split('/');
    const cartId = partesURL[partesURL.length - 1];

    if (cartId) {
      
        try {
            const response = await fetch(`/views/carts/product/${productId}/increment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cartId: cartId }),
            });
            if (response.ok) {
              
            } else {
               
                console.error('Error al incrementar la cantidad en el carrito');
            }
        } catch (error) {
            console.error('Error de red al incrementar la cantidad en el carrito:', error);
        }
    } else {
        console.log('cartId es undefined. Verifica la URL.');
    }
}


async function deleteProductAndReload(productId, cartId) {
    try {
        console.log('que tienen estos valors',cartId,)
        const response = await fetch(`/views/carts/product/${productId}/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cartId: cartId }),
        });

        if (response.ok) {
            // Eliminación exitosa, recarga la página para reflejar los cambios
            setTimeout(() => {
                window.location.reload();
            }, 100);
        } else {
            console.error('Error al eliminar el producto del carrito');
        }
    } catch (error) {
        console.error('Error de red al eliminar el producto del carrito:', error);
    }
}

async function decrementQuantity(productId) {
    const quantityElement = document.getElementById(`quantity_${productId}`);
    let currentQuantity = parseInt(quantityElement.textContent);

    if (currentQuantity > 0) {
        currentQuantity -= 1;
        quantityElement.textContent = currentQuantity;

    const urlActual = window.location.href;
    const partesURL = urlActual.split('/');
    const cartId = partesURL[partesURL.length - 1];

        if (currentQuantity === 0) {
            deleteProductAndReload(productId, cartId);
            const cartItem = document.querySelector(`li[data-product-id="${productId}"]`);
            if (cartItem) {
                cartItem.remove();
            }
           
        } else {
            try {
                const response = await fetch(`/views/carts/product/${productId}/decrement`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ cartId: cartId }),
                });
                if (response.ok) {
                } else {
                    console.error('Error al decrementar la cantidad en el carrito');
                }
            } catch (error) {
                console.error('Error de red al decrementar la cantidad en el carrito:', error);
            }
        }
    }
}



