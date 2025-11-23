import vine from "@vinejs/vine";

export const fetchMessagesValidator = vine.compile(
  vine.object({
    beforeId: vine.number().positive().optional(),
    limit: vine.number().range([1, 1000]).withoutDecimals().optional(),
  })
)

export const MessageValidator = vine.compile(
  vine.object({
    content: vine.string().trim().optional()
  })
)

export const MessageUpdateValidator = vine.compile(
  vine.object({
    content: vine.string().trim()
  })
)