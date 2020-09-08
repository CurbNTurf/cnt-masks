export declare const defaultPlaceholderChar = "_";
export declare function processCaretTraps(mask: any[]): {
    maskWithoutCaretTraps: any;
    indexes: any[];
};
export declare function conformToMask(rawValue?: string, mask?: any[] | any, config?: any): {
    conformedValue: string;
    meta: {
        someCharsRejected: boolean;
    };
};
