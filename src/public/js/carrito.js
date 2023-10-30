const fetchData = async () => {
    const authToken = localStorage.getItem('authToken');
    console.log('que tiene authToken', authToken);

    if (!authToken) {
        console.log('No se encontró un token de autorización en el almacenamiento local.');
        return;
    }
 


};


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
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
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
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ cartId: cartId }),
        });

        if (response.ok) {
            
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
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
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

async function finalizePurchase() {
    const urlActual = window.location.href;
    const partesURL = urlActual.split('/');
    const cartId = partesURL[partesURL.length - 1];
    
    if (cartId) {
      try {
        const response = await fetch(`/views/carts/${cartId}/purchase`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({ cartId: cartId }),
        });
  
        if (response.ok) {
       
          const summary = await response.json();
  
          
          const summaryModal = document.getElementById('purchaseSummaryModal');
          const closeSummaryModal = document.getElementById('closeSummaryModal');
          const modalContent = document.querySelector('.modal-content');
          
          closeSummaryModal.onclick = function() {
            summaryModal.style.display = 'none';
          }
          
          window.onclick = function(event) {
            if (event.target == summaryModal) {
              summaryModal.style.display = 'none';
            }
          }
          
          // Agrega el contenido del resumen de la compra
       
const totalAmount = document.createElement('p');
totalAmount.textContent = `Total a Pagar: $${summary.ticket.amount}`;
modalContent.appendChild(totalAmount);


const code = document.createElement('p');
code.textContent = `Código de Ticket: ${summary.ticket.code}`;
modalContent.appendChild(code);

const purchaseDatetime = document.createElement('p');
purchaseDatetime.textContent = `Fecha de Compra: ${new Date(summary.ticket.purchase_datetime).toLocaleString()}`;
modalContent.appendChild(purchaseDatetime);

const purchaser = document.createElement('p');
purchaser.textContent = `Comprador: ${summary.ticket.purchaser}`;
modalContent.appendChild(purchaser);

// Añade los productos del ticket
const products = document.createElement('ul');
products.textContent = 'Productos:';
summary.ticket.products.forEach((product) => {
  const productItem = document.createElement('li');
  productItem.textContent = `Nombre: ${product.product.title}, Precio: $${product.product.price}, Cantidad: ${product.quantity}`;
  products.appendChild(productItem);
});
modalContent.appendChild(products);

          
          summaryModal.style.display = 'block';
        } else {
          console.error('Error al finalizar la compra');
          
        }
      } catch (error) {
        console.error('Error de red al finalizar la compra:', error);
      }
    } else {
      console.log('cartId es undefined. Verifica la URL.');
    }
  }
  
  
  

