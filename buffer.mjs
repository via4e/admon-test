const PORT = 3030
// const express = require('express')
import bodyParser from  'body-parser'
import express from 'express'
import { createClient } from '@clickhouse/client'
const app = express()
const client = createClient({
    host: process.env.CLICKHOUSE_HOST ?? 'http://localhost:8123',
    user: process.env.CLICKHOUSE_USER ?? 'default',
    password: process.env.CLICKHOUSE_PASSWORD ?? '',
    database: process.env.CH_DB ?? 'testtask'
  })

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const CH_MAX_SIZE = process.env.CH_MAX_SIZE ? process.env.CH_MAX_SIZE : 16
const CH_MAX_TIMEOUT = process.env.CH_MAX_TIMEOUT ? process.env.CH_MAX_TIMEOUT : 10
const chunk = []

let checkTimeout = setInterval(() => chHandler('timer: '), CH_MAX_TIMEOUT*1000);

app.get('/', (req, res) => {
    let mes = 'Chunk length:' + chunk.length + ' CH_MAX_SIZE:' + CH_MAX_SIZE + ' CH_MAX_TIMEOUT:' + CH_MAX_TIMEOUT + '\n'
    res.send(mes)
})

app.post('/ch', (req, res) => {
    const { id, name, message, table } = req.body
    
    if (id && name && message && table) {
        chunk.push({
            table,
            data: {
                id, name, message
            }
        })
    }

    if (chunk.length + 1 > CH_MAX_SIZE) {
        chHandler('lengthChecker:')
        chunk.length = 0
    }

    res.send(`POST request \n`)
})

app.listen(PORT, ()=>console.log(`Server run on port ${PORT}...`));

// Clickhouse Handler
const chHandler = async (who) => {
    console.log(who, Date.now())

    if (!chunk.length) return 0

    const chunckTable = chunk[0].table
    const data = chunk.filter((e)=>e.table === chunckTable).map((e)=>e.data)

    await client.insert({
        table: chunckTable,
        values: data,
        format: 'JSONEachRow',
    })

    chunk.length = 0
}