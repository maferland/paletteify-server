const express = require('express')
const bodyParser = require('body-parser')

const generate = require('./functions/generate')

const app = express()
const port = 4000

app.use(bodyParser.json())

app.post('/generate', generate)

app.listen(port, () => {
  console.log(`palettify-server listening at http://localhost:${port}`)
})
