import express from 'express'

import { getTopCatBreeds } from './cat-api/get-top-cat-breeds'

const app = express()

app.get('/cats/top', async function (req, res) {
  try {
    const limit = req.query.limit ?? 5

    if (limit && Number.isNaN(+limit)) {
      console.error(`invalid "limit" value received ${limit}`)

      return res
        .status(400)
        .set('Content-Type', 'application/json')
        .send({ error: 'Invald `limit` param, must be a number' })
    }

    const topCatBreeds = await getTopCatBreeds({ limit: limit as number })

    return res
      .set('Content-Type', 'application/json')
      .send({ data: topCatBreeds })
  } catch (err) {
    // Log error but do not return error from API response in case of sensitive information
    console.error(err)
    return res.sendStatus(500)
  }
})

export { app }
