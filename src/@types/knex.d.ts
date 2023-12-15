// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      created_at: Date
    }
    meals: {
      id: string
      meal: string
      description: string
      date: string
      hoursInMinutes: number
      diet: 'S' | 'N'
      user_id: string
      created_at: Date
    }
  }
}
