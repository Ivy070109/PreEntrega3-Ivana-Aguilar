export const publicAccess = (req, res, next) => {
    if (req.user) {
        return res.redirect('/products')
    }
    next()
}

export const privateAccess = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/login')
    }
    next()
}

// export const handlePolicies = roles => {
//     return (req, res, next) => {
//         if (roles[0].toUpperCase() === "PUBLIC") return next()
//         if (!req.user) return res.status(401).send({status: 'error', error: 'Usuario no autenticado'})
//         if (!roles.includes(req.user.role.toUpperCase())) return res.status(403).send({status:'error', error: 'Usuario no autorizado'})
//         next()
//     }
// }

export const handlePolicies = policies => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ status: 'ERR', data: 'Usuario no autorizado' })

        // paso todos los valores a mayúsculas para que no haya errores de reconocimiento en los roles  
        const userRole = req.user.role.toUpperCase()
        policies.forEach((policy, index) => policies[index] = policies[index].toUpperCase())

        if (policies.includes('PUBLIC')) return next()
        if (policies.includes(userRole)) return next()
        res.status(403).send({ status: 'ERR', data: 'Sin permisos suficientes' }) 
    }
}
