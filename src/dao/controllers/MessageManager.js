import messageModel from "../models/message.model.js"

class MessagesManager {
    constructor() {
    }

    //obtener los mensajes guardados en database
    getMessages = async () => {
        try {
            const lookMessage = await messageModel.find().lean()

            return lookMessage    
        } catch (err) {
            return err.message
        }
    }

    //crear y guardar los mensajes en database
    createMessage = async (message) => {
        try {
            const newMessage = await messageModel.create(message)

            return newMessage
        } catch (err) {
            return err.message
        }
    }
}

export default MessagesManager