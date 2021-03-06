import type { MessagesT, MessageTemplateI } from "../constants";
import SchemaError, { ErrorDetailsT } from "../Error";
import AnyType from "./Any";

export default class ArrayType<T = unknown> extends AnyType<T[], T[], TemplateI> {
  public get messages(): MessagesT<TemplateI> {
    return {
      ...super.messages,
      array: "{{ label }} needs to be an array",
      length: "{{ label }} needs to contain exactly {{ length }} item(s)",
      max: "{{ label }} needs to contain at most {{ max }} item(s)",
      min: "{{ label }} needs to contain at least {{ min }} item(s)",
    };
  }

  public length(length: number): this {
    return this.pipe((value) => {
      if (value.length === length) return value;

      this.fail(this.render("length", { length }));
    });
  }

  public max(max: number): this {
    return this.pipe((value) => {
      if (value.length <= max) return value;

      this.fail(this.render("max", { max }));
    });
  }

  public min(min: number): this {
    return this.pipe((value) => {
      if (value.length >= min) return value;

      this.fail(this.render("min", { min }));
    });
  }

  public items<A extends ItemsType<T>>(type: A): ItemsResult<T, A> {
    return this.pipe((value) => {
      const label = this._label;
      const errors: ErrorDetailsT<T[]> = {};

      const result = value.reduce<T[]>((prev, cur, index) => {
        let ret = cur;

        if (label != null) type.label(`${label}[${index}]`);

        try {
          ret = (type as AnyType<T>).validate(cur) as T;
        } catch (error) {
          if (error instanceof SchemaError) {
            errors[index] = error.details as ErrorDetailsT<T>;
          } else throw error;
        }

        return prev.concat(ret);
      }, []);

      if (Object.keys(errors).length > 0) this.fail(errors);

      return result;
    }) as never;
  }

  protected initialValidator(value: unknown): T[] {
    if (Array.isArray(value)) return value;

    this.fail(this.render("array"));
  }
}

export interface TemplateI extends MessageTemplateI {
  array(): string;

  length(params: { length: number }): string;

  max(params: { max: number }): string;

  min(params: { min: number }): string;
}

export type ItemsType<T> = T extends unknown
  ? unknown extends T
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AnyType<any>
    : AnyType<T>
  : AnyType<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ItemsResult<T, A extends AnyType<any>> = T extends unknown
  ? unknown extends T
    ? A extends AnyType<infer U>
      ? ArrayType<U>
      : ArrayType<T>
    : ArrayType<T>
  : ArrayType<T>;
