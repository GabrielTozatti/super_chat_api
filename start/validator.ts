import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  'required': 'O campo {{field}} é obrigatório',
  'string': 'O valor do campo {{field}} deve ser uma string',
  'email': 'O valor não é um endereço de e-mail válido',
  'unique': 'O valor do campo {{field}} já está em uso',

  'name.minLength': 'O nome de usuário é muito pequeno, deve ter pelo menos 3 caracteres',
  'name.maxLength': 'O nome de usuário é muito longo, máximo de 60 caracteres',
  'password.minLength': 'A senha deve ter pelo menos 8 caracteres',

  'database.unique': 'O valor do campo {{field}} já está em uso',
})