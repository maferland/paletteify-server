const express = require('express')
const bodyParser = require('body-parser')

const generate = require('./functions/generate')
const screenshot = require('./functions/screenshot')

const app = express()
const port = process.env.PORT || 4000

app.set('port', port)
app.use(bodyParser.json())

app.get('/palette', generate)
app.post('/screenshot', screenshot)

app.listen(port, () => {
  console.log(`palettify-server listening at http://localhost:${port}`)
})
