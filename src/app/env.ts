import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  APP_URL: z.string().url(),
});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error(
    "Invalid environment variables",
    parsedEnv.error.flatten().fieldErrors //TRANFORMA O ERRO EM UM FORMATO MAIS LEGÍVEL (flatten)
  );

  throw new Error("Invalid environment variables.");
}

export const env = parsedEnv.data;
