import type {
  DefaultTypeT,
  DefaultValueT,
  MessageArgsT,
  MessagesT,
  MessageTemplateI,
  ResultT,
  ValidatorT,
  WithDefaultT,
  WithRequiredT,
} from "../constants";
import SchemaError, { ErrorDetailsT } from "../Error";

export default abstract class AnyType<Type, InputType = Type, MessageTemplate extends MessageTemplateI = MessageTemplateI> {
  public getDefault: DefaultTypeT<InputType> = () => null;

  public isRequired = false;

  protected _pipeline: ValidatorT<Type>[] = [];

  protected _label?: string;

  public constructor() {
    this.pipe(this.initialValidator);
  }

  public get messages(): MessagesT<MessageTemplate> {
    return {
      required: "{{ label }} needs to have a value",
    } as MessagesT<MessageTemplate>;
  }

  public label(label: string): this {
    this._label = label;

    return this;
  }

  public default<Value extends InputType>(value: Value | (() => Value)): WithDefaultT<this, Value> {
    if (typeof value === "function") this.getDefault = value as () => Value;
    else this.getDefault = () => value;

    return this as WithDefaultT<this, Value>;
  }

  public required<Required extends boolean = true>(required: Required = true as Required): WithRequiredT<this, Required> {
    this.isRequired = required;

    return this as WithRequiredT<this, Required>;
  }

  public validate<Value = DefaultValueT<this>>(value: Value = this.getDefault() as never): ResultT<Type, InputType, this, Value> {
    if (value == null) {
      if (this.isRequired) this.fail<string>(this.render("required"));

      return null as ResultT<Type, InputType, this, Value>;
    }

    return this._pipeline.reduce(
      (result: Type, validator) => validator.call(this, result),
      value as never,
    ) as ResultT<Type, InputType, this, Value>;
  }

  public pipe(...validators: ValidatorT<Type>[]): this {
    this._pipeline = this._pipeline.concat(validators);

    return this;
  }

  protected render<Message extends keyof MessagesT<MessageTemplate>>(
    message: Message,
    params: MessageArgsT<MessageTemplate[Message]> = {} as never,
  ): string {
    const label = this._label;
    const template = this.messages[message].replace(
      /{{ *label *}} ?/g,
      label == null ? "" : `${label} `,
    );

    return Object.keys(params).reduce(
      (prev, key) =>
        prev.replace(new RegExp(`{{ *${key} *}}`, "g"), params[key] as string),
      template,
    );
  }

  protected fail<Details = Type>(details: ErrorDetailsT<Details>): never {
    throw new SchemaError<Details>(details);
  }

  protected abstract initialValidator(value: unknown): Type;
}
