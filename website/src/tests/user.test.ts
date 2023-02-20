import { trpc } from 'utils/trpc'
import { expect, describe, it, vi } from 'vitest'

describe('user', () => {
    it('create new user', async () => {
        const result = trpc.register.useMutation().mutate({
            name: 'Test User',
            email: 'test_user@gmail.com',
            password: '123456',
        })
        expect(result).toEqual({
            user: {
                id: expect.any(Number),
                name: 'Test User',
                email: 'test_user@gmail.com',
                password: expect.any(String),
            },
            status: 'success',
        })
    })
})
