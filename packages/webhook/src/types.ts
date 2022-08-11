export type SingleOrArray<T> = T[] | T;

export interface CreateHandlerOptions {
    path: string;
    secret: string;
    events?: string | string[];
}