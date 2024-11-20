export function logOnDev(log: string) {
  if (import.meta.env.VITE_APP_MODE === "DEVELOPMENT") {
    console.log(log);
  }
}
