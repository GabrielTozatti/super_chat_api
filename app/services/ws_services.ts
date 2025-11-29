import { Server } from "socket.io";
import server from "@adonisjs/core/services/server";
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import User from '#models/user';
import env from '#start/env';
import { Secret } from "@adonisjs/core/helpers";

class WsService {
  io: Server | undefined
  private booted = false

  public async boot() {
    if (this.booted) return

    const redisUrl = `redis://:${env.get('REDIS_PASSWORD')}@${env.get('REDIS_HOST')}:${env.get('REDIS_PORT')}`;
    const pubClient = createClient({ url: redisUrl });
    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) => console.error('Redis Pub Error', err))
    subClient.on('error', (err) => console.error('Redis Sub Error', err))

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.io = new Server(server.getNodeServer(), {
      cors: {
        origin: [env.get('FRONTEND_URL')],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
      adapter: createAdapter(pubClient, subClient)
    })

    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth?.token || socket.handshake.headers['authorization']?.replace('Bearer ', '')

        if (!token) return next(new Error('No token provided'))

        const secret = new Secret(token)

        const accessToken = await User.accessTokens.verify(secret)
        const user = await User.find(accessToken?.tokenableId);

        socket.data.user = user
        next()
      } catch (error) {
        console.error("Erro ao verificar token:", error)
        next(new Error('Invalid token'))
      }
    })

    this.io.on('connection', (socket) => {
      socket.on('join_room', (roomId) => {
        socket.join(`room_${roomId}`)
      })

      socket.on('leave_room', (roomId) => {
        socket.leave(`room_${roomId}`)
      })
    })

    this.booted = true
    console.log('🚀 WebSocket Server initialized with Redis Adapter')
  }
}

export default new WsService()