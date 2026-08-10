export const appConfig = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "/api/v1",
  internalApiUrl:
    process.env.INTERNAL_API_URL ?? "http://localhost:8000/api/v1",
} as const;

