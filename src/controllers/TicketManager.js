import { TicketService } from "../services/ticket.mongo.dao.js"

const ticketService = new TicketService()

class TicketManager {
    constructor() {
    }

    createTicket = async (idCart, email) => {
        try {
            return await ticketService.create(idCart, email)
        } catch (err) {
            return err.message
        }
    }
}

export default TicketManager