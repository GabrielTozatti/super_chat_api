import vine from "@vinejs/vine";

export const RoomValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(255),
    description: vine.string().optional(),
  })
)

export const RoomOwner = vine.compile(
  vine.object({
    newOwnerId: vine.number(),
  })
)