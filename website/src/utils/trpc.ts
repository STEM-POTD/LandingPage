import { createTRPCReact } from '@trpc/react-query'
import { type AppRouter } from 'server'

export const trpc = createTRPCReact<AppRouter>()
export const token: string = document.cookie.split('=')[1]
