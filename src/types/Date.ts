import type { MessagesT, MessageTemplateI } from "../constants";
import AnyType from "./Any";

export default class DateType extends AnyType<Date, DateInputT, TemplateI> {
  public get messages(): MessagesT<TemplateI> {
    return {
      ...super.messages,
      date: "{{ label }} needs to be a valid date",
      max: "{{ label }} needs to be before or same as {{ date }}",
      min: "{{ label }} needs to be after or same as {{ date }}",
    };
  }

  public max(max: DateInputT | (() => DateInputT)): this {
    const getMax = getDate(max);

    return this.pipe((value) => {
      const date = getMax();

      if (value <= date) return value;

      this.fail(this.render("max", { date }));
    });
  }

  public min(min: DateInputT | (() => DateInputT)): this {
    const getMin = getDate(min);

    return this.pipe((value) => {
      const date = getMin();

      if (value >= date) return value;

      this.fail(this.render("min", { date }));
    });
  }

  protected initialValidator(value: unknown): Date {
    if (typeof value === "string" || typeof value === "number")
      value = new Date(value);

    if (value instanceof Date && value.toString() !== "Invalid Date")
      return value;

    this.fail(this.render("date"));
  }
}

function getDate(value: DateInputT | (() => DateInputT)): () => Date {
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);

    return () => date;
  }

  if (typeof value === "function") {
    return () => {
      const date = value();

      if (typeof date === "string" || typeof date === "number")
        return new Date(date);

      return date;
    };
  }

  return () => value;
}

export interface TemplateI extends MessageTemplateI {
  date(): string;

  max(params: { date: Date }): string;

  min(params: { date: Date }): string;
}

export type DateInputT = Date | string | number;
