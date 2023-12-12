// Función para obtener el token de autorización del almacenamiento local
const getAuthToken = () => {
  const authToken = localStorage.getItem('authToken');
  console.log('Token de autorización:', authToken);

  if (!authToken) {
    console.log('No se encontró un token de autorización en el almacenamiento local.');
    return null;
  }

  return authToken;
};


async function showProducts() {
  console.log('Entró a showProducts');
  const productList = document.getElementById('productList');
  productList.innerHTML = '';

  try {
    const response = await fetch('/realTimeProducts/prod', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    console.log('que tiene response:::', response);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      console.error('La respuesta no es de tipo JSON:', response);
      throw new Error('La respuesta no es un objeto JSON válido');
    }

    const productsData = await response.json();
    console.log('que tiene este::::', productsData);

    if (!Array.isArray(productsData.products)) {
      console.error('La respuesta no es un array JSON válido:', productsData.products);
      throw new Error('La respuesta no es un array JSON válido');
    }

    console.log('Productos obtenidos:', productsData.products);

   
    const products = productsData.products;
    products.forEach((product) => {
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
        <strong>Owner:</strong> ${product.owner}</li>
        <br>
        <strong>Thumbnails:</strong> ${product.thumbnails}</li>
      `;
    });
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
  }
}


document.addEventListener('DOMContentLoaded', showProducts);





const updateProductById = async () => {
  const productId = document.getElementById('productId').value;
  console.log('que tiene::', productId);

  const newTitle = document.getElementById('newTitle').value;
  const newPrice = document.getElementById('newPrice').value;
  console.log('que tiene::', newPrice, newTitle);

  const updatedProduct = {
    title: newTitle,
    price: newPrice,
  };

  document.getElementById('editProductByIdBtn').disabled = true;

  try {
    const response = await fetch(`/realTimeProducts/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ updatedProduct }),
    });

    console.log('que tiene response, ', response);
    console.log('Cuerpo de la solicitud:', JSON.stringify({ updatedProduct }));

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const updatedProductResult = await response.json();
    console.log('Producto actualizado:', updatedProductResult);

  } catch (error) {
    console.error('Error al actualizar el producto:', error);
  } finally {
    
    document.getElementById('editProductByIdBtn').disabled = false;
  }
};


document.getElementById('editProductByIdBtn').addEventListener('click', updateProductById);


function deleteProductById() {
  const productId = document.getElementById('deleteProductId').value;
  console.log('que tiene esto:', productId);

  fetch(`/realTimeProducts/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log('Producto eliminado exitosamente');
        // Actualizar la interfaz de usuario si es necesario
      } else {
        console.error('Error al eliminar el producto');
      }
    })
    .catch((error) => console.error('Error al eliminar el producto:', error));
}

// Asignar la función al evento click del botón
document.getElementById('deleteProductByIdBtn').addEventListener('click', deleteProductById);

// Llamar a la función showProducts al cargar la página
document.addEventListener('DOMContentLoaded', showProducts);

// Event listener para el formulario de agregar producto
document.getElementById('addProductForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  // Obtener los valores del formulario
  const productName = document.getElementById('productTitle').value;
  const productPrice = document.getElementById('productPrice').value;
  const productDescription = document.getElementById('productDescription').value;
  const productCode = document.getElementById('productCode').value;
  const productStatus = document.getElementById('productStatus').value;
  const productStock = document.getElementById('productStock').value;
  const productCategory = document.getElementById('productCategory').value;
  

  // Obtener el archivo de entrada (input type="file")
  const fileInput = document.getElementById('productThumbnails');
  const files = fileInput.files;

  // Construir el objeto de FormData
  const formData = new FormData();
  formData.append('title', productName);
  formData.append('price', parseFloat(productPrice));
  formData.append('description', productDescription);
  formData.append('code', productCode);
  formData.append('status', productStatus);
  formData.append('stock', productStock);
  formData.append('category', productCategory);
  formData.append('productThumbnails', files[0]); 
  // Agregar archivos al FormData


  try {
    const response = await fetch('/realTimeProducts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const responseData = await response.json();
      console.log('Respuesta JSON del servidor:', responseData);
      // Actualizar la interfaz de usuario si es necesario
      showProducts();
    } else {
      console.error('La respuesta no es de tipo JSON. Tipo de contenido:', contentType);
    }
  } catch (error) {
    console.error('Error al realizar la solicitud:', error.message);
  }
});
