import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'child_process'
import { createAndIdentifyUser } from '../src/utils/test/create-and-identify-user'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to register a meal', async () => {
    const { cookies } = await createAndIdentifyUser(app)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        meal: 'Hambúrguer',
        description: 'MR Burguer',
        date: new Date(),
        hour: '16:40',
        diet: 'N',
      })
      .expect(201)
  })

  it('should be able to list all meals of a user', async () => {
    const { cookies } = await createAndIdentifyUser(app)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        meal: 'Hambúrguer',
        description: 'MR Burguer',
        date: new Date(),
        hour: '16:40',
        diet: 'N',
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .send()

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        meal: 'Hambúrguer',
        description: 'MR Burguer',
        diet: 'N',
      }),
    ])
  })

  it('should be able to get a meal by id', async () => {
    const { cookies } = await createAndIdentifyUser(app)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        meal: 'Hambúrguer',
        description: 'MR Burguer',
        date: new Date(),
        hour: '16:40',
        diet: 'N',
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        meal: 'Lasanha',
        description: 'MR Burguer',
        date: new Date(),
        hour: '16:40',
        diet: 'N',
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .send()

    const mealId = listMealsResponse.body.meals[0].id

    const getMealById = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send()

    expect(getMealById.body.meal).toEqual(
      expect.objectContaining({
        id: mealId,
        meal: 'Hambúrguer',
        description: 'MR Burguer',
      }),
    )
  })
})
