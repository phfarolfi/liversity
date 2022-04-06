import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Events extends BaseSchema {
  protected tableName = 'events'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.date('event_date').notNullable()
      table.date('initial_subscription_date').notNullable()
      table.date('limit_subscription_date').notNullable()
      table.string('description').notNullable()
      table.integer('category_id').unsigned().references('categories.id').notNullable()
      table.string('local').notNullable()
      table.integer('campus_id').unsigned().references('campuses.id').notNullable()
      table.string('link_communication_group').notNullable()
      table.string('photo').notNullable()
      table.string('document').notNullable()
      table.integer('status_id').unsigned().references('statuses.id').notNullable()
      
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
