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

  it('should be able to get total count of meals', async () => {
    const { cookies } = await createAndIdentifyUser(app)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        meal: 'Salada',
        description: 'MR Burguer',
        date: new Date(),
        hour: '16:40',
        diet: 'S',
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

    const totalMeals = await request(app.server)
      .get('/metrics/meals')
      .set('Cookie', cookies)
      .send()

    console.log(totalMeals.body)

    expect(totalMeals.body).toEqual([
      expect.objectContaining({
        total: 2,
      }),
    ])
  })

  it('should be able to get total count of meals on diet', async () => {
    const { cookies } = await createAndIdentifyUser(app)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        meal: 'Salada',
        description: 'MR Burguer',
        date: new Date(),
        hour: '16:40',
        diet: 'S',
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

    const totalMeals = await request(app.server)
      .get('/metrics/on-diet')
      .set('Cookie', cookies)
      .send()

    console.log(totalMeals.body)

    expect(totalMeals.body).toEqual([
      expect.objectContaining({
        totalOnDiet: 1,
      }),
    ])
  })

  it('should be able to get total count of meals off diet', async () => {
    const { cookies } = await createAndIdentifyUser(app)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        meal: 'Salada',
        description: 'MR Burguer',
        date: new Date(),
        hour: '16:40',
        diet: 'S',
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

    const totalMeals = await request(app.server)
      .get('/metrics/non-diet')
      .set('Cookie', cookies)
      .send()

    console.log(totalMeals.body)

    expect(totalMeals.body).toEqual([
      expect.objectContaining({
        totalNonDiet: 1,
      }),
    ])
  })

  it.only('should be able to get best sequence off meals on diet', async () => {
    const { cookies } = await createAndIdentifyUser(app)

    const dietSequence = ['S', 'S', 'N']

    for (let i = 0; i < 3; i++) {
      await request(app.server).post('/meals').set('Cookie', cookies).send({
        meal: 'Salada',
        description: 'MR Burguer',
        date: new Date(),
        hour: '16:40',
        diet: dietSequence[i],
      })
    }

    const totalMeals = await request(app.server)
      .get('/metrics/best-sequence')
      .set('Cookie', cookies)
      .send()

    expect(totalMeals.body).toEqual([
      expect.objectContaining({
        best_sequence: 2,
      }),
    ])
  })
})
