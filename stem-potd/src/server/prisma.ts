import { PrismaClient } from '@prisma/client';

import { z } from 'zod';

/*eslint sort-keys: "error"*/
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error(
    '❌ Invalid environment variables:',
    JSON.stringify(env.error.format(), null, 4),
  );
  process.exit(1);
}

declare global {
    var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      env.data.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (env.data.NODE_ENV !== 'production') {
  global.prisma = prisma;
}