import { mergeRouters } from '../utils/trpc'
import { problemsRouter } from './problems'
import { userRouter } from './user'

export const appRouter = mergeRouters(problemsRouter, userRouter)
