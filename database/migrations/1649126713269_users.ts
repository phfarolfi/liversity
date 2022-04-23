import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 100).notNullable()
      table.string('email', 100).notNullable()
      table.string('password', 50).notNullable()
      table.integer('profile_id').notNullable()
      table.boolean('completed_profile').notNullable()
      table.date('birth_date')
      table.string('cpf', 20)
      table.integer('gender_id').unsigned().references('genders.id')
      table.integer('campus_id').unsigned().references('campuses.id')
      table.string('photo')
      table.string('remember_me_token').nullable()

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
