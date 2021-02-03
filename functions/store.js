const faunadb = require('faunadb')

/* configure faunaDB Client with our secret */

module.exports = async (url, palette) => {
  const q = faunadb.query

  const client = new faunadb.Client({
    secret: process.env.FAUNA_DB,
  })

  const item = {
    data: {url, palette},
  }

  console.log(`START -> Storing result for ${url}`)
  await client
    .query(
      q.If(
        q.Exists(q.Match(q.Index('palette_by_url'), url)),
        q.Replace(
          q.Select('ref', q.Get(q.Match(q.Index('palette_by_url'), url))),
          item,
        ),
        q.Create(q.Ref('classes/palette'), item),
      ),
    )
    .then(
      () => console.log(`SUCCESS -> Storing result for ${url}`),
      (e) => {
        console.error(
          `FAIL -> Storing result for ${url} REASON -> ${e.description}`,
        )
      },
    )
}
