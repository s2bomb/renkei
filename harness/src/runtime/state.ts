import { randomUUID } from "node:crypto"
import type { SessionCreateInput, SessionID, SessionInfo, SessionMessage } from "./types"

type RuntimeStore = {
  readonly tools: Map<string, unknown>
  readonly plugins: Map<string, unknown>
  readonly sessions: Map<SessionID, SessionInfo>
  readonly childIndex: Map<SessionID, Set<SessionID>>
  readonly messages: Map<SessionID, SessionMessage[]>
}

const stores = new Map<string, RuntimeStore>()

function createStore(): RuntimeStore {
  return {
    tools: new Map(),
    plugins: new Map(),
    sessions: new Map(),
    childIndex: new Map(),
    messages: new Map(),
  }
}

export function getStore(serverUrl: string): RuntimeStore {
  let store = stores.get(serverUrl)
  if (!store) {
    store = createStore()
    stores.set(serverUrl, store)
  }
  return store
}

export function createSession(store: RuntimeStore, input: SessionCreateInput): SessionInfo {
  const now = Date.now()
  const id = `ses_${randomUUID().replaceAll("-", "")}` as SessionID
  const slug = id.slice(4, 16)
  const info: SessionInfo = {
    id,
    slug,
    title: input.title ?? `Session ${new Date(now).toISOString()}`,
    parentID: input.parentID,
    name: input.name,
    time: {
      created: now,
      updated: now,
    },
  }
  store.sessions.set(id, info)
  if (info.parentID) {
    let children = store.childIndex.get(info.parentID)
    if (!children) {
      children = new Set<SessionID>()
      store.childIndex.set(info.parentID, children)
    }
    children.add(id)
  }
  return info
}

export function listChildren(
  store: RuntimeStore,
  parentSessionID: SessionID,
  active?: boolean,
): ReadonlyArray<SessionInfo> {
  const children = store.childIndex.get(parentSessionID)
  if (!children) {
    return []
  }
  const result: SessionInfo[] = []
  for (const id of children) {
    const session = store.sessions.get(id)
    if (!session) {
      continue
    }
    if (active === true && session.time.archived) {
      continue
    }
    if (active === false && !session.time.archived) {
      continue
    }
    result.push(session)
  }
  return result
}

export function addMessage(store: RuntimeStore, sessionID: SessionID, message: SessionMessage): void {
  const next = store.messages.get(sessionID) ?? []
  next.push(message)
  store.messages.set(sessionID, next)
}
