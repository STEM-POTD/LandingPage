import { mergeRouters } from '../utils/trpc'
import { problemsRouter } from './problems'

export const appRouter = mergeRouters(problemsRouter)
