import z from 'zod'

export const signUp = z.object({
    name: z.string().min(3).max(30),
    email: z.email(),
    password: z.string().min(8).max(20)
})

export const login = z.object({
    email: z.email(),
    password: z.string().min(8).max(20)
})