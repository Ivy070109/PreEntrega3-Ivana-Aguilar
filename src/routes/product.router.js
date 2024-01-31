import { Router } from 'express'
import ProductManager from '../controllers/ProductManager.js'
import { uploader } from '../uploader.js'
import { handlePolicies } from '../middlewares/athenticate.js'

const productManager = new ProductManager()
const router = Router()

router.get("/", async (req, res) => {
    try {
      const { limit, page, category, sort } = req.query

      const result = await productManager.getProducts(limit, page, category, sort)
      //console.log(result)
      res.status(200).send({ status: 'OK', data: result })
    } catch (error) {
        res.status(500).send(error.message)
    }
  })

router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params
    const productFound = await productManager.getProductById(pid)

    res.status(200).send({ status: 'OK', data: productFound})
  } catch (err) {
    res.status(200).send({ status: 'ERR', data: err.message })
  }
})

router.post("/", handlePolicies(['ADMIN']), uploader.single('thumbnail'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send({ status: 'FIL', data: 'No se pudo subir el archivo' })

    const { title, description, price, category, status, code, stock } = req.body
    if (!title || !description || !price || !category || !status || !code || !stock) {
        return res.status(400).send({ status: 'ERR', data: 'Debes proporcionar todos los campos completos. Todos los valores son obligatorios.' })
    }

    const newProduct = {
        title,
        description,
        price,
        category,
        status,
        thumbnail: req.file.filename,
        code,
        stock
    }

    const result = await productManager.addProduct(newProduct)
    res.status(200).send({ status: 'OK', data: result })
  } catch (err) {
    res.status(500).send({ status: 'ERR', data: err.message })
  }
})

router.put("/:pid", handlePolicies(['ADMIN']), async (req, res) => {
  try {
    const { pid } = req.params
    const { title, description, code, price, thumbnail, stock, category, status } = req.body

    if (!title, !description, !code, !price, !thumbnail, !stock, !category, !status) {
      res.status(400).send({ status: 'ERR', data: err.message})
    }

    const productUpdated = await productManager.updateProduct(pid, {title, description, code, price, thumbnail, stock, category, status })

  return res.status(200).send({ status: 'OK', data: productUpdated })
  } catch (err) {
    res.status(500).send({ status: 'ERR', data: err.message })
  }
})

router.delete("/:pid", handlePolicies(['ADMIN']), async (req, res) => {
  try {
    const pid = req.params.pid
    const productDeleted = await productManager.deleteProductById(pid)
  
    return res.status(200).send({ status: 'OK', data: productDeleted })
  
  } catch (err) {
    res.status(500).send({ status: 'ERR', data: err.message })
  }
})

router.param('pid', async (req, res, next, pid) => {
  const regex = new RegExp(/^[a-fA-F0-9]{24}$/)
  if (regex.test(req.params.pid)) {
      next()
  } else {
      res.status(404).send({ status: 'ERR', data: 'Parámetro no válido' })
  }
})

export default router