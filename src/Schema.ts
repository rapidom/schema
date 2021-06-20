import type { SchemaI } from "./constants";
import { ArrayType, BooleanType, DateType, NumberType, ObjectType, StringType } from "./types";

const SCHEMA: SchemaI = {
  array() {
    return new ArrayType() as never;
  },
  boolean() {
    return new BooleanType() as never;
  },
  date() {
    return new DateType() as never;
  },
  number() {
    return new NumberType() as never;
  },
  object() {
    return new ObjectType() as never;
  },
  string() {
    return new StringType() as never;
  },

  extend(name, type) {
    return Object.assign(SCHEMA, { [name]: type }) as never;
  },
};

export default SCHEMA;
