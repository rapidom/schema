import Schema, { SchemaError } from "@rapidom/schema";

/* ------------------------- TESTS ------------------------- */

describe(".length", () => {
  it("should fail", () => {
    expect.assertions(2);

    const schema = {
      bar: Schema.array().length(3),
      foo: Schema.array().length(1),
    };

    const value = {
      bar: [1, 2, 3],
      foo: [1, 2],
    };

    try {
      Schema.object().keys(schema).validate(value);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error).toBeInstanceOf(SchemaError);
      expect(error.details).toEqual({
        foo: "foo needs to contain exactly 1 item(s)",
      });
    }
  });

  it("should pass", () => {
    const schema = {
      bar: Schema.array().length(3),
      foo: Schema.array().length(1),
    };

    const value = {
      bar: [1, 2, 3],
      foo: [1],
    };

    const result = Schema.object().keys(schema).validate(value);

    expect(result).toEqual(value);
  });
});

describe(".max", () => {
  it("should fail", () => {
    expect.assertions(2);

    const schema = {
      bar: Schema.array().max(2),
      foo: Schema.array().max(1),
    };

    const value = {
      bar: [1, 2],
      foo: [1, 2],
    };

    try {
      Schema.object().keys(schema).validate(value);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error).toBeInstanceOf(SchemaError);
      expect(error.details).toEqual({
        foo: "foo needs to contain at most 1 item(s)",
      });
    }
  });

  it("should pass", () => {
    const schema = {
      bar: Schema.array().max(2),
      foo: Schema.array().max(1),
    };

    const value = {
      bar: [1, 2],
      foo: [1],
    };

    const result = Schema.object().keys(schema).validate(value);

    expect(result).toEqual(value);
  });
});

describe(".min", () => {
  it("should fail", () => {
    expect.assertions(2);

    const schema = {
      bar: Schema.array().min(2),
      foo: Schema.array().min(1),
    };

    const value = {
      bar: [1, 2],
      foo: [],
    };

    try {
      Schema.object().keys(schema).validate(value);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error).toBeInstanceOf(SchemaError);
      expect(error.details).toEqual({
        foo: "foo needs to contain at least 1 item(s)",
      });
    }
  });

  it("should pass", () => {
    const schema = {
      bar: Schema.array().min(2),
      foo: Schema.array().min(1),
    };

    const value = {
      bar: [1, 2],
      foo: [1],
    };

    const result = Schema.object().keys(schema).validate(value);

    expect(result).toEqual(value);
  });
});

describe(".items", () => {
  it("should fail", () => {
    expect.assertions(2);

    const schema = {
      bar: Schema.array().items(Schema.string()),
      foo: Schema.array().items(Schema.number()),
    };

    const value = {
      bar: [1],
      foo: [1, 2],
    };

    try {
      Schema.object().keys(schema).validate(value);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error).toBeInstanceOf(SchemaError);
      expect(error.details).toEqual({
        bar: {
          0: "bar[0] needs to be a valid string",
        },
      });
    }
  });

  it("should pass", () => {
    const schema = {
      bar: Schema.array().items(Schema.string()),
      foo: Schema.array().items(Schema.number()),
    };

    const value = {
      bar: ["some string"],
      foo: [1, 2],
    };

    const result = Schema.object().keys(schema).validate(value);

    expect(result).toEqual(value);
  });
});

describe("complex", () => {
  it("should fail", () => {
    expect.assertions(2);

    const schema = {
      array1: Schema.array(),
      bar: Schema.array().min(1).max(3).default([1, 2]),
      foo: Schema.array().length(1),
    };

    const value = {
      array1: "not an array",
      foo: [1, 2],
    };

    try {
      Schema.object().keys(schema).validate(value);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error).toBeInstanceOf(SchemaError);
      expect(error.details).toEqual({
        array1: "array1 needs to be an array",
        foo: "foo needs to contain exactly 1 item(s)",
      });
    }
  });

  it("should pass", () => {
    const schema = {
      array1: Schema.array(),
      bar: Schema.array().min(1).max(3).default([1, 2]),
      foo: Schema.array().length(1),
    };

    const value = {
      array1: ["string in an array"],
      foo: [1],
    };

    const result = Schema.object().keys(schema).validate(value);

    expect(result).toEqual({
      ...value,
      bar: [1, 2],
    });
  });
});
