const throng = require('throng')
const Queue = require('bull')

const generate = require('./functions/generate')
const screenshot = require('./functions/screenshot')
const store = require('./functions/store')
const fetch = require('./functions/fetch')

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
const workers = process.env.WEB_CONCURRENCY || 1
const maxJobsPerWorker = 1

async function start() {
  let workQueue = new Queue('generate_palette', REDIS_URL)

  workQueue.process(maxJobsPerWorker, async (job, done) => {
    try {
      const {
        data: {url},
      } = job

      if (await fetch(url)) {
        console.log(`SKIP -> JOB (#${job.id} for ${job.data.url})`)
        return done()
      }

      console.log(`START -> JOB (#${job.id} for ${job.data.url})`)

      const fileName = await screenshot(url)
      const palette = await generate(url, fileName)
      await store(url, palette)

      console.log(`SUCCESS -> JOB (#${job.id} for ${job.data.url})`)
      done()
    } catch (error) {
      console.log(`FAIL -> JOB (#${job.id} for ${job.data.url})`)
      done(error)
    }
  })
}

throng({workers, start})
