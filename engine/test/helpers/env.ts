export function requireCompositionServerUrl(): string {
  const value = process.env.OPENCODE_SERVER_URL
  if (!value) {
    throw new Error("OPENCODE_SERVER_URL is required for integration tests")
  }
  return value
}
