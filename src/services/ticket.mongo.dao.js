import ticketsModel from '../models/tickets.model.js'
import cartsModel from '../models/carts.model.js'
import productsModel from '../models/products.model.js'

export class TicketService {
    constructor() {
    }

    createTicket = async (idCart, email) => {
        try {
            // genero un código random 
            const code = Math.floor(Math.random() * 1e10).toString().padStart(10, '0')
            //genero la fecha
            const date = new Date().toString()

            let productsPrice = []
            let amount = 0
            const cart = await cartsModel.findOne({ _id: idCart })
            const products = cart.products.toObject()
            for (let i = 0; i < products.length; i++) {
                const product = await productsModel.findOne({ _id: products[i].product._id})
                if (product.stock > 0) {
                    const toPay = product.price * products[i].quantity
                    productsPrice.push(toPay)
                    await cartsModel.findByIdAndUpdate(
                        idCart,
                        { $pull: { products: { product: product._id } } },
                    )
                }
            }
            if (productsPrice.length < 1) return products
            for (let i = 0; i < productsPrice.length; i++) {
                amount += productsPrice[i]                
            }

            const ticket = await ticketsModel.create({ code: code, purchase_datetime: date, amount, purchaser: email })
            return ticket        
        } catch (err) {
            return err.message
        }
    }
}