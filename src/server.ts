import fastify from 'fastify'
import { env } from './env'
import { mealsRoutes } from './routes/meals'
import { usersRoutes } from './routes/user'

const app = fastify()

app.register(usersRoutes, {
  prefix: 'users',
})
app.register(mealsRoutes, {
  prefix: 'meals',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`HTTP server running on port ${env.PORT}!`)
  })
