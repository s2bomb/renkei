export type Ok<T> = { readonly _tag: "Ok"; readonly value: T }
export type Err<E> = { readonly _tag: "Err"; readonly error: E }
export type Result<T, E> = Ok<T> | Err<E>

export function ok<T>(value: T): Result<T, never> {
  throw new Error("not implemented")
}

export function err<E>(error: E): Result<never, E> {
  throw new Error("not implemented")
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  throw new Error("not implemented")
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  throw new Error("not implemented")
}
