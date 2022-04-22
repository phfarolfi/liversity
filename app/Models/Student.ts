import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Student extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public completedProfile: boolean

  @column()
  public birthDate: Date

  @column()
  public genderId: number

  @column()
  public cpf: string

  @column()
  public numberEnrollment: string

  @column()
  public course: string

  @column()
  public extracurricularActivities: string

  @column()
  public photo: string

  @column()
  public campusId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
