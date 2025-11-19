import vine from "@vinejs/vine";

export const RegisterUserValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(255),
    email: vine.string().email().unique({ table: "users", column: "email" }),
    password: vine.string().minLength(8).maxLength(255),
  })
)

export const LoginUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)