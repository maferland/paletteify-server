const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Queue = require('bull')
const fetch = require('./functions/fetch')

const PORT = process.env.PORT || 4000
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'

const app = express()

let workQueue = new Queue('generate_palette', REDIS_URL)

app.set('port', PORT)
app.use(bodyParser.json())
app.use(cors())

app.post('/generate', async (req, res, next) => {
  try {
    const {url} = req.body

    const response = await fetch(url)
    if (!response) {
      let job = await workQueue.add({url})
      res.json({id: job.id})
    } else {
      res.json(response.data)
    }
  } catch (error) {
    next(error)
  }
})

app.listen(PORT, () => {
  console.log(`paletteify-server listening at http://localhost:${PORT}`)
})
