export default class SchemaError<Details> extends Error {
  constructor(public details: ErrorDetailsT<Details>) {
    super("Schema validation failed.");
  }
}

export type ErrorDetailsT<Details> = Details extends Array<infer U>
  ? string | { [index: number]: ErrorDetailsT<U> }
  : Details extends Record<string, unknown>
    ? string | { [Key in keyof Details]?: ErrorDetailsT<Details[Key]> }
    : string;
