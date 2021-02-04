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

app.get('/poll/:id', async (req, res) => {
  let id = req.params.id
  let job = await workQueue.getJob(id)

  if (job === null) {
    res.status(404).end()
  } else {
    let state = await job.getState()
    if (state === 'completed') {
      const response = await fetch(url)
      res.json(response.data)
    } else if (job.failedReason) {
      let reason = job.failedReason
      res.status(500).json({id, state, reason})
    } else {
      const progress = job.progress
      res.json({id, state, progress})
    }
  }
})

app.listen(PORT, () => {
  console.log(`paletteify-server listening at http://localhost:${PORT}`)
})
