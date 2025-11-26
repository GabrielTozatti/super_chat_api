import User from "#models/user";

export default class AuthServices {

  async register(data: {name: string, email: string, password: string}) {
    const user = await User.create(data);
    return { user: user.serialize(), message: 'Usuário registrado com sucesso' };
  }

  async login(data: {email: string, password: string}, userAgent: string | '') {
    const user = await User.verifyCredentials(data.email, data.password);
    
    let tokenName = 'web'

    if (/mobile|android|iphone|ipad/i.test(userAgent)) {tokenName = 'mobile'
    } else if (/postman|curl/i.test(userAgent)) {
      tokenName = 'api'
    }

    const token = await User.accessTokens.create(user, ['*'], { name: tokenName, expiresIn: '30 days' })
    const tokenValue = token.value!.release();

    return { user: user.serialize(), token: tokenValue, message: 'Login realizado com sucesso' };
  }

  async logout(auth: any) {
    await auth.use('api').invalidateToken()
    return { message: 'Logout realizado com sucesso' };
  }

  async refreshToken(auth: any, userAgent: string | '') {
    const user = auth.use('api').user
     
    let tokenName = 'web'

    if (/mobile|android|iphone|ipad/i.test(userAgent)) {tokenName = 'mobile'
    } else if (/postman|curl/i.test(userAgent)) {
      tokenName = 'api'
    }

    const token = await User.accessTokens.create(user, ['*'], { name: tokenName, expiresIn: '30 days' })
    const tokenValue = token.value!.release();

    return { user: user.serialize(), token: tokenValue, message: 'Token atualizado com sucesso' }
  }
}