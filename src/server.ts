import cookie from '@fastify/cookie'
import fastify from 'fastify'
import { env } from './env'
import { mealsRoutes } from './routes/meals'
import { metricsRoutes } from './routes/metrics'
import { usersRoutes } from './routes/user'

const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
  prefix: 'users',
})
app.register(mealsRoutes, {
  prefix: 'meals',
})
app.register(metricsRoutes, {
  prefix: 'metrics',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`HTTP server running on port ${env.PORT}!`)
  })
