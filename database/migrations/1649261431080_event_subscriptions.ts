import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EventSubscriptions extends BaseSchema {
  protected tableName = 'event_subscriptions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('student_id').unsigned().references('students.id').notNullable().onDelete('CASCADE')
      table.integer('event_id').unsigned().references('events.id').notNullable().onDelete('CASCADE')
      table.unique(['student_id', 'event_id'])
      table.boolean('attendance')

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
