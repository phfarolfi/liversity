import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class EventSubscription extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public studentId: number

  @column()
  public eventId: number

  @column()
  public attendance: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
