import fs from 'fs/promises'
import path from 'path'

export class Database {
    
    #filepath = path.resolve('./src/db.json')
    #tasks = []

    constructor(){
        this.#loadData()
    }

    async #loadData() {
        try {
            const data = await fs.readFile(this.#filepath, 'utf-8')
            this.#tasks = JSON.parse(data)
        } catch (error) {
            this.#tasks = []
        }
    }

    async #saveData() {
        await fs.writeFile(
            this.#filepath,
            JSON.stringify(this.#tasks, null, 2)
        )
    }

    list(search) {
        let minusculo = null
        if(Array.isArray(search)){
             minusculo = search.map(palavra => palavra.toLowerCase())
        } else if(search) {
            minusculo = search.toLowerCase()
        }
        console.log(minusculo)
        if (minusculo) {
            return this.#tasks.filter(task =>
                task.title.toLowerCase().includes(minusculo) ||
                task.description.toLowerCase().includes(minusculo)
            )
        }
        console.log(this.#tasks)
        return this.#tasks
    }

    async create(data) {
        const task = {
            id: crypto.randomUUID(),
            title: data.title,
            description: data.description,
            completed_at: null,
            created_at: new Date(),
            updated_at: new Date()
        }

        this.#tasks.push(task)
        await this.#saveData()
        return task
    }

    async update(id, data) {
        const taskIndex = this.#tasks.findIndex(task => task.id === id)

        if (taskIndex > -1){
            const task = this.#tasks[taskIndex]
        

            this.#tasks[taskIndex] = {
            ...task,
            title: (data.title ? data.title : task.title),
            description: (data.description ? data.description : task.description),
            updated_at: new Date()
            }

            await this.#saveData()
            return this.#tasks[taskIndex]
        }

        return null
    }

    async delete(id) {
        const taskIndex = this.#tasks.findIndex(task => task.id === id)
    
        if (taskIndex > -1) {
            const deletedTask = this.#tasks[taskIndex]
            this.#tasks.splice(taskIndex, 1)
            
            await this.#saveData()
            return deletedTask
        }

        return null
    }

    async toggleComplete(id) {
        const taskIndex = this.#tasks.findIndex( task => task.id === id)

        if (taskIndex > -1){
            const task = this.#tasks[taskIndex]
            task.completed_at = task.completed_at ? null : new Date()
            task.updated_at = new Date()

            await this.#saveData()
            return task
        }

        return null
    }
}