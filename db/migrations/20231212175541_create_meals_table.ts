import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (tb) => {
    tb.uuid('id').primary()
    tb.text('meal').notNullable()
    tb.text('description').notNullable()
    tb.timestamp('date').notNullable()
    tb.integer('hoursInMinutes').notNullable()
    tb.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()

    tb.uuid('user_id').references('id').inTable('users')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
