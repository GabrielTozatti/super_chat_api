import app from "@adonisjs/core/services/app";
import { cuid } from '@adonisjs/core/helpers'
import Ws from '#services/ws_services'
import Message from "#models/message";
import User from "#models/user";
import * as fs from 'fs/promises'
import { DateTime } from "luxon";

export default class MessageService {
  
  async findAll(roomId: number, limit: number = 50, beforeId?: number) {
    let query = Message.query()
      .where('room_id', roomId)
      .whereNull('deleted_at')
      .preload('user', (query) => query.select('id', 'name'))
      .limit(limit)

    if (beforeId) { query = query.where('id', '<', beforeId) }

    const messages = (await query.orderBy('id', 'desc'))
    const reversedMessages = messages.reverse()

    const nextCursor = reversedMessages.length > 0 ? reversedMessages[0].id : null 

    return {
      messages: reversedMessages,
        meta: {
          hasMore: messages.length === limit, 
          nextCursor: nextCursor
        }
    }
  }

  async create(user: User, roomId: number, content?: string, file?: any) {
    let fileUrl: string | null = null
    let fileType: string | null = null

    if (file) {
      const originalName = file.clientName.split('.').slice(0, -1).join('.')
      await file.move(app.makePath('public/uploads'), {
        name: `${cuid()}_${originalName}.${file.extname}`
      })

      fileUrl = `/uploads/${file.fileName}`
      fileType = file.type === 'application' ? 'document' : file.type
    }

    const message = await Message.create({
      userId: user.id,
      roomId: roomId,
      content: content,
      fileUrl,
      fileType
    })

    await message.load('user', (query) => query.select('id', 'name'))
    Ws.io?.to(`room_${roomId}`).emit('new_message', message)

    return message
  }

  async update(content: string, messageId: number) {
    const message = await Message.findOrFail(messageId)

    message.content = content
    message.isEdited = true
    await message.save()

    await message.load('user')
    Ws.io?.to(`room_${message.roomId}`).emit('message_updated', message)

    return message
  }

  async delete(messageId: number) {
    const message = await Message.findOrFail(messageId)

    if (message.fileUrl) {
      try {
        const filePath = app.makePath('public', message.fileUrl)
        await fs.unlink(filePath)
      } catch (error) {
        console.error('Falha ao deletar fisico', error)
      }
    }

    message.deletedAt = DateTime.now()
    await message.save() 

    Ws.io?.to(`room_${message.roomId}`).emit('message_deleted', { id: message.id })

    return { message: 'A mensagem foi deletada com sucesso' }
  }
}