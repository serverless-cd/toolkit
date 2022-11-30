import { Row } from 'tablestore';
export declare function objectToString(value: object | unknown): string;
export declare function stringToNested(value: string | unknown): object;
export declare function valueToLong(value: unknown): any;
export declare function nullToString(value: unknown): any;
export declare function longToValue(value: unknown): any;
export declare const wrapAttributes: (attributes?: Record<string, any>) => any;
export declare const wrapRow: (rowData: Row) => Record<string, any>;
export declare const wrapRows: (rows?: never[]) => any[];
export declare const orderQuery: (orderKeys: string[]) => {
    sorters: any[];
};
