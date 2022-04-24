import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('gender_id').unsigned().references('genders.id')
      table.integer('campus_id').unsigned().references('campuses.id')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('gender_id')
      table.dropColumn('campus_id')
    })
  }
}
