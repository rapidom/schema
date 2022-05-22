import Schema, { SchemaError } from "@rapidom/schema";

/* ------------------------- TESTS ------------------------- */

test(".keys", () => {
  const keys = {
    hello: Schema.string().default("world"),
    something: Schema.string().required(),
  };

  const schema = {
    foo: Schema.object().keys(keys),
    bar: Schema.object().keys(keys).required(),
  };

  const value = {
    foo: { hello: "there!" },
    bar: "not an object",
  };

  try {
    Schema.object().keys(schema).validate(value);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: {
        something: "something needs to have a value",
      },
      bar: "bar needs to be an object",
    });
  }
});

test(".length", () => {
  expect.assertions(2);

  const schema = {
    foo: Schema.object().length(1),
    bar: Schema.object().length(1),
  };

  const value = {
    foo: { hello: "world", something: "something" },
    bar: { something: "something" },
  };

  try {
    Schema.object().keys(schema).validate(value);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: "foo needs to contain exactly 1 key(s)",
    });
  }
});

test(".max", () => {
  const schema = {
    foo: Schema.object().max(1),
    bar: Schema.object().max(1),
  };

  const value = {
    foo: { hello: "world", something: "something" },
    bar: {},
  };

  try {
    Schema.object().keys(schema).validate(value);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: "foo needs to contain at most 1 key(s)",
    });
  }
});

test(".min", () => {
  const schema = {
    foo: Schema.object().min(1),
    bar: Schema.object().min(1),
  };

  const value = {
    foo: {},
    bar: { something: "something" },
  };

  try {
    Schema.object().keys(schema).validate(value);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: "foo needs to contain at least 1 key(s)",
    });
  }
});
