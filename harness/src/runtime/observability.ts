type SpanRecord = {
  readonly name: string
  readonly attributes: Record<string, unknown>
  readonly time: number
}

const spans: SpanRecord[] = []

export function recordSpan(name: string, attributes: Record<string, unknown>): void {
  spans.push({
    name,
    attributes,
    time: Date.now(),
  })
}

export function listRecordedSpans(): ReadonlyArray<SpanRecord> {
  return spans.slice()
}

export function clearRecordedSpans(): void {
  spans.length = 0
}
