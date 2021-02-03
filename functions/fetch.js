const faunadb = require('faunadb')

if (!process.env.FAUNA_DB) {
  throw new Error('Missing Fauna DB api key')
}

module.exports = async (url) => {
  const q = faunadb.query

  const client = new faunadb.Client({
    secret: process.env.FAUNA_DB,
  })

  return client.query(q.Get(q.Match(q.Index('palette_by_url'), url))).then(
    (response) => response,
    () => undefined,
  )
}
