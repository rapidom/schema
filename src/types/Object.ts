import type { DefaultValueT, MessagesT, MessageTemplateI, ValueT, WithDefaultT, WithRequiredT } from "../constants";
import SchemaError, { ErrorDetailsT } from "../Error";
import AnyType from "./Any";

export default class ObjectType<T extends Record<string, unknown> = Record<string, unknown>,
  I = T> extends AnyType<T, I, TemplateI> {
  public get messages(): MessagesT<TemplateI> {
    return {
      ...super.messages,
      object: "{{ label }} needs to be an object",
      length: "{{ label }} needs to contain exactly {{ length }} key(s)",
      max: "{{ label }} needs to contain at most {{ max }} key(s)",
      min: "{{ label }} needs to contain at least {{ min }} key(s)",
    };
  }

  public length(length: number): this {
    return this.pipe((value) => {
      if (Object.keys(value).length === length) return value;

      this.fail<string>(this.render("length", { length }));
    });
  }

  public max(max: number): this {
    return this.pipe((value) => {
      if (Object.keys(value).length <= max) return value;

      this.fail<string>(this.render("max", { max }));
    });
  }

  public min(min: number): this {
    return this.pipe((value) => {
      if (Object.keys(value).length >= min) return value;

      this.fail<string>(this.render("min", { min }));
    });
  }

  public keys<K extends KeysTypeT<ValueT<T>>>(type: K): KeysResultT<ValueT<T>, K> {
    return this.pipe((value) => {
      const errors: Record<string, unknown> = {};

      const result = Object.keys(type).reduce<Record<string, unknown>>(
        (prev, key) => {
          let ret = value[key];

          try {
            ret = type[key].label(key).validate(ret);
          } catch (error) {
            if (error instanceof SchemaError) {
              errors[key] = error.details;
            } else throw error;
          }

          if (ret != null) prev[key] = ret;

          return prev;
        },
        {},
      );

      if (Object.keys(errors).length > 0) this.fail(errors as ErrorDetailsT<T>);

      return result as T;
    }) as never;
  }

  protected initialValidator(value: unknown): T {
    if (value instanceof Object) return value as T;

    this.fail<string>(this.render("object"));
  }
}

export interface TemplateI extends MessageTemplateI {
  object(): string;

  length(params: { length: number }): string;

  max(params: { max: number }): string;

  min(params: { min: number }): string;
}

export type KeyValueT<V> = null extends V
  ? AnyType<NonNullable<V>>
  : WithDefaultT<AnyType<V>, V> | WithRequiredT<AnyType<V>, true>;

export type KeysT<T extends Record<string, unknown>> = {
  [K in keyof T]: KeyValueT<T[K]>;
};

export type KeysTypeT<T extends Record<string, unknown>> = T extends Record<string,
    unknown>
  ? Record<string, unknown> extends T
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    KeysT<any>
    : KeysT<T>
  : KeysT<T>;

export type KeysResultT<T extends Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  K extends KeysT<T>> = T extends Record<string, unknown>
  ? Record<string, unknown> extends T
    ? K extends KeysT<infer U>
      ? ObjectType<U, InputT<U, K>>
      : ObjectType<T>
    : ObjectType<T>
  : ObjectType<T>;

type InputT<Value extends Record<string, unknown>,
  Schema extends KeysT<Value>> = Partial<InputNullableT<Value, Schema>> &
  Pick<InputNullableT<Value, Schema>,
    {
      [Key in keyof Value]: DefaultValueT<Schema[Key]> extends null
      ? Schema[Key]["isRequired"] extends true
        ? Key
        : never
      : never;
    }[keyof Value]>;

type InputNullableT<Value extends Record<string, unknown>,
  Schema extends KeysT<Value>> = {
  [Key in keyof Value]: DefaultValueT<Schema[Key]> extends null
    ? Schema[Key]["isRequired"] extends true
      ? Value[Key]
      : Value[Key] | null | undefined
    : Value[Key] | null | undefined;
};
