import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    const { response } = ctx

    if (error instanceof errors.E_VALIDATION_ERROR) {
      const formattedErrors = error.messages.map((err: any) => ({
        field: err.field,
        message: err.message,
      }))

      return response.badRequest({ errors: formattedErrors })
    }

    if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'E_INVALID_CREDENTIALS') {
      return response.unauthorized({ message: 'Credenciais inválidas.' })
    }

    if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'E_UNAUTHORIZED_ACCESS') {
      return response.unauthorized({ message: 'Acesso não autorizado.' })
    }

    return response.internalServerError({ message: 'Ocorreu um erro inesperado' })
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
