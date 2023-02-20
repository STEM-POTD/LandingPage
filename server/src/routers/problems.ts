import { z } from 'zod'
import { publicProcedure, router } from '../utils/trpc'

export const problemsRouter = router({
    getProblemsBySubject: publicProcedure
        .input(
            z.object({
                limit: z.number(),
                cursor: z.string().optional(),
            })
        )
        .query(async ({ ctx, input: { limit, cursor } }) => {
            const items = await ctx.prisma.problem.findMany({
                take: limit + 1 ?? 2,
                cursor: cursor ? { id: cursor } : undefined,
                orderBy: { id: 'asc' },
            })

            let nextCursor: typeof cursor | undefined = undefined

            if (items.length > limit) {
                const nextItem = items.pop()
                nextCursor = nextItem?.id ?? ''
            }

            return {
                items,
                nextCursor,
            }
        }),

    getProblems: publicProcedure
        .input(
            z.object({
                userId: z.string().cuid().optional(),
            })
        )
        .query(async ({ ctx, input: { userId } }) => {
            if (!userId) {
                return await ctx.prisma.problem.findMany({
                    orderBy: { id: 'asc' },
                })
            }

            // Get all the problems that the user has not solved
            const problems = await ctx.prisma.problem.findMany({
                orderBy: { id: 'asc' },
                where: {
                    NOT: {
                        solvedBy: {
                            some: {
                                id: userId,
                            },
                        },
                    },
                },
            })

            return problems
        }),
})
