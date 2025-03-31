import { Database } from "./database.js"
import { importTasksFromCSV } from "./utils/csv-import.js"

const database = new Database()

export const routes = [
    {
        method: 'POST',
        path: '/tasks',
        handler: (request, reply) => {
            const { title, description } = request.body

            if( !title || !description) {
                return reply.status(400).send({error: 'Title and description are required'})
            }

            const task = database.create({title, description})

            return reply.status(200).send(task)
        }
    }
    ,
    {
        method: 'GET',
        path:   '/tasks',
        handler: (request, reply) => {
            const { search } = request.query
            const tasks = database.list(search)
            return reply.send(tasks)
        }
    }
    ,
    {
        method: 'PUT',
        path: '/tasks/:id',
        handler: (request, reply) => {
            const { id } = request.params
            const { title, description } = request.body

            if(!title && !description){
                return reply.status(400).send({error: 'provide at least title or description'})
            }

            const updatedTask = database.update(id, {title, description})

            if(!updatedTask){
                return reply.status(404).send({error: 'task not found'})
            }

            return reply.send(updatedTask)
        }
    }
    ,
    {
        method: 'DELETE',
        path: '/tasks/:id',
        handler: (request, reply) => {
            const { id } = request.params
    
            const task = database.delete(id)
    
            if (!task) {
                return reply.status(404).send({
                    error: 'Task not found'
                })
            }
    
            return reply.status(204).send()
        }
    }
    ,
    {
        method: 'PATCH',
        path: '/tasks/:id/complete',
        handler: (request, reply) => {
            const { id } = request.params
            console.log(id)
            const task = database.toggleComplete(id)
            if(!task){
                return reply.status(404).send({error: 'task not found'})
            }

            return reply.status(200).send(task)
        }
    }
    ,
    {
        method: 'POST',
        path: '/tasks/import-csv',
        handler: async (request, reply) => {
            try {
                // Passe a instância de database
                await importTasksFromCSV(database)
                return reply.status(200).send({ message: 'CSV importado com sucesso' })
            } catch (error) {
                // Adicione o parâmetro de erro para log
                console.error('Erro na importação:', error)
                return reply.status(500).send({
                    error: 'Erro ao importar o CSV',
                    details: error.message
                })
            }
        }
    }
]