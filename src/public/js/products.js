const socket = io();

// Mostrar los productos en la lista
function showProducts(products) {
  const productList = document.getElementById('productList');
  

  productList.innerHTML = ''; // Limpiar la lista antes de agregar productos
  products.forEach(product => {
    productList.innerHTML += `
    <br>----------------------------------------</br>
    <strong>ID:</strong> ${product._id}</li>
    <br>
    <strong>Title:</strong> ${product.title}</li>
    <br>
    <strong>Precio:</strong> $${product.price}</li>
    <br>
    <strong>Description:</strong> ${product.description}</li>
    <br>
    <strong>Code:</strong> ${product.code}</li> 
    <br>
    <strong>Status:</strong> ${product.status}</li>
    <br>
    <strong>stock:</strong> ${product.stock}</li>
    <br>
    <strong>Category:</strong> ${product.category}</li>
    <br>
    <strong>Thumbnails:</strong> ${product.thumbnails}</li>
    
    
    `;
  });
}
socket.on('connect', () => {
  console.log('Conectado al servidor de sockets');
});
// Escuchar el evento para recibir la lista de productos actualizada
socket.on('updateProducts', (products) => {
  console.log('Productos actualizados:', products); // Punto de control
  showProducts(products);
});

document.getElementById('editProductByIdBtn').addEventListener('click', () => {
  const productId = document.getElementById('productId').value;
  const newTitle = document.getElementById('newTitle').value;
  const newPrice = parseFloat(document.getElementById('newPrice').value);
  // Obtener otros campos de edición aquí
  
  const updatedProduct = {
    title: newTitle,
    price: newPrice,
    // Otros campos de edición aquí
  };
  
  socket.emit('updateProduct', { productId, updatedProduct });
});


// Agregar event listener para el botón de eliminación por ID
document.getElementById('deleteProductByIdBtn').addEventListener('click', () => {
  const productIdToDelete = document.getElementById('deleteProductId').value;
  socket.emit('deleteProduct', productIdToDelete);
});




document.querySelectorAll('.editBtn').forEach(editButton => {
  editButton.addEventListener('click', () => {
    const productId = editButton.getAttribute('data-product-id');
    socket.emit('getProductDetails', productId);
  });
});

socket.on('productDetails', (product) => {
  fillEditForm(product);
});


document.getElementById('addProductForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const productName = document.getElementById('productTitle').value;
  const productPrice = document.getElementById('productPrice').value;
  const productDescription = document.getElementById('productDescription').value;
  const productCode = document.getElementById('productCode').value;
  const productStatus = document.getElementById('productStatus').value;
  const productStock = document.getElementById('productStock').value;
  const productCategory = document.getElementById('productCategory').value;
  const productThumbnails = document.getElementById('productThumbnails').value;

  socket.emit('addProduct', {
    title: productName,
    price: parseFloat(productPrice),
    description: productDescription,
    code: productCode,
    status: productStatus,
    stock: productStock,
    category: productCategory,
    thumbnails: productThumbnails,
  });

  // Limpiar el formulario después de enviar los datos
  document.getElementById('addProductForm').reset();
});





