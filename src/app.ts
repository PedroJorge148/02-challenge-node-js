import fastify from 'fastify'
import { metricsRoutes } from './routes/metrics'
import { usersRoutes } from './routes/user'
import cookie from '@fastify/cookie'
import { mealsRoutes } from './routes/meals'

export const app = fastify()

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
