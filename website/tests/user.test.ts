import { trpc } from "utils/trpc"


describe('Create a new user', () => {
    it('should create a new user', async () => {
        const result = await ({
            input: {
                name: 'Test User',
                email: 'test_user@gmail.com',
                password: 'test_password',
            },
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