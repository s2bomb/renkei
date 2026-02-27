type Restore = () => void

export function spyWarn() {
  const calls: string[] = []
  const original = console.warn
  console.warn = (...args: unknown[]) => {
    calls.push(args.map((item) => String(item)).join(" "))
  }

  const restore: Restore = () => {
    console.warn = original
  }

  return {
    calls,
    restore,
  }
}
