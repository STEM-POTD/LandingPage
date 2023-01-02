import { z } from 'zod';
import { publicProcedure, router } from '../utils/trpc';

export const problemsRouter = router({
    getProblemsBySubject: publicProcedure
        .input(
            z.object({
                limit: z.number(),
                cursor: z.string().optional(),
            })
        )
        .query(async ({ ctx, input: { limit, cursor} }) => {
            const items = await ctx.prisma.problem.findMany({
                take: limit + 1 ?? 2,
                cursor: cursor ? { id: cursor } : undefined,
                orderBy: { id: 'asc' },
            });
            
            let nextCursor: typeof cursor | undefined = undefined;
            
            if(items.length! > limit) {
                const nextItem = items.pop();
                nextCursor = nextItem!.id;
            }
            
            return {
                items,  
                nextCursor,
            };
        }),

    getProblems: publicProcedure
        .query(async ({ ctx }) => {
            return await ctx.prisma.problem.findMany();
        })
});