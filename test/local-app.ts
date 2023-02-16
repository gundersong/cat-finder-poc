import { app } from '../src/app'

const port = process.env.HTTP_PORT ?? 3000

console.log(`app running on port ${port}`)
app.listen(port)
