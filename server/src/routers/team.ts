import { router } from "../utils/trpc";
import z from "zod";
import { authedProcedure } from "./user";
import { TRPCError } from "@trpc/server";

export const teamRouter = router({
    create: authedProcedure
        .input(
            z.object({
                name: z.string(),
            })
        )
        .mutation(async ({ ctx, input: { name } }) => {
            const exists = await ctx.prisma.team.findFirst({
                where: {
                    OR: [
                        {
                            name,
                        },
                        {
                            members: {
                                some: {
                                    id: ctx.user.id,
                                },
                            },
                        }

                    ],
                },
            });

            if (exists) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Team already exists",
                });
            }

            const team = await ctx.prisma.team.create({
                data: {
                    name,
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

    addMember: authedProcedure
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

    removeMember: authedProcedure
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

});