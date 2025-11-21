import router from "@adonisjs/core/services/router";
import RoomsController from "../../app/controller/rooms_controller.js";
import { middleware } from "#start/kernel";

router.group(() => {
  router.get('/rooms', [RoomsController, 'index'] )
  router.get('/my-rooms', [RoomsController, 'myRooms'] )
  router.post('/rooms', [RoomsController, 'store'] )
  router.delete('/rooms/:id', [RoomsController, 'destroy'])
  router.post('/rooms/:id/join', [RoomsController, 'join'])
  router.post('/rooms/:id/leave', [RoomsController, 'leave'])
  router.post('/rooms/:id/transfer', [RoomsController, 'transfer'])
} ).use(middleware.auth())