import { publicProcedure, router } from "../utils/trpc";
import z from "zod";
import { authedProcedure } from "./user";
import { TRPCError } from "@trpc/server";
import { Problem } from "@prisma/client";

export const teamRouter = router({
    create: authedProcedure
        .input(
            z.object({
                name: z.string(),
            })
        )
        .mutation(async ({ ctx, input: { name } }) => {
            const team = await ctx.prisma.team.create({
                data: {
                    name,
                },
            });

            return {
                team,
                status: "success",
            };
        }),

    join: authedProcedure
        .input(
            z.object({
                teamId: z.string(),
            })
        )
        .mutation(async ({ ctx, input: { teamId } }) => {
            const isFull = await ctx.prisma.team.findFirstOrThrow({
                where: {
                    id: teamId,
                },
                select: {
                    _count: {
                        select: {
                            members: true,
                        },
                    }
                },
            });

            if (isFull._count.members > 2) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Team is full",
                });
            }

            const team = await ctx.prisma.team.update({
                where: {
                    id: teamId,
                },
                data: {
                    members: {
                        connect: {
                            id: ctx.user.id,
                        }
                    },
                },
            });

            return {
                team,
                status: "success",
            };
        }),

    leave: authedProcedure
        .input(
            z.object({
                teamId: z.string(),
            })
        )
        .mutation(async ({ ctx, input: { teamId } }) => {
            const team = await ctx.prisma.team.update({
                where: {
                    id: teamId,
                },
                data: {
                    members: {
                        disconnect: {
                            id: ctx.user.id,
                        }
                    },
                },
            });

            return {
                team,
                status: "success",
            };
        }),

    delete: authedProcedure
        .input(
            z.object({
                teamId: z.string(),
            })
        )
        .mutation(async ({ ctx, input: { teamId } }) => {
            const team = await ctx.prisma.team.delete({
                where: {
                    id: teamId,
                },
            });

            return {
                team,
                status: "success",
            };
        }),

    all: publicProcedure
        .query(async ({ ctx }) => {
            const teams = await ctx.prisma.team.findMany({
                include: {
                    members: true,
                },
            });

            return {
                teams,
                status: "success",
            };
        }),

    byId: publicProcedure
        .input(
            z.object({
                id: z.string().cuid(),
            })
        )
        .query(async ({ ctx, input: { id } }) => {
            const team = await ctx.prisma.user.findFirstOrThrow({
                where: {
                    id,
                },
            }).team(
                {
                    include: {
                        members: true,
                    },
                }
            );

            return {
                team,
                status: "success",
            };
        }),

    problems: publicProcedure
        .input(
            z.object({
                teamId: z.string().cuid(),
            })
        )
        .query(async ({ ctx, input: { teamId } }) => {
            const members = await ctx.prisma.team.findFirstOrThrow({
                where: {
                    id: teamId,
                },
            }).members();

            const problems: Problem[] = [];

            for (const member of members) {
                const solved = await ctx.prisma.user.findFirstOrThrow({
                    where: {
                        id: member.id,
                    },
                }).solved();

                problems.push(...solved);
            }

            return {
                problems,
                status: "success",
            };
        })
});