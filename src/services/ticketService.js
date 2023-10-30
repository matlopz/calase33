const TicketDAO = require('../dao/ticketDao');

const TicketService = {
  async generateTicket(cart, purchaser, callback) {
    try {
      // Calcular el monto total de la compra a partir del carrito
      const amount = cart.products.reduce((total, product) => {
        return total + product.product.price * product.quantity;
      }, 0);
      console.log('tiene amount', amount);

      // Generar un código de ticket único 
      const code = await new Promise((resolve) => {
        generateTicketCode((code) => {
          resolve(code);
        });
      });

      
      const ticketData = {
        code,
        purchase_datetime: new Date(),
        amount,
        purchaser,
        products: cart.products,
      };

      try {
        
        TicketDAO.createTicket(ticketData, (error, createdTicket) => {
          if (error) {
            console.error('Error al generar el ticket:', error);
            callback('Error al generar el ticket', null);
          } else {
        
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
  
  setTimeout(() => {
    
    const prefix = 'TICKET-';
    const timestamp = Date.now();
    const code = prefix + timestamp;


    callback(code);
  }, 0);
};

module.exports = TicketService;
