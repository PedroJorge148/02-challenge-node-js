import { FastifyInstance } from 'fastify'
import { checkUserIdExists } from '../middlewares/check-user-id-exists'
import { knex } from '../database'

export async function metricsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkUserIdExists)

  app.get('/meals', async (request) => {
    const userId = request.cookies.userId

    const totalMeals = await knex('meals')
      .where('user_id', userId)
      .count({ total: '*' })

    return totalMeals
  })

  app.get('/on-diet', async (request) => {
    const userId = request.cookies.userId

    const mealsOnDiet = await knex('meals')
      .where({
        user_id: userId,
        diet: 'S',
      })
      .count({ totalOnDiet: '*' })

    return mealsOnDiet
  })

  app.get('/non-diet', async (request) => {
    const userId = request.cookies.userId

    const mealsNonDiet = await knex('meals')
      .where({
        user_id: userId,
        diet: 'N',
      })
      .count({ totalNonDiet: '*' })

    return mealsNonDiet
  })

  app.get('/best-sequence', async (request) => {
    const userId = request.cookies.userId

    const bestSequence = await knex.raw(
      `
      WITH CTE AS (
        SELECT
          diet,
          ROW_NUMBER() OVER (ORDER BY created_at) -
          ROW_NUMBER() OVER (PARTITION BY diet ORDER BY created_at) AS grp
        FROM 
          meals
        WHERE 
          user_id = ?
      )
      
      SELECT
        MAX(grp_length) AS best_sequence
      FROM (
        SELECT
          COUNT(*) AS grp_length
        FROM CTE
        WHERE diet = 'S'
        GROUP BY diet, grp
        
      ) AS t;    
    `,
      [userId],
    )

    return bestSequence
  })
}
