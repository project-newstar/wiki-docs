// biome-ignore lint/suspicious/noExplicitAny: input can be any type
function toBool(value: any, no_value: boolean, undefined_value: boolean): boolean {
  if (typeof value === "undefined") return undefined_value;
  if (value === null) return false;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const v = value.toLowerCase();
    if (v === "") return no_value; // no value specified
    if (v === "false" || v === "null" || v === "undefined" || v === "nan" || /^-?0(\.0*)?$/.test(value)) return false;
    return true;
  }
  if (typeof value === "number") return value !== 0 && !Number.isNaN(value);
  return false;
}

// biome-ignore lint/suspicious/noExplicitAny: input can be any type
export function asBool(value: any): boolean {
  return toBool(value, false, false);
}

// biome-ignore lint/suspicious/noExplicitAny: input can be any type
export function asURLParamBool(value: any) {
  return toBool(value, true, false);
}
