import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    const { name, email } = createUserBodySchema.parse(request.body)

    const user = await knex('users').where('email', email).first()

    if (user) {
      return reply.status(400).send({
        message: 'Usuário já cadastrado.',
      })
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
    })

    return reply.status(201).send()
  })

  app.post('/sessions', async (request, reply) => {
    const userSessionSchema = z.object({
      email: z.string().email(),
    })

    const { email } = userSessionSchema.parse(request.body)

    const user = await knex('users').where('email', email).first()

    if (user) {
      const userId = user.id

      reply.cookie('userId', userId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      })

      return reply.send()
    } else {
      return reply.status(400).send({
        message: 'Usuário não cadastrado.',
      })
    }
  })
}
