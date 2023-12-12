import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (tb) => {
    tb.uuid('id').primary()
    tb.text('name').notNullable()
    tb.text('email').notNullable().unique()
    tb.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
