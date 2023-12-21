const TicketDAO = require('../dao/ticketDao');

const TicketService = {
  async generateTicket(cart, purchaser, callback) {
    try {

      const amount = cart.products.reduce((total, product) => {
        return total + product.product.price * product.quantity;
      }, 0);



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

            callback('Error al generar el ticket', null);
          } else {

            callback(null, createdTicket);
          }
        });
        return ticketData;
      } catch (error) {

        callback('Error al generar el ticket', null);
      }
    } catch (error) {

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
