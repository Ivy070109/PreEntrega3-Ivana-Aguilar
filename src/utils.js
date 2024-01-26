import * as url from 'url'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from './config.js'

export const __filename = url.fileURLToPath(import.meta.url)
export const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

//empezamos a trabajar para hashear el password
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

//usará el compare para comparar
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password) 

// la función token.
// los payload son los datos que queremos guardar
export const generateToken = (payload, duration) => jwt.sign({ payload }, config.PRIVATE_KEY, { expiresIn: duration })

//función de autorización de token 
export const authToken = (req, res, next) => {
    const receivedToken = req.headers.authorization !== undefined ? req.headers.authorization.split(' ')[1] : req.query.access_token
    // si hay error en el login será redireccionado al login
    if (!receivedToken) return res.redirect('/login')

    jwt.verify(receivedToken, config.PRIVATE_KEY, (err, credentials) => {
        if (err) return res.status(403).send({ status: 'ERR', data: 'No autorizado' })
        req.user = credentials.user
        next()
    })
}

export const passportCall = (strategy, options) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, options, (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).send({ status: 'ERR', data: info.messages ? info.messages: info.toString() });
            req.user = user;
            next();
        })(req, res, next);
    }
}

//función de prueba de parámetros no válidos
export const listNumbers = (...numbers) => {
    numbers.forEach(number => {
        if (isNaN(number)) {
            console.log('Invalid parameters')
            process.exit(-4)
        } else {
            console.log(number)
        }
    })
}
