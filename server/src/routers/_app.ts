import { router } from '../utils/trpc'
import { problemsRouter } from './problems'
import { teamRouter } from './team'
import { userRouter } from './user'

export const appRouter = router({
    problems: problemsRouter,
    user: userRouter,
    team: teamRouter,
})
