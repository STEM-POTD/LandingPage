import { z } from 'zod'

const userValidator = z.object({
    id: z.string().cuid(),
    email: z.string().email(),
    name: z.string(),
    role: z.enum(['ADMIN', 'USER']),
    password: z.string(),
    provider: z.string().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    score: z.number(),
})

export default userValidator
