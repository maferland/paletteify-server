#!/usr/bin/env node
require('dotenv').config()

/* bootstrap database in your FaunaDB account - use with `netlify dev:exec <path-to-this-file>` */
const faunadb = require('faunadb')
const q = faunadb.query

async function createFaunaDB() {
  if (!process.env.FAUNA_DB_ADMIN) {
    console.log('No FAUNA_DB_ADMIN in environment, skipping DB setup')
    return
  }

  const client = new faunadb.Client({
    secret: process.env.FAUNA_DB_ADMIN,
  })

  /* Based on your requirements, change the schema here */

  await client.query(q.Create(q.Ref('classes'), {name: 'palette'})).then(
    () => console.log('Created palette class'),
    () => console.log('Palette class already exists'),
  )

  await client
    .query(
      q.Create(q.Ref('indexes'), {
        name: 'palette_by_url',
        source: q.Ref('classes/palette'),
        terms: [
          {
            field: ['data', 'url'],
          },
        ],
        active: true,
      }),
    )
    .then(
      () => console.log('Created palette_by_url index'),
      () => console.log('palette_by_url index already exists'),
    )
}

createFaunaDB()
