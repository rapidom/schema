import Schema, { DateType } from "@rapidom/schema";

/* ------------------------- TESTS ------------------------- */

it("should extend the Schema methods", () => {
  const NewSchema = Schema.extend("something", () => new DateType());

  const date = Date.now();

  const result = NewSchema.something().validate(date);

  expect(result).toEqual(new Date(date));
});
