export interface Validator<T> {
  parse: (value: string | undefined) => T;
}

export type Schema = Record<string, Validator<any>>;

export type InferSchema<S extends Schema> = {
  [K in keyof S]: ReturnType<S[K]["parse"]>;
};
