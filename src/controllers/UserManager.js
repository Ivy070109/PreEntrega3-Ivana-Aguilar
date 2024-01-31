import { UserService } from '../services/users.mongo.dao.js'

const userService = new UserService()

// los datos que normalizaré de users
class UserDTO {
    constructor(user) {
        this.first_name = user.name.trim()
        this.last_name = user.last_name.trim(), 
        this.age = user.age, 
        this.email = user.email.toLowerCase().trim(),
        this.role = user.role === "admin" || user.role === "user" ? user.role : "user"
    }
}

class UsersManager {
    constructor() {
    }

    //obtener users
    getUsers = async () => {
        try {
            const user = await userService.getUsers()
            return new UserDTO(user)
        } catch (err) {
            return err.message
        }
    }
}

export default UsersManager