import dotenv from 'dotenv'
import { Command } from 'commander'

const commandLineOptions = new Command()
commandLineOptions
    .option('--port <port>')
    .option('--mode <mode>')
commandLineOptions.parse()

dotenv.config()
// aún no tengo más sistemas .env, pero en las líneas de comando ya incluí un sistema de producción y otro de desarrollador

//console.log(commandLineOptions.opts())
//console.log(process.env.MONGOOSE_URL)

const config = {
    PORT: commandLineOptions.opts().port || 8080,
    MONGOOSE_URL: process.env.MONGOOSE_URL_REMOTE,
    SECRET_KEY: process.env.SECRET_KEY,
    UPLOAD_DIR: 'public/img',
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,   
    PRIVATE_KEY: process.env.PRIVATE_KEY
}

export default config 