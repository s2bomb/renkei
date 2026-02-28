import { describe, test, expect } from "bun:test"
import type { Ok, Err } from "../../../src/shared/result"
import { ok, err, isOk, isErr } from "../../../src/shared/result"

describe("Result", () => {
  test("T-S01: ok() produces an Ok result with correct discriminant and value", () => {
    const result = ok("hello")
    expect(result._tag).toBe("Ok")
    const okResult = result as Ok<string>
    expect(okResult.value).toBe("hello")
  })

  test("T-S02: err() produces an Err result with correct discriminant and error", () => {
    const error = { tag: "WorktreeNotFound" as const, message: "not found", path: "/missing" }
    const result = err(error)
    expect(result._tag).toBe("Err")
    const errResult = result as Err<typeof error>
    expect(errResult.error.tag).toBe("WorktreeNotFound")
  })

  test("T-S03: isOk() returns true for Ok results and false for Err results", () => {
    expect(isOk(ok(42))).toBe(true)
    expect(isOk(err("fail"))).toBe(false)
  })

  test("T-S04: isErr() returns true for Err results and false for Ok results", () => {
    expect(isErr(err("fail"))).toBe(true)
    expect(isErr(ok(42))).toBe(false)
  })

  test("T-S05: ok() and err() produce distinct _tag values enabling exhaustive switch", () => {
    const results = [ok("x"), err("y")]
    const reached: string[] = []

    for (const result of results) {
      switch (result._tag) {
        case "Ok":
          reached.push("Ok")
          break
        case "Err":
          reached.push("Err")
          break
        default: {
          const _exhaustive: never = result
          reached.push("default")
        }
      }
    }

    expect(reached).toEqual(["Ok", "Err"])
  })
})
