const TicketDAO = require('../dao/ticketDao');

const TicketService = {
  async generateTicket(cart, purchaser, callback) {
    try {
      // Calcular el monto total de la compra a partir del carrito
      const amount = cart.products.reduce((total, product) => {
        return total + product.product.price * product.quantity;
      }, 0);
      console.log('tiene amount', amount);

      // Generar un código de ticket único utilizando async/await
      const code = await new Promise((resolve) => {
        generateTicketCode((code) => {
          resolve(code);
        });
      });

      // Crear un nuevo ticket con los datos proporcionados
      const ticketData = {
        code,
        purchase_datetime: new Date(),
        amount,
        purchaser,
        products: cart.products,
      };

      try {
        // Guardar el ticket en la base de datos utilizando el DAO
        TicketDAO.createTicket(ticketData, (error, createdTicket) => {
          if (error) {
            console.error('Error al generar el ticket:', error);
            callback('Error al generar el ticket', null);
          } else {
            // Ejecutar el callback con el ticket recién creado
            callback(null, createdTicket);
          }
        });
        return ticketData;
      } catch (error) {
        console.error('Error al generar el ticket:', error);
        callback('Error al generar el ticket', null);
      }
    } catch (error) {
      console.error('Error al generar el ticket:', error);
      callback('Error al generar el ticket', null);
    }
  },
};

const generateTicketCode = (callback) => {
  // Simulación de una operación asincrónica para generar un código de ticket único
  setTimeout(() => {
    // Generar un código de ticket único, por ejemplo, combinando un prefijo con una marca de tiempo
    const prefix = 'TICKET-';
    const timestamp = Date.now();
    const code = prefix + timestamp;

    // Ejecutar el callback con el código de ticket generado
    callback(code);
  }, 0);
};

module.exports = TicketService;
