export type Nullable<T> = T | null;

export type Brand<T, TBrand extends string> = T & { readonly __brand: TBrand };

export type DeepPartial<T> = {
  [TKey in keyof T]?: T[TKey] extends object ? DeepPartial<T[TKey]> : T[TKey];
};

export type ReadonlyDeep<T> = {
  readonly [TKey in keyof T]: T[TKey] extends object ? ReadonlyDeep<T[TKey]> : T[TKey];
};

export type Result<TValue, TError> =
  | { readonly ok: true; readonly value: TValue }
  | { readonly ok: false; readonly error: TError };
