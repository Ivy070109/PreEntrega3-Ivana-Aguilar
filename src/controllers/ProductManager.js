import { ProductService } from "../services/products.mongo.dao.js"

const productService = new ProductService()

class ProductManager {
    constructor() {
    }

    //leer los productos
    readProducts = async () => {
        try {
            return await productService.readProducts()
        } catch (err) {
            return err.message
        }
    }

    //creación de productos
    addProduct = async (product) => {
        try {
            return await productService.addProduct(product)
        } catch (err) {
            return err.message
        }
    }

    //obtener todos los productos    
    getProducts = async (limit, page, category, sort) => {
        try {
            return await productService.getProducts(limit, page, category, sort)
        } catch (err) {
            return err.message
        }
    }

    //Obtener productos según su id
    getProductById = async (pid) => {
        try {
            return await productService.getProductById(pid)
        } catch (err) {
            return err.message
        }
    }

    //Actualizar productos según su id
    updateProduct = async (pid, objModif) => {
        try {
            return await productService.updateProductById(pid, objModif)
        } catch (err) {
            return err.message
        }
    }

    //Borrar productos según su id
    deleteProductById = async (pid) => {
        try {
            return await productService.deleteProductById(pid)
        } catch (err) {
            return err.message
        }
    }
}

export default ProductManager