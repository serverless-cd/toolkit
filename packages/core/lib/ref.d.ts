interface IConfig {
    type: 'branch' | 'tag';
    value: string;
}
export declare function getRef(config: IConfig): string;
export declare function parseRef(ref: string): {
    type: string;
    value: string;
};
export {};
