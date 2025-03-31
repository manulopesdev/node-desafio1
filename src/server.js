import Fastify from "fastify"
import { routes } from './routes.js'
import cors from '@fastify/cors'
import { Database } from "./database.js"
import { importTasksFromCSV } from "./utils/csv-import.js"

async function initServer() {
    const server = Fastify()
    const database = new Database()

    await server.register(cors, {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    })

    routes.forEach(route => {
        if(route.method && route.path && route.handler){
            server.route({
                method: route.method, 
                path: route.path, 
                handler: route.handler
            })
        }
    })

    try {
        await server.listen({ port: 3333 })
        console.log('server running on port 3333')

        await importTasksFromCSV(database)
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

initServer()