import Room from "#models/room";
import User from "#models/user";
import Ws from '#services/ws_services'
import { Exception } from '@adonisjs/core/exceptions'


export default class RoomsServices {

  async findAll() {
    const rooms = await Room.query()
      .preload('owner', (query) => query.select('id', 'name'))
      .withCount('users')
      .orderBy('created_at', 'desc')

    return rooms;
  }

  async findAvailable(userId: number) {
    const rooms = await Room.query()
      .whereDoesntHave('users', (query) => {
        query.where('users.id', userId)
      })
      .preload('owner', (query) => query.select('id', 'name'))
      .withCount('users')
      .orderBy('created_at', 'desc')

    return rooms
  }

  async findMyRooms(user: User) {
    const rooms = await user.related('rooms')
      .query()
      .orderBy('created_at', 'desc')

    return rooms;
  }

  async create(data: { name: string; description?: string }, user: User) {
    const roomExists = await Room.findBy('name', data.name)

    if (roomExists) throw new Exception('Já existe uma sala com este nome', { status: 400 })

    const room = await Room.create({ ...data, ownerId: user.id });
    await user.related('rooms').attach([room.id])

    Ws.io?.emit('rooms:created', room)
    return { room, message: 'Sala criada com sucesso' };
  }

  async join(roomId: number, user: User) {
    const room = await Room.findOrFail(roomId)

    try {
      await user.related('rooms').attach([room.id])

      Ws.io?.to(`room_${roomId}`).emit('user_joined', {
        user: {
          id: user.id,
          fullName: user.name,
          email: user.email
        },
        message: `${user.name} entrou na sala.`
      })

    } catch (error) {
      return { message: 'Você já está nesta sala' }
    }

    return { message: 'Bem-vindo à sala!', room }
  }

  async leave(roomId: number, user: User) {
    const isInRoom = await user.related('rooms').query().where('room_id', roomId).first()

    if (!isInRoom) { return { message: 'Você não faz parte desta sala.' } }

    const room = await Room.findOrFail(roomId)
    if (room.ownerId === user.id) { return { message: 'O dono não pode sair da sala. Transfira a posse para outro membro ou exclua a sala.' } }

    Ws.io?.to(`room_${roomId}`).emit('user_left', {
      userId: user.id,
      message: `${user.name} saiu da sala.`
    }
    )

    await user.related('rooms').detach([roomId])

    return { message: 'Você saiu da sala.' }
  }

  async destroy(roomId: number, user: User) {
    const room = await Room.findOrFail(roomId)

    if (room.ownerId !== user.id) { return { message: 'Apenas o dono pode excluir a sala.' } }

    Ws.io?.emit('room_deleted', {
      id: room.id
    })

    await room.delete()
    return { message: 'Sala excluída.' }
  }

  async transfer(roomId: number, newOwnerId: number, user: User) {
    const room = await Room.findOrFail(roomId)

    if (room.ownerId !== user.id) { return { message: 'Apenas o dono pode transferir a sala.' } }
    if (room.ownerId === newOwnerId) { return { message: 'Você já é o dono da sala.' } }

    const isMember = await room.related('users').query().where('users.id', newOwnerId).first()
    if (!isMember) { return { message: 'O novo dono precisa ser membro da sala.' } }

    room.ownerId = newOwnerId
    await room.save()

    const newOwner = await User.find(newOwnerId)

    Ws.io?.to(`room_${roomId}`).emit('ownership_transferred', {
      roomId: room.id,
      newOwnerId: newOwnerId,
      message: `A posse da sala foi transferida para ${newOwner?.name}.`
    })

    return { message: 'Posse transferida com sucesso.', room }
  }
}