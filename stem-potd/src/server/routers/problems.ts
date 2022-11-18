import { publicProcedure, router } from "server/trpc";
import { z } from 'zod';

export const problemsRouter = router({
    getProblemsBySubject: publicProcedure
    .input(
        z.object({
            subject: z.string(),
        })
    )
    .query(({ ctx, input: { subject } }) => {
        return ctx.prisma.problem.findMany();
    })
});