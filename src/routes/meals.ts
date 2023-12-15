import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { checkUserIdExists } from '../middlewares/check-user-id-exists'
import { convertHourStringToMinutes } from '../utils/convert-hour-string-to-minutes'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkUserIdExists)

  app.get('/', async (request) => {
    const userId = request.cookies.userId

    const meals = await knex('meals').where('user_id', userId)

    return {
      meals,
    }
  })

  app.get('/:id', async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const userId = request.cookies.userId
    const { id } = getMealParamsSchema.parse(request.params)

    const meal = await knex('meals').where({ id, user_id: userId }).first()

    if (!meal) {
      return reply.status(404).send({
        error: 'Refeição não encontrada.',
      })
    }

    return {
      meal,
    }
  })

  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      meal: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      hour: z.string(),
      diet: z.enum(['S', 'N']),
    })

    const {
      meal: mealName,
      description,
      date,
      hour,
      diet,
    } = createMealBodySchema.parse(request.body)

    const minutesAmount = convertHourStringToMinutes(hour)

    const userId = request.cookies.userId

    await knex('meals').insert({
      id: randomUUID(),
      meal: mealName,
      description,
      date: new Date(date).toISOString(),
      hoursInMinutes: minutesAmount,
      diet,
      user_id: userId,
    })

    return reply.status(201).send()
  })

  app.put('/:id', async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const updateMealBodySchema = z.object({
      meal: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      hour: z.string(),
      diet: z.enum(['S', 'N']),
    })
    const {
      meal: mealName,
      description,
      date,
      hour,
      diet,
    } = updateMealBodySchema.parse(request.body)

    const minutesAmount = convertHourStringToMinutes(hour)

    const { id } = getMealParamsSchema.parse(request.params)
    const userId = request.cookies.userId

    await knex('meals')
      .where({ id, user_id: userId })
      .update({
        meal: mealName,
        description,
        date: new Date(date).toISOString(),
        hoursInMinutes: minutesAmount,
        diet,
      })

    return reply.status(200).send()
  })

  app.delete('/:id', async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamsSchema.parse(request.params)
    const userId = request.cookies.userId

    const meal = await knex('meals')
      .where({
        id,
        user_id: userId,
      })
      .del()

    if (meal) {
      return reply.send()
    } else {
      return reply.status(404).send({
        error: 'Refeição não encontrada.',
      })
    }
  })
}
