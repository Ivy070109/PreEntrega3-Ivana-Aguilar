import express from "express"
//import mongoose from "mongoose"
import handlebars from "express-handlebars"
import { __dirname } from "./utils.js"
import { Server } from "socket.io"
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from "passport"

import productRouter from "./routes/product.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from './routes/views.router.js'
import socketProducts from './socket/socketProducts.js'
import socketChat from './socket/socketChat.js'
import usersRouter from './routes/users.routes.js'
import sessionsRoutes from './routes/sessions.routes.js'
import MongoSingleton from "./services/mongoSingleton.js"

import config from "./config.js"

// const PORT = 8080
// const MONGOOSE_URL = 'mongodb+srv://ivyaguilar07:bjLpjWzJQGdcrVRL@cluster0.2olteyc.mongodb.net/ecommerce'

try {
    //await mongoose.connect(config.MONGOOSE_URL)
    // ahora podemos conectar a base de datos desde services
    MongoSingleton.getInstance()
    
    const app = express()
    const httpServer = app.listen(config.PORT, () => {
        //console.log(`Servidor Express ejecutándose en el puerto ${config.PORT} conectado a BBDD ${config.MONGOOSE_URL}`)
        console.log(`Servidor Express ejecutándose en el puerto ${config.PORT}`)
    })

    // process.on exit
    process.on('exit', code => {
        switch (code) {
            case -4: 
                console.log(`Proceso finalizado por argumentación inválida en una función`)
                break

            default:    
                console.log(`El proceso de servidor finalizó (err: ${code})`)
        }
    })

    // process.on para procesos inesperados
    process.on('uncaughtException', exception => {
        console.log(exception.name)
        console.log(exception.message)
    })

    const socketServer = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
            credentials: false
        }
    })

    //middleware a nuvel app, para captar los errores
    app.use((err, req, res, next) => {
        console.log(err.stack)
        res.status(500).send('Algo falló')
    })

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser(config.SECRET_KEY))
    app.use(session({
        store: MongoStore.create({ mongoUrl: config.MONGOOSE_URL, mongoOptions: {}, ttl: 1800, clearInterval: 5000 }),
        secret: config.SECRET_KEY,
        resave: false, 
        saveUninitialized: false
    }))
    
    //inicializo passport 
    app.use(passport.initialize())
    app.use(passport.session())

    app.use('/static', express.static(`${__dirname}/public`))

    app.engine('handlebars', handlebars.engine())
    app.set('views', `${__dirname}/views`)
    app.set('view engine', 'handlebars')

    app.use("/api/products", productRouter)
    app.use("/api/carts", cartsRouter)
    app.use("/api/users", usersRouter)
    app.use('/', viewsRouter)
    app.use('/api/sessions', sessionsRoutes)

    socketProducts(socketServer)
    socketChat(socketServer)
} catch (err) {
    console.log(`No se puede conectar con las bases de datos (${err.message})`)
}




