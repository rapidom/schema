import Schema, { SchemaError } from "@rapidom/schema";

/* ------------------------- TESTS ------------------------- */

it("should fail when it's required and the value is missing", () => {
  expect.assertions(2);

  try {
    Schema.boolean().required().validate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual("needs to have a value");
  }
});

it("should set the default value", () => {
  const result = Schema.boolean().default(false).validate();

  expect(result).toBe(false);
});

test("multiple validations", () => {
  expect.assertions(2);

  const schema = {
    bar: Schema.boolean().default(true).required(),
    boolean1: Schema.boolean().required(),
    boolean2: Schema.boolean(),
    boolean3: Schema.boolean(),
    foo: Schema.boolean().default(false),
  };

  const value = {
    boolean3: "hello",
    something: "else",
  };

  try {
    Schema.object().keys(schema).validate(value);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      boolean1: "boolean1 needs to have a value",
      boolean3: "boolean3 needs to be a boolean",
    });
  }
});
