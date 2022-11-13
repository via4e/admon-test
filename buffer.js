const PORT = 3030
const express = require('express')
const bodyParser = require("body-parser");
const app = express()

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
    const { id, name, message, timestamp, table } = req.body
    
    if (id && name && message && timestamp && table) {
        chunk.push({
            table,
            data: {
                id, name, message, timestamp
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
const chHandler = (who) => {
    console.log(who, Date.now())
}