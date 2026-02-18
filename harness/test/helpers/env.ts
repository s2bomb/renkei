export function requireCompositionServerUrl(): string {
  const value = process.env.OPENCODE_SERVER_URL
  if (!value) {
    throw new Error("OPENCODE_SERVER_URL is required for integration tests")
  }
  return value
}

export function getForkServerUrl(): string | undefined {
  return process.env.OPENCODE_FORK_SERVER_URL
}

export function hasForkServer(): boolean {
  return Boolean(getForkServerUrl())
}
