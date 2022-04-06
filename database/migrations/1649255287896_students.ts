import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Students extends BaseSchema {
  protected tableName = 'students'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('users.id').notNullable()
      table.boolean('completed_profile').notNullable()
      table.date('birth_date')
      table.integer('gender_id').unsigned().references('genders.id')
      table.string('cpf')
      table.string('number_enrollment')
      table.string('course')
      table.string('extracurricular_activities')
      table.string('photo')
      table.integer('campus_id').unsigned().references('campuses.id')

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
