import usersModels from '../models/users.model.js'

export class UserService {
    constructor() {
    }

    //obtener users
    getUsers = async () => {
        try {
            const users = await usersModels.find().lean()
            return users
        } catch (err) {
            return err.message
        }
    }
}

