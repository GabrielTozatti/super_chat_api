import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, hasMany, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Message from '#models/message'
import slugify from 'slugify'
import User from '#models/user'

export default class Room extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare ownerId: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'ownerId' })
  declare owner: BelongsTo<typeof User>

  @manyToMany(() => User, { pivotTable: 'rooms_users', pivotTimestamps: true })
  declare users: ManyToMany<typeof User>

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>

  @beforeSave()
  static generateSlug(room: Room) {
    if (room.$dirty.name) {
      room.slug = slugify.default(room.name, {
        lower: true,
        strict: true,
      })
    }
  }
}