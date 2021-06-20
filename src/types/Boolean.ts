import type { MessagesT, MessageTemplateI } from "../constants";
import AnyType from "./Any";

export default class BooleanType extends AnyType<boolean, boolean, TemplateI> {
  public get messages(): MessagesT<TemplateI> {
    return {
      ...super.messages,
      boolean: "{{ label }} needs to be a boolean",
    };
  }

  protected initialValidator(value: unknown): boolean {
    if (typeof value === "boolean") return value;

    this.fail(this.render("boolean"));
  }
}

export interface TemplateI extends MessageTemplateI {
  boolean(): string;
}
