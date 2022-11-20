import path from "path";
import { config } from "dotenv";
import { z } from "zod";

config({ path: path.resolve(__dirname, "../../.env") });

const configShape = z.object({
    PORT: z.string(),
    DATABASE_URL: z.string(),
    NODE_ENV: z.enum(['development', 'test', 'production']),
    ORIGIN: z.string(),
});

const customConfig = configShape.safeParse(process.env);

if (!customConfig.success) {
    console.error(
      '❌ Invalid environment variables:',
      JSON.stringify(customConfig.error.format(), null, 4),
    );
    process.exit(1);
  }

export const env = customConfig.data;