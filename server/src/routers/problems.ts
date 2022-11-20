import { z } from 'zod';
import { publicProcedure, router } from '../utils/trpc';

export const problemsRouter = router({
    getProblemsBySubject: publicProcedure
    .input(
        z.object({
            subject: z.string(),
        })
    )
    .query(({ ctx }) => {
        return ctx.prisma?.problem.findMany();
    })
});