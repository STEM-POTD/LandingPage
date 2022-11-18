import { router } from "../trpc";
import { problemsRouter } from "./problems";

const appRouter = router({
    problems: problemsRouter,
});

export type AppRouter = typeof appRouter;