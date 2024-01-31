import ticketModel from '../models/tickets.model.js'
import cartsModel from '../models/carts.model.js'
import productModel from '../models/products.model.js'

export class TicketService {
    constructor() {
    }

    createTicket = async (idCart, email) => {
        try { 
            // creo un código único 
            const code = Math.floor(Math.random() * 1e10).toString().padStart(10, '0')

            let productsPrice = []
            let amount = 0
            const cart = await cartsModel.findOne({ _id: idCart })
            const products = cart.products.lean()
            for (let i = 0; i < products.length; i++) {
                const product = await productModel.findOne({ _id: products[i].product._id })
                if (product.stock > 0) {
                    const toPay = product.price * products[i].quantity
                    productsPrice.push(toPay)
                    await cartsModel.findByIdAndUpdate( idCart, {
                        $pull: { products: { product: product._id }}
                    })
                }
            }

            if (productsPrice.length < 1) return products
            for (let i = 0; i < productsPrice.length; i++) {
                amount += productsPrice[i]
            }

            const ticket = await ticketModel.create({ code: code, purchase_datetime, amount, purchaser: email })
            return ticket

        } catch (err) {
            return err.message
        }
    }
}