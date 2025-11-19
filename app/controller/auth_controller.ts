import type { HttpContext } from "@adonisjs/core/http";
import { RegisterUserValidator } from "../validator/auth_validator.js";
import { LoginUserValidator } from "../validator/auth_validator.js";
import AuthServices from "#services/auth_services";

export default class AuthController {

  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(RegisterUserValidator);

    const user = await new AuthServices().register(payload);

    return response.created(user);
  }

  async login({request, response}: HttpContext) {
    const userAgent = request.header('user-agent') || ''
    const payload = await request.validateUsing(LoginUserValidator);

    const user = await new AuthServices().login(payload, userAgent);
    
    return response.ok(user);
  }

  async logout({auth, response}: HttpContext) {
    const logout = await new AuthServices().logout(auth); 
    return response.ok(logout);
  }

  async refresh({request, auth, response}: HttpContext) {
    const userAgent = request.header('user-agent') || ''
    const refreshToken = await new AuthServices().refreshToken(auth, userAgent);

    return response.ok(refreshToken);
  }
}
