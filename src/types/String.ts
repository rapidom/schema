import { MessagesT, MessageTemplateI } from "../constants";
import AnyType from "./Any";

export default class StringType extends AnyType<string, string, TemplateI> {
  public get messages(): MessagesT<TemplateI> {
    return {
      ...super.messages,
      string: "{{ label }} needs to be a valid string",
      alphanum: "{{ label }} needs to only contain a-z, A-Z, 0-9",
      creditCard: "{{ label }} needs to be a valid credit-card",
      email: "{{ label }} needs to be a valid email address",
      enum: "{{ label }} needs to be one of {{ enum }}",
      ip: "{{ label }} needs to be a valid {{ type }} address",
      length: "{{ label }} needs to contain exactly {{ length }} character(s)",
      max: "{{ label }} needs to contain at most {{ max }} character(s)",
      min: "{{ label }} needs to contain at least {{ min }} character(s)",
      numeral: "{{ label }} needs to only contain numbers",
      regex: "{{ label }} needs to match {{ regex }}",
      token: "{{ label }} needs to only contain a-z, A-Z, 0-9, underscore (_)",
    };
  }

  public alphanum(): this {
    return this.pipe((value) => {
      if (/^[a-zA-Z0-9]*$/.test(value)) return value;

      this.fail(this.render("alphanum"));
    });
  }

  public creditCard(): this {
    return this.pipe((value) => {
      if (isCreditCard(value)) return value;

      this.fail(this.render("creditCard"));
    });
  }

  public email(): this {
    return this.pipe((value) => {
      if (/^\w[\w.]+@\w+?\.[a-zA-Z]{2,3}$/.test(value)) return value;

      this.fail(this.render("email"));
    });
  }

  public enum(values: string[]): this {
    const type = JSON.stringify(values);

    return this.pipe((value) => {
      if (values.includes(value)) return value;

      this.fail(this.render("enum", { enum: type }));
    });
  }

  public ip(version?: 4 | 6): this {
    if (version === 4) {
      return this.pipe((value) => {
        if (ipv4Regex.test(value)) return value;

        this.fail(this.render("ip", { type: "ipv4" }));
      });
    }

    if (version === 6) {
      return this.pipe((value) => {
        if (ipv6Regex.test(value)) return value;

        this.fail(this.render("ip", { type: "ipv6" }));
      });
    }

    return this.pipe((value) => {
      if (ipv4Regex.test(value) || ipv6Regex.test(value)) return value;

      this.fail(this.render("ip", { type: "ip" }));
    });
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

  public numeral(): this {
    return this.pipe((value) => {
      if (/^\d*$/.test(value)) return value;

      this.fail(this.render("numeral"));
    });
  }

  public regex(regex: RegExp): this {
    return this.pipe((value) => {
      if (regex.test(value)) return value;

      this.fail(this.render("regex", { regex }));
    });
  }

  public token(): this {
    return this.pipe((value) => {
      if (/^[a-zA-Z0-9_]*$/.test(value)) return value;

      this.fail(this.render("token"));
    });
  }

  protected initialValidator(value: unknown): string {
    if (typeof value === "string") return value;

    this.fail(this.render("string"));
  }
}

export interface TemplateI extends MessageTemplateI {
  string(): string;

  alphanum(): string;

  creditCard(): string;

  email(): string;

  enum(params: { enum: string }): string;

  ip(params: { type: "ip" | "ipv4" | "ipv6" }): string;

  length(params: { length: number }): string;

  max(params: { max: number }): string;

  min(params: { min: number }): string;

  numeral(): string;

  regex(params: { regex: RegExp }): string;

  token(): string;
}

const ipv4Regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

/**
 * using Luhn Algorithm
 */
function isCreditCard(code: string): boolean {
  code = code.replace(/[- ]/g, ""); // just in case

  const luhnArr = [
    [0, 2, 4, 6, 8, 1, 3, 5, 7, 9],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  ];

  const digits = code
    .split("") // splitting digits
    .map((digit) => +digit); // parsing digits into number type

  const sum = digits.reduce(
    (sum, digit, index) => sum + luhnArr[(digits.length - index) & 1][digit],
    0,
  );

  return sum % 10 === 0 && sum > 0;
}
