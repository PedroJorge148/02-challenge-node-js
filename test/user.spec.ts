import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'child_process'

describe('Users routes', () => {
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

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
      })
      .expect(201)
  })

  it('should be able to identify a user', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
    })

    const user = await request(app.server)
      .post('/users/sessions')
      .send({
        email: 'johndoe@example.com',
      })
      .expect(200)

    const cookies = user.get('Set-Cookie')

    expect(cookies).toEqual(expect.any(Array))
  })
})
