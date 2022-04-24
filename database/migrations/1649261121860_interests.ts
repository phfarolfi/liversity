import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Interests extends BaseSchema {
  protected tableName = 'interests'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('users.id').notNullable().onDelete('CASCADE')
      table.integer('category_id').unsigned().references('categories.id').notNullable()
      table.unique(['user_id', 'category_id'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
