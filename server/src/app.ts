import { createExpressMiddleware } from '@trpc/server/adapters/express'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { appRouter } from './routers/_app'
import { env } from './utils/default'
import { createContext } from './utils/trpc'
import { PrismaClient } from '@prisma/client'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cookieParser())
declare global {
    var prisma: PrismaClient
}

export const prisma =
    global.prisma ||
    new PrismaClient({
        log:
            env.NODE_ENV === 'development'
                ? ['query', 'error', 'warn']
                : ['error'],
    })

if (env.NODE_ENV !== 'production') {
    global.prisma = prisma
}

if (env.NODE_ENV !== 'production') app.use(morgan('dev'))

app.use(
    cors({
        origin: [env.ORIGIN, 'http://127.0.0.1:3000'],
        credentials: true,
    })
)

export type AppRouter = typeof appRouter

app.use(
    '/api/trpc',
    createExpressMiddleware({
        router: appRouter,
        createContext,
    })
)

const port = env.PORT || 5000

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

module.exports = app
