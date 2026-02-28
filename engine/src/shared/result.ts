export type Ok<T> = { readonly _tag: "Ok"; readonly value: T }
export type Err<E> = { readonly _tag: "Err"; readonly error: E }
export type Result<T, E> = Ok<T> | Err<E>

export function ok<T>(value: T): Result<T, never> {
  return { _tag: "Ok", value }
}

export function err<E>(error: E): Result<never, E> {
  return { _tag: "Err", error }
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result._tag === "Ok"
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result._tag === "Err"
}
