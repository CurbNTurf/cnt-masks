import { Pipe, Directive, ElementRef, Renderer2, HostListener, forwardRef, Inject, PLATFORM_ID, Optional, Input, NgModule } from '@angular/core';
import { conformToMask, TextMaskModule } from 'angular2-text-mask';
import { isPlatformBrowser } from '@angular/common';
import { NG_VALUE_ACCESSOR, COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { createTextMaskInputElement } from 'text-mask-core/dist/textMaskCore';

class CardExpirationPipe {
    transform(value) {
        if (typeof value !== 'number') {
            value = value + '';
        }
        if (typeof value !== 'string') {
            return value;
        }
        if (value.length === 3) {
            value = `0${value}`;
        }
        return `${value.substring(0, 2)}/${value.substring(2)}`;
    }
}
CardExpirationPipe.decorators = [
    { type: Pipe, args: [{
                name: 'cardExpiration',
            },] }
];

let cards;
let defaultFormat;
const ɵ0 = function (item) {
    for (let i = 0, l = this.length; i < l; i++) {
        if (i in this && this[i] === item) {
            return i;
        }
    }
    return -1;
};
const indexOf = [].indexOf || ɵ0;
defaultFormat = /(\d{1,4})/g;
cards = [
    {
        type: 'amex',
        pattern: /^3[47]/,
        format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
        length: [15],
        cvcLength: [4],
        luhn: true,
    },
    {
        type: 'dankort',
        pattern: /^5019/,
        format: defaultFormat,
        length: [16],
        cvcLength: [3],
        luhn: true,
    },
    {
        type: 'hipercard',
        pattern: /^(384100|384140|384160|606282|637095|637568|60(?!11))/,
        format: defaultFormat,
        length: [14, 15, 16, 17, 18, 19],
        cvcLength: [3],
        luhn: true,
    },
    {
        type: 'dinersclub',
        pattern: /^(36|38|30[0-5])/,
        format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
        length: [14],
        cvcLength: [3],
        luhn: true,
    },
    {
        type: 'discover',
        pattern: /^(6011|65|64[4-9]|622)/,
        format: defaultFormat,
        length: [16],
        cvcLength: [3],
        luhn: true,
    },
    {
        type: 'jcb',
        pattern: /^35/,
        format: defaultFormat,
        length: [16],
        cvcLength: [3],
        luhn: true,
    },
    {
        type: 'laser',
        pattern: /^(6706|6771|6709)/,
        format: defaultFormat,
        length: [16, 17, 18, 19],
        cvcLength: [3],
        luhn: true,
    },
    {
        type: 'maestro',
        pattern: /^(5018|5020|5038|6304|6703|6708|6759|676[1-3])/,
        format: defaultFormat,
        length: [12, 13, 14, 15, 16, 17, 18, 19],
        cvcLength: [3],
        luhn: true,
    },
    {
        type: 'mastercard',
        pattern: /^(5[1-5]|677189)|^(222[1-9]|2[3-6]\d{2}|27[0-1]\d|2720)/,
        format: defaultFormat,
        length: [16],
        cvcLength: [3],
        luhn: true,
    },
    {
        type: 'unionpay',
        pattern: /^62/,
        format: defaultFormat,
        length: [16, 17, 18, 19],
        cvcLength: [3],
        luhn: false,
    },
    {
        type: 'visaelectron',
        pattern: /^4(026|17500|405|508|844|91[37])/,
        format: defaultFormat,
        length: [16],
        cvcLength: [3],
        luhn: true,
    },
    {
        type: 'elo',
        // tslint:disable-next-line:max-line-length
        pattern: /^(4011(78|79)|43(1274|8935)|45(1416|7393|763(1|2))|50(4175|6699|67[0-7][0-9]|9000)|627780|63(6297|6368)|650(03([^4])|04([0-9])|05(0|1)|4(0[5-9]|3[0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8])|9([2-6][0-9]|7[0-8])|541|700|720|901)|651652|655000|655021)/,
        format: defaultFormat,
        length: [16],
        cvcLength: [3],
        luhn: true,
    },
    {
        type: 'visa',
        pattern: /^4/,
        format: defaultFormat,
        length: [13, 16, 19],
        cvcLength: [3],
        luhn: true,
    },
];
function cardFromNumber(num) {
    let card;
    let i;
    let len;
    const numString = (num + '').replace(/\D/g, '');
    for (i = 0, len = cards.length; i < len; i++) {
        card = cards[i];
        if (card.pattern.test(numString)) {
            return card;
        }
    }
    return;
}
function cardFromType(type) {
    let card;
    let i;
    let len;
    for (i = 0, len = cards.length; i < len; i++) {
        card = cards[i];
        if (card.type === type) {
            return card;
        }
    }
    return;
}
function luhnCheck(num) {
    let digits;
    let odd = true;
    let sum = 0;
    digits = (num + '').split('').reverse();
    digits.forEach((digitString) => {
        let digit = parseInt(digitString, 10);
        odd = !odd;
        if (odd) {
            digit *= 2;
        }
        if (digit > 9) {
            digit -= 9;
        }
        return (sum += digit);
    });
    return sum % 10 === 0;
}
function hasTextSelected(target) {
    let e;
    try {
        // If some text is selected
        if (target &&
            target.selectionStart != null &&
            target.selectionStart !== target.selectionEnd) {
            return true;
        }
    }
    catch (error) {
        e = error;
    }
    return false;
}
function qjon(element, eventName, callback) {
    if (element.length) {
        // handle multiple elements
        for (const el of Array.from(element)) {
            qjon(el, eventName, callback);
        }
        return;
    }
    if (eventName.match(' ')) {
        // handle multiple event attachment
        for (const multiEventName of Array.from(eventName.split(' '))) {
            qjon(element, multiEventName, callback);
        }
        return;
    }
    if (element.addEventListener) {
        return element.addEventListener(eventName, callback, false);
    }
    if (element.attachEvent) {
        eventName = 'on' + eventName;
        return element.attachEvent(eventName, callback);
    }
    element['on' + eventName] = callback;
}
function trigger(el, name, data) {
    let ev;
    try {
        ev = new CustomEvent(name, { detail: data });
    }
    catch (e) {
        ev = document.createEvent('CustomEvent');
        // jsdom doesn't have initCustomEvent, so we need this check for
        // testing
        if (ev.initCustomEvent) {
            ev.initCustomEvent(name, true, true, data);
        }
        else {
            ev.initEvent(name, true, true, data);
        }
    }
    return el.dispatchEvent(ev);
}
// Public
// @dynamic
class Payment {
    static restrictNumeric(el) {
        return qjon(el, 'keypress', restrictNumeric);
    }
    static formatCardCVC(el) {
        Payment.restrictNumeric(el);
        qjon(el, 'keypress', restrictCVC);
        return el;
    }
    static formatCardExpiry(el) {
        let month;
        let year;
        Payment.restrictNumeric(el);
        if (el.length && el.length === 2) {
            (month = el[0]), (year = el[1]);
            this.formatCardExpiryMultiple(month, year);
        }
        else {
            qjon(el, 'keypress', restrictCombinedExpiry);
            qjon(el, 'keypress', formatExpiry);
            qjon(el, 'keypress', formatForwardSlash);
            qjon(el, 'keypress', formatForwardExpiry);
            qjon(el, 'keydown', formatBackExpiry);
        }
        return el;
    }
    static formatCardExpiryMultiple(month, year) {
        qjon(month, 'keypress', restrictMonthExpiry);
        qjon(month, 'keypress', formatMonthExpiry);
        return qjon(year, 'keypress', restrictYearExpiry);
    }
    static formatCardNumber(el, maxLength) {
        Payment.restrictNumeric(el);
        qjon(el, 'keypress', restrictCardNumber(maxLength));
        qjon(el, 'keypress', formatCardNumber(maxLength));
        qjon(el, 'keydown', formatBackCardNumber);
        qjon(el, 'keyup blur', setCardType);
        qjon(el, 'paste', reFormatCardNumber);
        qjon(el, 'input', reFormatCardNumber);
        return el;
    }
}
Payment.fns = {
    cardExpiryVal: (value) => {
        let month;
        let prefix;
        let year;
        let ref;
        value = value.replace(/\s/g, '');
        (ref = value.split('/', 2)), (month = ref[0]), (year = ref[1]);
        // Allow for year shortcut
        if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
            prefix = new Date().getFullYear();
            prefix = prefix.toString().slice(0, 2);
            year = prefix + year;
        }
        return {
            month,
            year,
        };
    },
    validateCardNumber: (num) => {
        let card;
        let ref;
        num = (num + '').replace(/\s+|-/g, '');
        if (!/^\d+$/.test(num)) {
            return false;
        }
        card = cardFromNumber(num);
        if (!card) {
            return false;
        }
        return (((ref = num.length), indexOf.call(card.length, ref) >= 0) &&
            (card.luhn === false || luhnCheck(num)));
    },
    validateCardExpiry: (month, year) => {
        // Allow passing an object
        let currentTime;
        let expiry;
        let prefix;
        let ref1;
        if (typeof month === 'string' && indexOf.call(month, '/') >= 0) {
            (ref1 = Payment.fns.cardExpiryVal(month)),
                (month = ref1.month),
                (year = ref1.year);
        }
        if (!(month && year)) {
            return false;
        }
        month = month.trim();
        year = year.trim();
        if (!/^\d+$/.test(month)) {
            return false;
        }
        if (!/^\d+$/.test(year)) {
            return false;
        }
        const monthInt = parseInt(month, 10);
        if (!(monthInt && monthInt <= 12)) {
            return false;
        }
        if (year.length === 2) {
            prefix = new Date().getFullYear();
            prefix = prefix.toString().slice(0, 2);
            year = prefix + year;
        }
        expiry = new Date(parseInt(year, 10), monthInt);
        currentTime = new Date();
        // Months start from 0 in JavaScript
        expiry.setMonth(expiry.getMonth() - 1);
        // The cc expires at the end of the month,
        // so we need to make the expiry the first day
        // of the month after
        expiry.setMonth(expiry.getMonth() + 1, 1);
        return expiry > currentTime;
    },
    validateCardCVC: (cvc, type) => {
        let ref;
        let ref1;
        cvc = cvc.trim();
        if (!/^\d+$/.test(cvc)) {
            return false;
        }
        if (type && cardFromType(type)) {
            // Check against a explicit card type
            ref1 = cardFromType(type);
            return ((ref = cvc.length),
                indexOf.call(ref1 != null ? ref1.cvcLength : void 0, ref) >= 0);
        }
        else {
            // Check against all types
            return cvc.length >= 3 && cvc.length <= 4;
        }
    },
    cardType: (num) => {
        if (!num) {
            return null;
        }
        const ref = cardFromNumber(num);
        return (ref != null ? ref.type : void 0) || null;
    },
    formatCardNumber: (num) => {
        let card;
        let groups;
        let upperLength;
        card = cardFromNumber(num);
        if (!card) {
            return num;
        }
        upperLength = card.length[card.length.length - 1];
        num = num.replace(/\D/g, '');
        num = num.slice(0, upperLength);
        if (card.format.global) {
            const ref = num.match(card.format);
            return ref != null ? ref.join(' ') : void 0;
        }
        else {
            groups = card.format.exec(num);
            if (groups == null) {
                return;
            }
            groups.shift();
            groups = groups.filter((n) => n); // Filter empty groups
            return groups.join(' ');
        }
    },
};
// Private
// Format Card Number
function reFormatCardNumber(e) {
    return setTimeout(() => {
        let value;
        const target = e.target;
        if (!target) {
            return;
        }
        value = target.value;
        value = Payment.fns.formatCardNumber(value);
        if (value) {
            target.value = value;
        }
        return trigger(target, 'change');
    });
}
function formatCardNumber(maxLength) {
    return (e) => {
        // Only format if input is a number
        let card;
        let digit;
        let i;
        let length;
        let re;
        let target;
        let upperLength;
        let upperLengths;
        let value;
        let j;
        let len;
        digit = String.fromCharCode(e.which);
        if (!/^\d+$/.test(digit)) {
            return;
        }
        target = e.target;
        value = target.value;
        card = cardFromNumber(value + digit);
        length = (value.replace(/\D/g, '') + digit).length;
        upperLengths = [16];
        if (card) {
            upperLengths = card.length;
        }
        if (maxLength) {
            upperLengths = upperLengths.filter((x) => x <= maxLength);
        }
        // Return if an upper length has been reached
        for (i = j = 0, len = upperLengths.length; j < len; i = ++j) {
            upperLength = upperLengths[i];
            if (length >= upperLength && upperLengths[i + 1]) {
                continue;
            }
            if (length >= upperLength) {
                return;
            }
        }
        // Return if focus isn't at the end of the text
        if (hasTextSelected(target)) {
            return;
        }
        if (card && card.type === 'amex') {
            // Amex cards are formatted differently
            re = /^(\d{4}|\d{4}\s\d{6})$/;
        }
        else {
            re = /(?:^|\s)(\d{4})$/;
        }
        // If '4242' + 4
        if (re.test(value)) {
            e.preventDefault();
            target.value = value + ' ' + digit;
            return trigger(target, 'change');
        }
        return;
    };
}
function formatBackCardNumber(e) {
    const target = e.target;
    const value = target.value;
    if (e.meta) {
        return;
    }
    // Return unless backspacing
    if (e.which !== 8) {
        return;
    }
    // Return if focus isn't at the end of the text
    if (hasTextSelected(target)) {
        return;
    }
    // Remove the trailing space
    if (/\d\s$/.test(value)) {
        e.preventDefault();
        target.value = value.replace(/\d\s$/, '');
        return trigger(target, 'change');
    }
    else if (/\s\d?$/.test(value)) {
        e.preventDefault();
        target.value = value.replace(/\s\d?$/, '');
        return trigger(target, 'change');
    }
    return;
}
// Format Expiry
function formatExpiry(e) {
    // Only format if input is a number
    const digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
        return;
    }
    const target = e.target;
    const val = target.value + digit;
    if (/^\d$/.test(val) && val !== '0' && val !== '1') {
        e.preventDefault();
        target.value = '0' + val + ' / ';
        return trigger(target, 'change');
    }
    else if (/^\d\d$/.test(val)) {
        e.preventDefault();
        target.value = val + ' / ';
        return trigger(target, 'change');
    }
    return;
}
function formatMonthExpiry(e) {
    const digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
        return;
    }
    const target = e.target;
    const val = target.value + digit;
    if (/^\d$/.test(val) && val !== '0' && val !== '1') {
        e.preventDefault();
        target.value = '0' + val;
        return trigger(target, 'change');
    }
    else if (/^\d\d$/.test(val)) {
        e.preventDefault();
        target.value = val;
        return trigger(target, 'change');
    }
    return;
}
function formatForwardExpiry(e) {
    const digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
        return;
    }
    const target = e.target;
    const val = target.value;
    if (/^\d\d$/.test(val)) {
        target.value = val + ' / ';
        return trigger(target, 'change');
    }
    return;
}
function formatForwardSlash(e) {
    const slash = String.fromCharCode(e.which);
    if (slash !== '/') {
        return;
    }
    const target = e.target;
    const val = target.value;
    if (/^\d$/.test(val) && val !== '0') {
        target.value = '0' + val + ' / ';
        return trigger(target, 'change');
    }
    return;
}
function formatBackExpiry(e) {
    // If shift+backspace is pressed
    if (e.metaKey) {
        return;
    }
    const target = e.target;
    const value = target.value;
    // Return unless backspacing
    if (e.which !== 8) {
        return;
    }
    // Return if focus isn't at the end of the text
    if (hasTextSelected(target)) {
        return;
    }
    // Remove the trailing space
    if (/\d(\s|\/)+$/.test(value)) {
        e.preventDefault();
        target.value = value.replace(/\d(\s|\/)*$/, '');
        return trigger(target, 'change');
    }
    else if (/\s\/\s?\d?$/.test(value)) {
        e.preventDefault();
        target.value = value.replace(/\s\/\s?\d?$/, '');
        return trigger(target, 'change');
    }
    return;
}
//  Restrictions
function restrictNumeric(e) {
    // Key event is for a browser shortcut
    let input;
    if (e.metaKey || e.ctrlKey) {
        return true;
    }
    // If keycode is a space
    if (e.which === 32) {
        e.preventDefault();
        return false;
    }
    // If keycode is a special char (WebKit)
    if (e.which === 0) {
        return true;
    }
    // If char is a special char (Firefox)
    if (e.which < 33) {
        return true;
    }
    input = String.fromCharCode(e.which);
    // Char is a number or a space
    if (!/[\d\s]/.test(input)) {
        e.preventDefault();
        return false;
    }
}
function restrictCardNumber(maxLength) {
    return (e) => {
        let length;
        const target = e.target;
        const digit = String.fromCharCode(e.which);
        if (!/^\d+$/.test(digit)) {
            return;
        }
        if (hasTextSelected(target)) {
            return;
        }
        // Restrict number of digits
        const value = (target.value + digit).replace(/\D/g, '');
        const card = cardFromNumber(value);
        length = 16;
        if (card) {
            length = card.length[card.length.length - 1];
        }
        if (maxLength) {
            length = Math.min(length, maxLength);
        }
        if (!(value.length <= length)) {
            return e.preventDefault();
        }
    };
}
function restrictExpiry(e, length) {
    let value;
    const target = e.target;
    const digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
        return;
    }
    if (hasTextSelected(target)) {
        return;
    }
    value = target.value + digit;
    value = value.replace(/\D/g, '');
    if (value.length > length) {
        return e.preventDefault();
    }
}
function restrictCombinedExpiry(e) {
    return restrictExpiry(e, 6);
}
function restrictMonthExpiry(e) {
    return restrictExpiry(e, 2);
}
function restrictYearExpiry(e) {
    return restrictExpiry(e, 4);
}
function restrictCVC(e) {
    const target = e.target;
    const digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
        return;
    }
    if (hasTextSelected(target)) {
        return;
    }
    const val = target.value + digit;
    if (!(val.length <= 4)) {
        return e.preventDefault();
    }
}
function setCardType(e) {
    const target = e.target;
    const val = target.value;
    const cardType = Payment.fns.cardType(val) || 'unknown';
    if (target && target.classList && !target.classList.contains(cardType)) {
        target.classList.add('unknown');
        cards.forEach((card) => target.classList.remove(card.type));
        target.classList.add(cardType);
        if (cardType !== 'unknown') {
            if (target.classList.contains('identified')) {
                target.classList.add('identified');
            }
        }
        else {
            target.classList.remove('identified');
        }
        return trigger(target, 'payment.cardType', cardType);
    }
    return;
}

class CCCvcFormatDirective {
    constructor(el) {
        this.el = el;
        const element = this.el.nativeElement;
        // call lib functions
        Payment.formatCardCVC(element);
        Payment.restrictNumeric(element);
    }
}
CCCvcFormatDirective.decorators = [
    { type: Directive, args: [{
                selector: '[cntMaskCCCvc]',
            },] }
];
CCCvcFormatDirective.ctorParameters = () => [
    { type: ElementRef }
];

class CCExpiryFormatDirective {
    constructor(el) {
        this.el = el;
        const element = this.el.nativeElement;
        // call lib functions
        Payment.formatCardExpiry(element);
        Payment.restrictNumeric(element);
    }
}
CCExpiryFormatDirective.decorators = [
    { type: Directive, args: [{
                selector: '[cntMaskCCExp]',
            },] }
];
CCExpiryFormatDirective.ctorParameters = () => [
    { type: ElementRef }
];

class CCNumberFormatDirective {
    constructor(renderer, el) {
        this.renderer = renderer;
        this.el = el;
        const element = this.el.nativeElement;
        this.cardType = '';
        // call lib functions
        Payment.formatCardNumber(element);
        Payment.restrictNumeric(element);
    }
    onKeypress(e) {
        const element = this.el.nativeElement;
        const elementValue = element.value;
        this.cardType = Payment.fns.cardType(elementValue);
        if (this.cardType && this.cardType !== '') {
            this.renderer.removeClass(element, this.cardType);
        }
        else {
            this.cardType = '';
        }
    }
}
CCNumberFormatDirective.decorators = [
    { type: Directive, args: [{
                selector: '[cntMaskCCNum]',
            },] }
];
CCNumberFormatDirective.ctorParameters = () => [
    { type: Renderer2 },
    { type: ElementRef }
];
CCNumberFormatDirective.propDecorators = {
    onKeypress: [{ type: HostListener, args: ['keypress', ['$event'],] }]
};

class CreditCardValidator {
    /**
     * Validates a cc number
     */
    static validateCardNumber(control) {
        if (control) {
            const isValid = Payment.fns.validateCardNumber(control.value);
            if (!isValid) {
                return {
                    cardNumber: true,
                };
            }
        }
        return null;
    }
    /**
     * Validates the expiry date.
     * Breaks exp by "/" string and assumes that first array entry is month and second year
     * Also removes any spaces
     */
    static validateCardExpiry(control) {
        if (control) {
            const controlValue = control.value.split('/');
            let isValid = false;
            if (controlValue.length > 1) {
                const month = controlValue[0].replace(/^\s+|\s+$/g, '');
                const year = controlValue[1].replace(/^\s+|\s+$/g, '');
                isValid = Payment.fns.validateCardExpiry(month, year);
            }
            if (!isValid) {
                return {
                    cardExpiry: true,
                };
            }
        }
        return null;
    }
    /**
     * Validates cards CVC
     * Also removes any spaces
     */
    static validateCardCvc(control) {
        if (control) {
            const isValid = Payment.fns.validateCardCVC(control.value);
            if (!isValid) {
                return {
                    cardCvc: true,
                };
            }
        }
        return null;
    }
}

const clean = (number) => {
    return number.toString().replace(/[^\d\^\+]/gm, '');
};
const mask = (maxLength = 13) => (rawValue) => {
    // if (clean(rawValue).length <= 12 || maxLength === 12) {
    // 	return ['+', /[1-9]/, ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];
    // }
    return [
        '(',
        /[1-9]/,
        /\d/,
        /\d/,
        ')',
        ' ',
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
    ];
};

class TextMaskConfig {
}
// @dynamic
class PhoneMaskDirective {
    constructor(renderer, elementRef, platformId, compositionMode) {
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.platformId = platformId;
        this.compositionMode = compositionMode;
        this.clean = true;
        this.maxNumberLength = 13;
        /** Whether the user is creating a composition string (IME events). */
        this.composing = false;
        this.onChange = (_) => {
            // implement
        };
        this.onTouched = () => {
            // implement
        };
        if (this.compositionMode == null) {
            this.compositionMode = !this.isAndroid();
        }
    }
    ngOnInit() {
        this.setupMask(true);
        if (this.textMaskInputElement !== undefined) {
            this.textMaskInputElement.update(this.inputElement.value);
        }
    }
    ngOnChanges(changes) {
        this.setupMask(true);
        if (this.textMaskInputElement !== undefined) {
            this.textMaskInputElement.update(this.inputElement.value);
        }
    }
    onBlur() {
        this.onTouched();
    }
    writeValue(value) {
        this.setupMask();
        // set the initial value for cases where the mask is disabled
        const normalizedValue = value == null ? '' : value;
        this.renderer.setProperty(this.inputElement, 'value', normalizedValue);
        if (this.textMaskInputElement !== undefined) {
            this.textMaskInputElement.update(value);
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }
    handleInput(value) {
        if (!this.compositionMode || (this.compositionMode && !this.composing)) {
            this.setupMask();
            if (this.textMaskInputElement !== undefined) {
                this.textMaskInputElement.update(value);
                // get the updated value
                value = this.inputElement.value;
                if (this.clean) {
                    this.onChange(clean(value));
                }
                else {
                    this.onChange(value);
                }
            }
        }
    }
    setupMask(create = false) {
        this.textMaskConfig = {
            mask: mask(this.maxNumberLength),
            guide: false,
            placeholderChar: '_',
            pipe: undefined,
            keepCharPositions: false,
        };
        if (!this.inputElement) {
            if (this.elementRef.nativeElement.tagName.toUpperCase() === 'INPUT') {
                // `textMask` directive is used directly on an input element
                this.inputElement = this.elementRef.nativeElement;
            }
            else {
                // `textMask` directive is used on an abstracted input element, `md-input-container`, etc
                this.inputElement = this.elementRef.nativeElement.getElementsByTagName('INPUT')[0];
            }
        }
        if (this.inputElement && create) {
            this.textMaskInputElement = createTextMaskInputElement(Object.assign({ inputElement: this.inputElement }, this.textMaskConfig));
        }
    }
    compositionStart() {
        this.composing = true;
    }
    compositionEnd(value) {
        this.composing = false;
        // tslint:disable-next-line: no-unused-expression
        this.compositionMode && this.handleInput(value);
    }
    /**
     * We must check whether the agent is Android because composition events
     * behave differently between iOS and Android.
     */
    isAndroid() {
        if (isPlatformBrowser(this.platformId) &&
            window &&
            window.navigator) {
            const userAgent = window.navigator.userAgent;
            return /android (\d+)/.test(userAgent.toLowerCase());
        }
        return false;
    }
}
PhoneMaskDirective.decorators = [
    { type: Directive, args: [{
                selector: '[cntMaskPhone]',
                exportAs: 'cntMaskPhone',
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => PhoneMaskDirective),
                        multi: true,
                    },
                ],
            },] }
];
PhoneMaskDirective.ctorParameters = () => [
    { type: Renderer2 },
    { type: ElementRef },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: Boolean, decorators: [{ type: Optional }, { type: Inject, args: [COMPOSITION_BUFFER_MODE,] }] }
];
PhoneMaskDirective.propDecorators = {
    clean: [{ type: Input }],
    maxNumberLength: [{ type: Input }],
    onBlur: [{ type: HostListener, args: ['blur',] }],
    handleInput: [{ type: HostListener, args: ['input', ['$event.target.value'],] }],
    compositionStart: [{ type: HostListener, args: ['compositionstart',] }],
    compositionEnd: [{ type: HostListener, args: ['compositionend', ['$event.target.value'],] }]
};

class PhoneMaskPipe {
    transform(value) {
        if (!value) {
            return '';
        }
        return conformToMask(value, mask(), { guide: false }).conformedValue;
    }
}
PhoneMaskPipe.decorators = [
    { type: Pipe, args: [{
                name: 'cntMaskPhone',
            },] }
];

class CntMasksModule {
}
CntMasksModule.decorators = [
    { type: NgModule, args: [{
                imports: [TextMaskModule],
                declarations: [
                    CCNumberFormatDirective,
                    CCExpiryFormatDirective,
                    CCCvcFormatDirective,
                    CardExpirationPipe,
                    PhoneMaskDirective,
                    PhoneMaskPipe,
                ],
                exports: [
                    CCNumberFormatDirective,
                    CCExpiryFormatDirective,
                    CCCvcFormatDirective,
                    CardExpirationPipe,
                    PhoneMaskDirective,
                    PhoneMaskPipe,
                ],
            },] }
];

/*
 * Public API Surface of cnt-masks
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CCCvcFormatDirective, CCExpiryFormatDirective, CCNumberFormatDirective, CardExpirationPipe, CntMasksModule, CreditCardValidator, PhoneMaskDirective, PhoneMaskPipe, TextMaskConfig };
//# sourceMappingURL=cnt-masks.js.map
