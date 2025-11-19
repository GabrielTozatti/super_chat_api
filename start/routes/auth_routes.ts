import router from "@adonisjs/core/services/router";
import AuthController from "../../app/controller/auth_controller.js";
import { middleware } from "#start/kernel";

router.group(() => {
  router.post('register', [AuthController, 'register'] )
  router.post('login', [AuthController, 'login'] )
  router.post('logout', [AuthController, 'logout'] ).use(middleware.auth())
  router.post('refresh', [AuthController, 'refresh'] ).use(middleware.auth())
} ).prefix('/auth')