const throng = require('throng')
const Queue = require('bull')

const generate = require('./functions/generate')
const screenshot = require('./functions/screenshot')

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
const workers = process.env.WEB_CONCURRENCY || 1
const maxJobsPerWorker = 1

function start() {
  let workQueue = new Queue('generate_palette', REDIS_URL)

  workQueue.process(maxJobsPerWorker, async (job) => {
    const {
      data: {url},
    } = job
    console.log(`Screenshoting ${url}`)
    const fileName = await screenshot(url)
    console.log(`Generating palette for ${url} (${fileName})`)
    const palette = await generate(fileName)
    console.log(`===== We have a winner =====`)
    palette.forEach((color) => console.log(`${color.name} - ${color.code}`))
    console.log(`============================`)
    return {palette}
  })
}

throng({workers, start})
