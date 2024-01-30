import { UserService } from '../services/users.mongo.dao.js'

const userService = new UserService()

class UsersManager {
    constructor() {
    }

    //obtener users
    getUsers = async () => {
        try {
            return await userService.getUsers()
        } catch (err) {
            return err.message
        }
    }
}

export default UsersManager