import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public eventDate: Date

  @column()
  public initialSubscriptionDate: Date

  @column()
  public limitSubscriptionDate: Date

  @column()
  public description: string

  @column()
  public categoryId: number

  @column()
  public local: string

  @column()
  public campusId: number

  @column()
  public linkCommunicationGroup: string

  @column()
  public photo: string

  @column()
  public document: string

  @column()
  public statusId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
