import { HttpContext } from "@adonisjs/core/http";
import { inject } from "@adonisjs/core";
import MessageService from "#services/messages_services";
import { fetchMessagesValidator } from "../validator/messages_validator.js";
import { MessageValidator } from "../validator/messages_validator.js";
import { MessageUpdateValidator } from "../validator/messages_validator.js";
import { fileTypes } from "../utils/enum.js";
import Message from "#models/message";

@inject()
export default class MessageController {
  constructor(private messageService: MessageService) { }

  async index({ params, auth, response, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const roomId = params.roomId

    const { beforeId, limit } = await request.validateUsing(fetchMessagesValidator)

    if (!await user.checkMember(roomId)) { return response.forbidden({ message: 'Você precisa entrar na sala para ver as mensagens.' }) }

    const messages = await this.messageService.findAll(roomId, beforeId, limit)

    return response.ok(messages)
  }

  async store({ params, auth, response, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const roomId = params.roomId

    if (!await user.checkMember(roomId)) { return response.forbidden({ message: 'Você precisa entrar na sala para enviar mensagens.' }) }

    const { content } = await request.validateUsing(MessageValidator)
    const file = request.file('file', {
      size: '10mb',
      extnames: fileTypes
    })

    if (!content && !file) { return response.badRequest({ message: 'A mensagem não pode estar vazia.' }) }

    const messages = await this.messageService.create(user, roomId, content, file)

    return response.created(messages)
  }

  async update({ params, auth, response, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const messageId = params.id
    const messageCheck = await Message.findOrFail(messageId)

    if (messageCheck.userId !== user.id) { return response.badRequest({ message: 'Você não pode editar esta mensagem.' }) }
    if (messageCheck.fileUrl && !messageCheck.content) { return response.badRequest({ message: 'Mensagens que contêm apenas arquivos não podem ser editadas, apenas excluídas.' }) }

    const { content } = await request.validateUsing(MessageUpdateValidator)
    const message = await this.messageService.update(content, messageId)

    return response.ok(message)
  }

  async destroy({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const messageId = params.id
    const messageCheck = await Message.findOrFail(messageId)

    if (messageCheck.userId !== user.id) { return response.badRequest({ message: 'Você não pode editar esta mensagem.' }) }

    const message = await this.messageService.delete(messageId)

    return response.ok(message)
  }
}