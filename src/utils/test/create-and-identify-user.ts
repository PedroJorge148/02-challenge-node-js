import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndIdentifyUser(app: FastifyInstance) {
  await request(app.server)
    .post('/users')
    .send({
      name: 'John Doe',
      email: 'johndoe@example.com',
    })
    .expect(201)

  const user = await request(app.server)
    .post('/users/sessions')
    .send({
      email: 'johndoe@example.com',
    })
    .expect(200)

  const cookies = user.get('Set-Cookie')

  return {
    cookies,
  }
}
