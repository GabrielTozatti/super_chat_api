import router from "@adonisjs/core/services/router";
import MessageController from "../../app/controller/messages_controller.js";
import { middleware } from "#start/kernel";

router.group(() => {
  router.get('/rooms/:roomId/messages', [MessageController, 'index'])
  router.post('/rooms/:roomId/messages', [MessageController, 'store'])
  router.put('/messages/:id', [MessageController, 'update'])
  router.delete('/messages/:id', [MessageController, 'destroy'])
}).use(middleware.auth())