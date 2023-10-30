const Ticket = require('../models/ticket.models') 

const TicketDAO = {
  async createTicket(ticketData) {
    try {
      const newTicket = new Ticket(ticketData);
      return await newTicket.save();
    } catch (error) {
      console.error('Error al crear el ticket en la base de datos:', error);
      throw new Error('Error al crear el ticket');
    }
  },

  async getTicketById(ticketId) {
    try {
      return await Ticket.findById(ticketId);
    } catch (error) {
      console.error('Error al obtener el ticket desde la base de datos:', error);
      throw new Error('Error al obtener el ticket');
    }
  },
};

module.exports = TicketDAO;
