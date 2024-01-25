import usersModels from '../models/users.model.js'

class UsersManager {
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

export default UsersManager