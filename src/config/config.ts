import { z } from 'zod';
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
});

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.error('❌ Invalid environment variables:', envVars.error.format());
  throw new Error('Invalid environment variables');
}

export const config = {
  port: parseInt(envVars.data.PORT),
  databaseUrl: envVars.data.DATABASE_URL,
  jwtSecret: envVars.data.JWT_SECRET,
  emailSecret: 'your-email-secret-key',
  email: {
    user: envVars.data.EMAIL_USER,
    pass: envVars.data.EMAIL_PASS,
  },
} as const;
