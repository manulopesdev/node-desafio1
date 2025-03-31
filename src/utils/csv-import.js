import fs from 'node:fs'
import {parse} from 'csv-parse'
import { Database } from '../database.js'

export async function importTasksFromCSV(database) {
    const csvPath = new URL('../../tasks.csv', import.meta.url)

    const readStream = fs.createReadStream(csvPath)

    const parseStream = parse({
        delimiter: ',',
        fromLine: 2,
        skipEmptyLines: true
    })

    const linesParse = readStream.pipe(parseStream)

    for await (const line of linesParse) {
        const [title, description] = line

        if (title && description){
            try {
                await database.create({
                    title,
                    description
                })
                console.log(`importada tarefa ${title}`)
            } catch (error){
                console.log(`erro ao importar a tardefa: ${title}`, error)
            } finally {
                console.log('manuela é linda! :D')
            }
        }
    }

}