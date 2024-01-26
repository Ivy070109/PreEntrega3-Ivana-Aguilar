import { Router } from 'express'
import ProductManager from '../controllers/ProductManager.js'
import CartManager from '../controllers/CartManager.js'
import { authToken } from '../utils.js'

const productManager = new ProductManager()
const cartManager = new CartManager()

const router = Router()

router.get('/', async (req, res) => {
    if (req.session.user) {
        const productsList = await productManager.getProducts({})
        res.render('home', { productsList })
    }else {
        res.redirect('/login')
    } 
})

router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts')
})

router.get('/chat', (req, res) => {
    res.render('chat', {})
})

//products solo se mostrará luego de login 
router.get('/products', async (req, res) => {
    const data = await productManager.getProducts(req.query.page, req.query.limit)
    
    data.pages = []
    for (let i = 1; i <= data.totalPages; i++) data.pages.push(i)

    res.render('products', { data })    
})

//caso de ser necesario mantengo la página profile
router.get('/profile', authToken, async (req, res) => {
    // if (req.user) {
    // } else {
    //     res.redirect('/login')
    // }
    res.render('profile', { user: req.user })

})

router.get('/carts', async (req, res) => {
    const cartsProducts = await cartManager.getCarts()
    res.render('carts', { cartsProducts })
})

// Ruta para obtener un carrito por su id.
router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params
    let cart = await cartManager.getCartById(cid)

    res.render('cart', { cart })
})

router.get('/register', async (req, res) => {
    res.render('register', {})
})

router.get('/login', async (req, res) => {
    if (req.session.user) {
        res.redirect('/products')
    } else {
        res.render('login', {})
    } 
})

router.get('/restore', async (req, res) => {
    if (req.session.user) {
        res.redirect('/profile')
    } else {
        res.render('restore', {})
    } 
})

export default router