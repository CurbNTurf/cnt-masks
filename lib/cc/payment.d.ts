export declare class Payment {
    static fns: {
        cardExpiryVal: (value: string) => {
            month: any;
            year: any;
        };
        validateCardNumber: (num: string) => boolean;
        validateCardExpiry: (month: string, year: string) => boolean;
        validateCardCVC: (cvc: string, type?: string) => boolean;
        cardType: (num: string) => any;
        formatCardNumber: (num: string) => any;
    };
    static restrictNumeric(el: Element): any;
    static formatCardCVC(el: Element): Element;
    static formatCardExpiry(el: Element): Element;
    static formatCardExpiryMultiple(month: string, year: string): any;
    static formatCardNumber(el: Element, maxLength?: number): Element;
}
