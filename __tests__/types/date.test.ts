import Schema, { SchemaError } from "@rapidom/schema";

/* ------------------------- TESTS ------------------------- */

it("should fail to cast boolean to date", () => {
  expect.assertions(2);

  try {
    Schema.date().validate(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual("needs to be a valid date");
  }
});

it("should cast default value (number) to date", () => {
  const now = Date.now();

  const result = Schema.date().default(now).validate();

  expect(result).toEqual(new Date(now));
});

it("should cast default value (string) to date", () => {
  const date = "2018-12-26";

  const result = Schema.date().default(date).validate();

  expect(result).toEqual(new Date(date));
});

it("should convert default value returning number to date", () => {
  let date!: number;

  const result = Schema.date()
    .default(() => {
      date = Date.now();

      return date;
    })
    .validate();

  expect(result).toEqual(new Date(date));
});

it("should convert default value returning string to date", () => {
  const date = "2018-12-26";

  const result = Schema.date()
    .default(() => date)
    .validate();

  expect(result).toEqual(new Date(date));
});

it("should convert number to date", () => {
  const now = Date.now();

  const result = Schema.date().validate(now);

  expect(result).toEqual(new Date(now));
});

it("should convert string to date", () => {
  const date = "2018-12-26";

  const result = Schema.date().validate(date);

  expect(result).toEqual(new Date(date));
});

describe(".max", () => {
  it("should fail", async () => {
    expect.assertions(2);

    const max = new Date();

    await sleep(1000);

    const now = Date.now();

    try {
      Schema.date()
        .max(() => max)
        .validate(now);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error).toBeInstanceOf(SchemaError);
      expect(error.details).toEqual(`needs to be before or same as ${max}`);
    }
  });

  it("should pass (date passed as max)", () => {
    const now = Date.now();

    const result = Schema.date().max(new Date()).validate(now);

    expect(result).toEqual(new Date(now));
  });

  it("should pass (function passed as max)", () => {
    const now = Date.now();

    const result = Schema.date().max(Date.now).validate(now);

    expect(result).toEqual(new Date(now));
  });
});

describe(".min", () => {
  it("should fail", async () => {
    expect.assertions(2);

    const now = Date.now();

    await sleep(10);

    const min = Date.now();

    try {
      Schema.date().min(min).validate(now);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error).toBeInstanceOf(SchemaError);
      expect(error.details).toEqual(
        `needs to be after or same as ${new Date(min)}`,
      );
    }
  });

  it("should pass", async () => {
    const min = Date.now();

    await sleep(10);

    const now = Date.now();

    const result = Schema.date().min(min).validate(now);

    expect(result).toEqual(new Date(now));
  });
});

/* ------------------------- HELPERS ------------------------- */

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
