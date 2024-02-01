export default class TicketDTO {
    constructor(ticket) {
        this.ticket = ticket
        this.ticket.code = ticket.code.toString(),
        this.ticket.purchase_datetime = ticket.purchase_datetime.trim(),
        this.ticket.amount = ticket.amount,
        this.ticket.purchaser = ticket.purchaser.toLowerCase().trim()
    }
}