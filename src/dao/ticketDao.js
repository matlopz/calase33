const Ticket = require('../models/ticket.models')

const TicketDAO = {
  async createTicket(ticketData) {
    try {
      const newTicket = new Ticket(ticketData);
      return await newTicket.save();
    } catch (error) {

      throw new Error('Error al crear el ticket');
    }
  },

  async getTicketById(ticketId) {
    try {
      return await Ticket.findById(ticketId);
    } catch (error) {

      throw new Error('Error al obtener el ticket');
    }
  },
};

module.exports = TicketDAO;
