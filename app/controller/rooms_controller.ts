import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { RoomValidator } from '../validator/rooms_validator.js'
import { RoomOwner } from '../validator/rooms_validator.js'
import RoomsServices from '#services/rooms_services'

@inject()
export default class RoomsController {
  constructor(private roomsService: RoomsServices) { }

  async index({ response }: HttpContext) {
    const rooms = await this.roomsService.findAll()
    return response.ok(rooms)
  }

  async myRooms({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const rooms = await this.roomsService.findMyRooms(user)
    response.ok(rooms)
  }

  async store({ request, auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const payload = await request.validateUsing(RoomValidator)

      const room = await this.roomsService.create(payload, user)

      return response.created(room)
    } catch (error) {
      return response.badRequest({ message: error.message || 400 })
    }
  }

  async join({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const roomId = params.id

    const room = await this.roomsService.join(roomId, user)

    return response.ok(room)
  }

  async leave({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const roomId = params.id

    const room = await this.roomsService.leave(roomId, user)

    return response.ok(room)
  }

  async destroy({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const roomId = params.id

    const room = await this.roomsService.destroy(roomId, user)

    return response.ok(room)
  }

  async transfer({ params, request, auth, response }: HttpContext) {
    const { newOwnerId } = await request.validateUsing(RoomOwner)
    const user = auth.getUserOrFail()
    const roomId = params.id

    const room = await this.roomsService.transfer(roomId, newOwnerId, user)

    return response.ok(room)
  }
}