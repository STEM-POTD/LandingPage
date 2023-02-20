/* eslint-disable no-var */
import { CreateExpressContextOptions, createExpressMiddleware } from '@trpc/server/adapters/express'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { appRouter } from './routers/_app'
import { env } from './utils/default'
import { createContext } from './utils/trpc'
import { PrismaClient } from '@prisma/client'
import cookieParser from 'cookie-parser'
import redisClient from './utils/redis'

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
        origin: env.ORIGIN,
        credentials: true,
    })
)

export type AppRouter = typeof appRouter

const expressApiHandler = createExpressMiddleware({
    router: appRouter,
    createContext: createContext,
})

const handler = (req: express.Request, res: express.Response) => {
    res.setHeader('Access-Control-Allow-Origin', env.ORIGIN);
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        return res.end();
    }

    return expressApiHandler(
        req,
        res,
        () => {
            res.statusCode = 404
            res.end()
        }
    )
}

app.use(
    '/api/trpc',
    handler
)

const port = env.PORT || 5000

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

module.exports = app
