import type { AnyType, ArrayType, BooleanType, DateType, NumberType, ObjectType, StringType } from "./types";

/* ------------------------- General ------------------------- */

export type ValueT<Type> = Type extends Record<string, unknown>
  ? { [Key in keyof Type]-?: ValueT<Type[Key]> }
  : Type extends (infer U)[]
    ? ValueT<U>[]
    : Type extends undefined
      ? null
      : Type;

/* ------------------------- Messages ------------------------- */

export interface MessageTemplateI {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [name: string]: (params: any) => string;
}

export type MessagesT<MT extends MessageTemplateI> = {
  [Key in keyof MT]: string;
} & {
  required: string;
};

export type MessageArgsT<T extends (params: Record<string, unknown>) => string> = T extends (params: infer U) => string ? U : never;

/* ------------------------- Type ------------------------- */

export type ValidatorT<Type> = (value: Type) => Type;

export type DefaultTypeT<Type> = () => Type | null;

export type DefaultValueT<// eslint-disable-next-line @typescript-eslint/no-explicit-any
  Schema extends AnyType<any, any, any>> = Schema["getDefault"] extends () => infer ReturnT ? ReturnT : never;

export type WithDefaultT<// eslint-disable-next-line @typescript-eslint/no-explicit-any
  Schema extends AnyType<any, any, any>,
  Default> = Schema & { getDefault: () => Default };

export type WithRequiredT<// eslint-disable-next-line @typescript-eslint/no-explicit-any
  Schema extends AnyType<any, any, any>,
  Required extends boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  > = Schema & { isRequired: Required extends false ? any : true };

export type ResultT<Type,
  InputT,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Schema extends AnyType<Type, InputT, any>,
  Value> = Schema["isRequired"] extends true
  ? ResultRequiredT<Type, InputT, ParsedValueT<Value, DefaultValueT<Schema>>>
  : ResultOptionalT<Type, InputT, ParsedValueT<Value, DefaultValueT<Schema>>>;

export type ResultRequiredT<Type, InputT, Value> = Value extends InputT
  ? Type
  : never;

export type ResultOptionalT<Type, InputT, Value> = Value extends InputT
  ? Type
  : Value extends null | undefined
    ? null
    : never;

export type ParsedValueT<Value, Default> = Value extends null | undefined
  ? Default
  : Value;

/* ------------------------- Schema ------------------------- */

export interface SchemaI {
  array<T = unknown>(): SchemaTypeT<ArrayType<T>>;

  boolean(): SchemaTypeT<BooleanType>;

  date(): SchemaTypeT<DateType>;

  number(): SchemaTypeT<NumberType>;

  object<T extends Record<string, unknown> = Record<string, unknown>>(): SchemaTypeT<ObjectType<T>>;

  string(): SchemaTypeT<StringType>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extend<Name extends string, Type extends () => AnyType<any, any, any>>(
    name: Name,
    type: Type,
  ): this & { [Key in Name]: () => SchemaTypeT<SchemaReturnT<Type>> };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SchemaTypeT<Schema extends AnyType<any, any, any>> = WithDefaultT<Schema,
  null>;

export type SchemaReturnT<// eslint-disable-next-line @typescript-eslint/no-explicit-any
  Fn extends () => AnyType<any, any, any>> = Fn extends () => infer Type ? Type : never;
