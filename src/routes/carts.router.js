import { Router } from "express"
import CartManager from "../controllers/CartManager.js"
import TicketManager from "../controllers/TicketManager.js"
import { handlePolicies } from "../middlewares/athenticate.js"

const cart = new CartManager()
const ticket = new TicketManager()
const router = Router()

//ver todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await cart.getCarts()
    
        return res.status(200).send({ status: "OK", data: carts })    
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

//obtener carrito por id
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const foundCart = await cart.getCartById(cid)
        if (!foundCart) {
            return res.status(404).send({ status: 'ERR', message: 'Carrito no encontrado'})
        }
    
        return res.status(200).send({ status: "OK", data: foundCart })    
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

//crear carrito
router.post('/', async (req, res) => {
    try {
        const product = req.body
        const newCart = await cart.addCart(product)
        
        return res.status(200).send({ status: 'OK', data: newCart })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

//modificar carrito
router.put(':/cid', handlePolicies(['USER']), async (req, res) => {
    try {
        const { cid } = req.params
        const { newProducts } = req.body 
        const updated = await cart.updateCart(cid, newProducts)
        if (!updated) {
            return res.status(400).send({ status: 'ERR', message: 'El carrito no se encuentra' })
        }
        return res.status(200).send({ status: 'OK', data: updated })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

//eliminar carrito por id
router.delete('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid
        const deleteCart = await cart.deleteCart(cid)

        if (deleteCart === true) {
            res.status(200).send({ status: 'OK', data: deleteCart})
        } else {
            res.status(404).send({ status: 'ERR', data: 'Carrito no encontrado'})
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

//agregar producto en carrito
router.post('/:cid/products/:pid', handlePolicies(['USER']), async (req, res) => {
    try {
        const { cid, pid } = req.params
        const addProduct = await cart.addProductInCart(cid, pid)
        return res.status(200).send({ status: 'OK', data: addProduct })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

//actualizar cantidad de productos
router.put('/:cid/products/:pid', handlePolicies(['USER']), async (req, res) => {
    try {
        const { pid, cid } = req.params
        const { quantity } = req.body

        const updateCart = await cart.updateProductInCart(cid, pid, quantity)
        return res.status(200).send({ status: 'OK', data: updateCart })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

//eliminar del carrito el producto seleccionado
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const deleteProduct = await cart.deleteProductInCart(cid, pid)
        return res.status(200).send({ status: 'OK', data: deleteProduct })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

router.delete('/:cid/clear', async (req, res) => {
    try {
        const cartId = req.params.cid
        const result = await cart.deleteAllProductsInCart(cartId)

        return res.status(200).send(result)
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

router.param('cid', async (req, res, next, pid) => {
    const regex = new RegExp(/^[a-fA-F0-9]{24}$/)
    if (regex.test(req.params.cid)) {
        next()
    } else {
        res.status(404).send({ status: 'ERR', data: 'Parámetro no válido' })
    }
})  

// finalizacion de compras 
router.post('/:cid/purchase', handlePolicies(['USER']), async (req, res) => {
    try {
        const cartId = req.params.cid
        const email = req.user.email
        const result = await ticket.createTicket(cartId, email)

        res.status(200).send({ status: 'OK', data: result })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

export default router