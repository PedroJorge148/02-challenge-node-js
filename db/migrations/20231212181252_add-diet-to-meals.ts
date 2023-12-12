import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (tb) => {
    tb.enum('diet', ['S', 'N'], { useNative: true, enumName: 'foo_type' })
      .defaultTo('N')
      .notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (tb) => {
    tb.dropColumn('diet')
  })
}
