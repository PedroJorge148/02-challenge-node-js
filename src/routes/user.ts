import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex('users').select('*')

    return {
      users,
    }
  })

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    const { name, email } = createUserBodySchema.parse(request.body)

    const userExists = await knex('users').where('email', email).first()

    if (userExists) {
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
}
