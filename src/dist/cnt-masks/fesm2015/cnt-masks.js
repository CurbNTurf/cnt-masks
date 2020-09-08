import { Pipe, Directive, ElementRef, Renderer2, HostListener, forwardRef, Optional, Inject, Input, NgModule, PLATFORM_ID } from '@angular/core';
import { NG_VALUE_ACCESSOR, COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { ɵgetDOM } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

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

class CardExpirationPipeMock {
    transform(value) {
        return value;
    }
}
CardExpirationPipeMock.decorators = [
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

class CCCvcFormatDirectiveMock {
}
CCCvcFormatDirectiveMock.decorators = [
    { type: Directive, args: [{
                selector: '[cntMaskCCCvc]',
            },] }
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

class CCExpiryFormatDirectiveMock {
}
CCExpiryFormatDirectiveMock.decorators = [
    { type: Directive, args: [{
                selector: '[cntMaskCCExp]',
            },] }
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

class CCNumberFormatDirectiveMock {
}
CCNumberFormatDirectiveMock.decorators = [
    { type: Directive, args: [{
                selector: '[cntMaskCCNum]',
            },] }
];

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

const defaultArray = [];
const emptyString = '';
function adjustCaretPosition({ previousConformedValue = emptyString, previousPlaceholder = emptyString, currentCaretPosition = 0, conformedValue, rawValue, placeholderChar, placeholder, indexesOfPipedChars = defaultArray, caretTrapIndexes = defaultArray, }) {
    if (currentCaretPosition === 0 || !rawValue.length) {
        return 0;
    }
    // Store lengths for faster performance?
    const rawValueLength = rawValue.length;
    const previousConformedValueLength = previousConformedValue.length;
    const placeholderLength = placeholder.length;
    const conformedValueLength = conformedValue.length;
    // This tells us how long the edit is. If user modified input from `(2__)` to `(243__)`,
    // we know the user in this instance pasted two characters
    const editLength = rawValueLength - previousConformedValueLength;
    // If the edit length is positive, that means the user is adding characters, not deleting.
    const isAddition = editLength > 0;
    // This is the first raw value the user entered that needs to be conformed to mask
    const isFirstRawValue = previousConformedValueLength === 0;
    // A partial multi-character edit happens when the user makes a partial selection in their
    // input and edits that selection. That is going from `(123) 432-4348` to `() 432-4348` by
    // selecting the first 3 digits and pressing backspace.
    //
    // Such cases can also happen when the user presses the backspace while holding down the ALT
    // key.
    const isPartialMultiCharEdit = editLength > 1 && !isAddition && !isFirstRawValue;
    // This algorithm doesn't support all cases of multi-character edits, so we just return
    // the current caret position.
    //
    // This works fine for most cases.
    if (isPartialMultiCharEdit) {
        return currentCaretPosition;
    }
    // For a mask like (111), if the `previousConformedValue` is (1__) and user attempts to enter
    // `f` so the `rawValue` becomes (1f__), the new `conformedValue` would be (1__), which is the
    // same as the original `previousConformedValue`. We handle this case differently for caret
    // positioning.
    const possiblyHasRejectedChar = isAddition &&
        (previousConformedValue === conformedValue ||
            conformedValue === placeholder);
    let startingSearchIndex = 0;
    let trackRightCharacter;
    let targetChar;
    if (possiblyHasRejectedChar) {
        startingSearchIndex = currentCaretPosition - editLength;
    }
    else {
        // At this point in the algorithm, we want to know where the caret is right before the raw input
        // has been conformed, and then see if we can find that same spot in the conformed input.
        //
        // We do that by seeing what character lies immediately before the caret, and then look for that
        // same character in the conformed input and place the caret there.
        // First, we need to normalize the inputs so that letter capitalization between raw input and
        // conformed input wouldn't matter.
        const normalizedConformedValue = conformedValue.toLowerCase();
        const normalizedRawValue = rawValue.toLowerCase();
        // Then we take all characters that come before where the caret currently is.
        const leftHalfChars = normalizedRawValue
            .substr(0, currentCaretPosition)
            .split(emptyString);
        // Now we find all the characters in the left half that exist in the conformed input
        // This step ensures that we don't look for a character that was filtered out or rejected by `conformToMask`.
        const intersection = leftHalfChars.filter((char) => normalizedConformedValue.indexOf(char) !== -1);
        // The last character in the intersection is the character we want to look for in the conformed
        // value and the one we want to adjust the caret close to
        targetChar = intersection[intersection.length - 1];
        // Calculate the number of mask characters in the previous placeholder
        // from the start of the string up to the place where the caret is
        const previousLeftMaskChars = previousPlaceholder
            .substr(0, intersection.length)
            .split(emptyString)
            .filter((char) => char !== placeholderChar).length;
        // Calculate the number of mask characters in the current placeholder
        // from the start of the string up to the place where the caret is
        const leftMaskChars = placeholder
            .substr(0, intersection.length)
            .split(emptyString)
            .filter((char) => char !== placeholderChar).length;
        // Has the number of mask characters up to the caret changed?
        const masklengthChanged = leftMaskChars !== previousLeftMaskChars;
        // Detect if `targetChar` is a mask character and has moved to the left
        const targetIsMaskMovingLeft = previousPlaceholder[intersection.length - 1] !== undefined &&
            placeholder[intersection.length - 2] !== undefined &&
            previousPlaceholder[intersection.length - 1] !== placeholderChar &&
            previousPlaceholder[intersection.length - 1] !==
                placeholder[intersection.length - 1] &&
            previousPlaceholder[intersection.length - 1] ===
                placeholder[intersection.length - 2];
        // If deleting and the `targetChar` `is a mask character and `masklengthChanged` is true
        // or the mask is moving to the left, we can't use the selected `targetChar` any longer
        // if we are not at the end of the string.
        // In this case, change tracking strategy and track the character to the right of the caret.
        if (!isAddition &&
            (masklengthChanged || targetIsMaskMovingLeft) &&
            previousLeftMaskChars > 0 &&
            placeholder.indexOf(targetChar) > -1 &&
            rawValue[currentCaretPosition] !== undefined) {
            trackRightCharacter = true;
            targetChar = rawValue[currentCaretPosition];
        }
        // It is possible that `targetChar` will appear multiple times in the conformed value.
        // We need to know not to select a character that looks like our target character from the placeholder or
        // the piped characters, so we inspect the piped characters and the placeholder to see if they contain
        // characters that match our target character.
        // If the `conformedValue` got piped, we need to know which characters were piped in so that when we look for
        // our `targetChar`, we don't select a piped char by mistake
        const pipedChars = indexesOfPipedChars.map((index) => normalizedConformedValue[index]);
        // We need to know how many times the `targetChar` occurs in the piped characters.
        const countTargetCharInPipedChars = pipedChars.filter((char) => char === targetChar).length;
        // We need to know how many times it occurs in the intersection
        const countTargetCharInIntersection = intersection.filter((char) => char === targetChar).length;
        // We need to know if the placeholder contains characters that look like
        // our `targetChar`, so we don't select one of those by mistake.
        const countTargetCharInPlaceholder = placeholder
            .substr(0, placeholder.indexOf(placeholderChar))
            .split(emptyString)
            .filter((char, index) => 
        // Check if `char` is the same as our `targetChar`, so we account for it
        char === targetChar &&
            // but also make sure that both the `rawValue` and placeholder don't have the same character at the same
            // index because if they are equal, that means we are already counting those characters in
            // `countTargetCharInIntersection`
            rawValue[index] !== char).length;
        // The number of times we need to see occurrences of the `targetChar` before we know it is the one we're looking
        // for is:
        const requiredNumberOfMatches = countTargetCharInPlaceholder +
            countTargetCharInIntersection +
            countTargetCharInPipedChars +
            // The character to the right of the caret isn't included in `intersection`
            // so add one if we are tracking the character to the right
            (trackRightCharacter ? 1 : 0);
        // Now we start looking for the location of the `targetChar`.
        // We keep looping forward and store the index in every iteration. Once we have encountered
        // enough occurrences of the target character, we break out of the loop
        // If are searching for the second `1` in `1214`, `startingSearchIndex` will point at `4`.
        let numberOfEncounteredMatches = 0;
        for (let i = 0; i < conformedValueLength; i++) {
            const conformedValueChar = normalizedConformedValue[i];
            startingSearchIndex = i + 1;
            if (conformedValueChar === targetChar) {
                numberOfEncounteredMatches++;
            }
            if (numberOfEncounteredMatches >= requiredNumberOfMatches) {
                break;
            }
        }
    }
    // At this point, if we simply return `startingSearchIndex` as the adjusted caret position,
    // most cases would be handled. However, we want to fast forward or rewind the caret to the
    // closest placeholder character if it happens to be in a non-editable spot. That's what the next
    // logic is for.
    // In case of addition, we fast forward.
    if (isAddition) {
        // We want to remember the last placeholder character encountered so that if the mask
        // contains more characters after the last placeholder character, we don't forward the caret
        // that far to the right. Instead, we stop it at the last encountered placeholder character.
        let lastPlaceholderChar = startingSearchIndex;
        for (let i = startingSearchIndex; i <= placeholderLength; i++) {
            if (placeholder[i] === placeholderChar) {
                lastPlaceholderChar = i;
            }
            if (
            // If we're adding, we can position the caret at the next placeholder character.
            placeholder[i] === placeholderChar ||
                // If a caret trap was set by a mask function, we need to stop at the trap.
                caretTrapIndexes.indexOf(i) !== -1 ||
                // This is the end of the placeholder. We cannot move any further. Let's put the caret there.
                i === placeholderLength) {
                return lastPlaceholderChar;
            }
        }
    }
    else {
        // In case of deletion, we rewind.
        if (trackRightCharacter) {
            // Searching for the character that was to the right of the caret
            // We start at `startingSearchIndex` - 1 because it includes one character extra to the right
            for (let i = startingSearchIndex - 1; i >= 0; i--) {
                // If tracking the character to the right of the cursor, we move to the left until
                // we found the character and then place the caret right before it
                if (
                // `targetChar` should be in `conformedValue`, since it was in `rawValue`, just
                // to the right of the caret
                conformedValue[i] === targetChar ||
                    // If a caret trap was set by a mask function, we need to stop at the trap.
                    caretTrapIndexes.indexOf(i) !== -1 ||
                    // This is the beginning of the placeholder. We cannot move any further.
                    // Let's put the caret there.
                    i === 0) {
                    return i;
                }
            }
        }
        else {
            // Searching for the first placeholder or caret trap to the left
            for (let i = startingSearchIndex; i >= 0; i--) {
                // If we're deleting, we stop the caret right before the placeholder character.
                // For example, for mask `(111) 11`, current conformed input `(456) 86`. If user
                // modifies input to `(456 86`. That is, they deleted the `)`, we place the caret
                // right after the first `6`
                if (
                // If we're deleting, we can position the caret right before the placeholder character
                placeholder[i - 1] === placeholderChar ||
                    // If a caret trap was set by a mask function, we need to stop at the trap.
                    caretTrapIndexes.indexOf(i) !== -1 ||
                    // This is the beginning of the placeholder. We cannot move any further.
                    // Let's put the caret there.
                    i === 0) {
                    return i;
                }
            }
        }
    }
}

const defaultPlaceholderChar = '_';
const emptyArray = [];
const emptyString$1 = '';
function convertMaskToPlaceholder(mask = emptyArray, placeholderChar = defaultPlaceholderChar) {
    if (!Array.isArray(mask)) {
        throw new Error('Text-mask:convertMaskToPlaceholder; The mask property must be an array.');
    }
    if (mask.indexOf(placeholderChar) !== -1) {
        throw new Error('Placeholder character must not be used as part of the mask. Please specify a character ' +
            'that is not present in your mask as your placeholder character.\n\n' +
            `The placeholder character that was received is: ${JSON.stringify(placeholderChar)}\n\n` +
            `The mask that was received is: ${JSON.stringify(mask)}`);
    }
    return mask
        .map((char) => {
        return char instanceof RegExp ? placeholderChar : char;
    })
        .join('');
}
const strCaretTrap = '[]';
function processCaretTraps(mask) {
    const indexes = [];
    let indexOfCaretTrap;
    while (
    // tslint:disable-next-line: no-conditional-assignment
    ((indexOfCaretTrap = mask.indexOf(strCaretTrap)), indexOfCaretTrap !== -1)) {
        // eslint-disable-line
        indexes.push(indexOfCaretTrap);
        mask.splice(indexOfCaretTrap, 1);
    }
    return { maskWithoutCaretTraps: mask, indexes };
}
function conformToMask(rawValue = emptyString$1, mask = emptyArray, config = {}) {
    if (!Array.isArray(mask)) {
        // If someone passes a function as the mask property, we should call the
        // function to get the mask array - Normally this is handled by the
        // `createTextMaskInputElement:update` function - this allows mask functions
        // to be used directly with `conformToMask`
        if (typeof mask === 'function') {
            // call the mask function to get the mask array
            mask = mask(rawValue, config);
            // mask functions can setup caret traps to have some control over how the caret moves. We need to process
            // the mask for any caret traps. `processCaretTraps` will remove the caret traps from the mask
            mask = processCaretTraps(mask).maskWithoutCaretTraps;
        }
        else {
            throw new Error('Text-mask:conformToMask; The mask property must be an array.');
        }
    }
    // These configurations tell us how to conform the mask
    const { guide = true, previousConformedValue = emptyString$1, placeholderChar = defaultPlaceholderChar, placeholder = convertMaskToPlaceholder(mask, placeholderChar), currentCaretPosition, keepCharPositions, } = config;
    // The configs below indicate that the user wants the algorithm to work in *no guide* mode
    const suppressGuide = guide === false && previousConformedValue !== undefined;
    // Calculate lengths once for performance
    const rawValueLength = rawValue.length;
    const previousConformedValueLength = previousConformedValue.length;
    const placeholderLength = placeholder.length;
    const maskLength = mask.length;
    // This tells us the number of edited characters and the direction in which they were edited (+/-)
    const editDistance = rawValueLength - previousConformedValueLength;
    // In *no guide* mode, we need to know if the user is trying to add a character or not
    const isAddition = editDistance > 0;
    // Tells us the index of the first change. For (438) 394-4938 to (38) 394-4938, that would be 1
    const indexOfFirstChange = currentCaretPosition + (isAddition ? -editDistance : 0);
    // We're also gonna need the index of last change, which we can derive as follows...
    const indexOfLastChange = indexOfFirstChange + Math.abs(editDistance);
    // If `conformToMask` is configured to keep character positions, that is, for mask 111, previous value
    // _2_ and raw value 3_2_, the new conformed value should be 32_, not 3_2 (default behavior). That's in the case of
    // addition. And in the case of deletion, previous value _23, raw value _3, the new conformed string should be
    // __3, not _3_ (default behavior)
    //
    // The next block of logic handles keeping character positions for the case of deletion. (Keeping
    // character positions for the case of addition is further down since it is handled differently.)
    // To do this, we want to compensate for all characters that were deleted
    if (keepCharPositions === true && !isAddition) {
        // We will be storing the new placeholder characters in this variable.
        let compensatingPlaceholderChars = emptyString$1;
        // For every character that was deleted from a placeholder position, we add a placeholder char
        for (let i = indexOfFirstChange; i < indexOfLastChange; i++) {
            if (placeholder[i] === placeholderChar) {
                compensatingPlaceholderChars += placeholderChar;
            }
        }
        // Now we trick our algorithm by modifying the raw value to make it contain additional placeholder characters
        // That way when the we start laying the characters again on the mask, it will keep the non-deleted characters
        // in their positions.
        rawValue =
            rawValue.slice(0, indexOfFirstChange) +
                compensatingPlaceholderChars +
                rawValue.slice(indexOfFirstChange, rawValueLength);
    }
    // Convert `rawValue` string to an array, and mark characters based on whether they are newly added or have
    // existed in the previous conformed value. Identifying new and old characters is needed for `conformToMask`
    // to work if it is configured to keep character positions.
    const rawValueArr = rawValue.split(emptyString$1).map((char, i) => ({
        char,
        isNew: i >= indexOfFirstChange && i < indexOfLastChange,
    }));
    // The loop below removes masking characters from user input. For example, for mask
    // `00 (111)`, the placeholder would be `00 (___)`. If user input is `00 (234)`, the loop below
    // would remove all characters but `234` from the `rawValueArr`. The rest of the algorithm
    // then would lay `234` on top of the available placeholder positions in the mask.
    for (let i = rawValueLength - 1; i >= 0; i--) {
        const { char } = rawValueArr[i];
        if (char !== placeholderChar) {
            const shouldOffset = i >= indexOfFirstChange && previousConformedValueLength === maskLength;
            if (char === placeholder[shouldOffset ? i - editDistance : i]) {
                rawValueArr.splice(i, 1);
            }
        }
    }
    // This is the variable that we will be filling with characters as we figure them out
    // in the algorithm below
    let conformedValue = emptyString$1;
    let someCharsRejected = false;
    // Ok, so first we loop through the placeholder looking for placeholder characters to fill up.
    placeholderLoop: for (let i = 0; i < placeholderLength; i++) {
        const charInPlaceholder = placeholder[i];
        // We see one. Let's find out what we can put in it.
        if (charInPlaceholder === placeholderChar) {
            // But before that, do we actually have any user characters that need a place?
            if (rawValueArr.length > 0) {
                // We will keep chipping away at user input until either we run out of characters
                // or we find at least one character that we can map.
                while (rawValueArr.length > 0) {
                    // Let's retrieve the first user character in the queue of characters we have left
                    const { char: rawValueChar, isNew } = rawValueArr.shift();
                    // If the character we got from the user input is a placeholder character (which happens
                    // regularly because user input could be something like (540) 90_-____, which includes
                    // a bunch of `_` which are placeholder characters) and we are not in *no guide* mode,
                    // then we map this placeholder character to the current spot in the placeholder
                    if (rawValueChar === placeholderChar && suppressGuide !== true) {
                        conformedValue += placeholderChar;
                        // And we go to find the next placeholder character that needs filling
                        continue placeholderLoop;
                        // Else if, the character we got from the user input is not a placeholder, let's see
                        // if the current position in the mask can accept it.
                    }
                    else if (mask[i].test(rawValueChar)) {
                        // we map the character differently based on whether we are keeping character positions or not.
                        // If any of the conditions below are met, we simply map the raw value character to the
                        // placeholder position.
                        if (keepCharPositions !== true ||
                            isNew === false ||
                            previousConformedValue === emptyString$1 ||
                            guide === false ||
                            !isAddition) {
                            conformedValue += rawValueChar;
                        }
                        else {
                            // We enter this block of code if we are trying to keep character positions and none of the conditions
                            // above is met. In this case, we need to see if there's an available spot for the raw value character
                            // to be mapped to. If we couldn't find a spot, we will discard the character.
                            //
                            // For example, for mask `1111`, previous conformed value `_2__`, raw value `942_2__`. We can map the
                            // `9`, to the first available placeholder position, but then, there are no more spots available for the
                            // `4` and `2`. So, we discard them and end up with a conformed value of `92__`.
                            const rawValueArrLength = rawValueArr.length;
                            let indexOfNextAvailablePlaceholderChar = null;
                            // Let's loop through the remaining raw value characters. We are looking for either a suitable spot, ie,
                            // a placeholder character or a non-suitable spot, ie, a non-placeholder character that is not new.
                            // If we see a suitable spot first, we store its position and exit the loop. If we see a non-suitable
                            // spot first, we exit the loop and our `indexOfNextAvailablePlaceholderChar` will stay as `null`.
                            for (let j = 0; j < rawValueArrLength; j++) {
                                const charData = rawValueArr[j];
                                if (charData.char !== placeholderChar &&
                                    charData.isNew === false) {
                                    break;
                                }
                                if (charData.char === placeholderChar) {
                                    indexOfNextAvailablePlaceholderChar = j;
                                    break;
                                }
                            }
                            // If `indexOfNextAvailablePlaceholderChar` is not `null`, that means the character is not blocked.
                            // We can map it. And to keep the character positions, we remove the placeholder character
                            // from the remaining characters
                            if (indexOfNextAvailablePlaceholderChar !== null) {
                                conformedValue += rawValueChar;
                                rawValueArr.splice(indexOfNextAvailablePlaceholderChar, 1);
                                // If `indexOfNextAvailablePlaceholderChar` is `null`, that means the character is blocked. We have to
                                // discard it.
                            }
                            else {
                                i--;
                            }
                        }
                        // Since we've mapped this placeholder position. We move on to the next one.
                        continue placeholderLoop;
                    }
                    else {
                        someCharsRejected = true;
                    }
                }
            }
            // We reach this point when we've mapped all the user input characters to placeholder
            // positions in the mask. In *guide* mode, we append the left over characters in the
            // placeholder to the `conformedString`, but in *no guide* mode, we don't wanna do that.
            //
            // That is, for mask `(111)` and user input `2`, we want to return `(2`, not `(2__)`.
            if (suppressGuide === false) {
                conformedValue += placeholder.substr(i, placeholderLength);
            }
            // And we break
            break;
            // Else, the charInPlaceholder is not a placeholderChar. That is, we cannot fill it
            // with user input. So we just map it to the final output
        }
        else {
            conformedValue += charInPlaceholder;
        }
    }
    // The following logic is needed to deal with the case of deletion in *no guide* mode.
    //
    // Consider the silly mask `(111) /// 1`. What if user tries to delete the last placeholder
    // position? Something like `(589) /// `. We want to conform that to `(589`. Not `(589) /// `.
    // That's why the logic below finds the last filled placeholder character, and removes everything
    // from that point on.
    if (suppressGuide && isAddition === false) {
        let indexOfLastFilledPlaceholderChar = null;
        // Find the last filled placeholder position and substring from there
        for (let i = 0; i < conformedValue.length; i++) {
            if (placeholder[i] === placeholderChar) {
                indexOfLastFilledPlaceholderChar = i;
            }
        }
        if (indexOfLastFilledPlaceholderChar !== null) {
            // We substring from the beginning until the position after the last filled placeholder char.
            conformedValue = conformedValue.substr(0, indexOfLastFilledPlaceholderChar + 1);
        }
        else {
            // If we couldn't find `indexOfLastFilledPlaceholderChar` that means the user deleted
            // the first character in the mask. So we return an empty string.
            conformedValue = emptyString$1;
        }
    }
    return { conformedValue, meta: { someCharsRejected } };
}

const emptyArray$1 = [];
const emptyString$2 = '';
const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
const defer = typeof requestAnimationFrame !== 'undefined'
    ? requestAnimationFrame
    : setTimeout;
function isString(value) {
    return typeof value === 'string' || value instanceof String;
}
function isNumber(value) {
    return (typeof value === 'number' &&
        value.length === undefined &&
        !isNaN(value));
}
function convertMaskToPlaceholder$1(mask = emptyArray$1, placeholderChar = defaultPlaceholderChar) {
    if (!Array.isArray(mask)) {
        throw new Error('Text-mask:convertMaskToPlaceholder; The mask property must be an array.');
    }
    if (mask.indexOf(placeholderChar) !== -1) {
        throw new Error('Placeholder character must not be used as part of the mask. Please specify a character ' +
            'that is not present in your mask as your placeholder character.\n\n' +
            `The placeholder character that was received is: ${JSON.stringify(placeholderChar)}\n\n` +
            `The mask that was received is: ${JSON.stringify(mask)}`);
    }
    return mask
        .map((char) => {
        return char instanceof RegExp ? placeholderChar : char;
    })
        .join('');
}
function createTextMaskInputElement(config) {
    // Anything that we will need to keep between `update` calls, we will store in this `state` object.
    const state = {
        previousConformedValue: undefined,
        previousPlaceholder: undefined,
    };
    return {
        state,
        // `update` is called by framework components whenever they want to update the `value` of the input element.
        // The caller can send a `rawValue` to be conformed and set on the input element. However, the default use-case
        // is for this to be read from the `inputElement` directly.
        update(rawValue, { inputElement, mask: providedMask, guide, pipe, placeholderChar = defaultPlaceholderChar, keepCharPositions = false, showMask = false, } = config) {
            // if `rawValue` is `undefined`, read from the `inputElement`
            if (typeof rawValue === 'undefined') {
                rawValue = inputElement.value;
            }
            // If `rawValue` equals `state.previousConformedValue`, we don't need to change anything. So, we return.
            // This check is here to handle controlled framework components that repeat the `update` call on every render.
            if (rawValue === state.previousConformedValue) {
                return;
            }
            // Text Mask accepts masks that are a combination of a `mask` and a `pipe` that work together. If such a `mask` is
            // passed, we de-structure it below, so the rest of the code can work normally as if a separate `mask` and a `pipe`
            // were passed.
            if (typeof providedMask === 'object' &&
                providedMask.pipe !== undefined &&
                providedMask.mask !== undefined) {
                pipe = providedMask.pipe;
                providedMask = providedMask.mask;
            }
            // The `placeholder` is an essential piece of how Text Mask works. For a mask like `(111)`, the placeholder would
            // be `(___)` if the `placeholderChar` is set to `_`.
            let placeholder;
            // We don't know what the mask would be yet. If it is an array, we take it as is, but if it's a function, we will
            // have to call that function to get the mask array.
            let mask;
            // If the provided mask is an array, we can call `convertMaskToPlaceholder` here once and we'll always have the
            // correct `placeholder`.
            if (providedMask instanceof Array) {
                placeholder = convertMaskToPlaceholder$1(providedMask, placeholderChar);
            }
            // In framework components that support reactivity, it's possible to turn off masking by passing
            // `false` for `mask` after initialization. See https://github.com/text-mask/text-mask/pull/359
            if (providedMask === false) {
                return;
            }
            // We check the provided `rawValue` before moving further.
            // If it's something we can't work with `getSafeRawValue` will throw.
            const safeRawValue = getSafeRawValue(rawValue);
            // `selectionEnd` indicates to us where the caret position is after the user has typed into the input
            const { selectionEnd: currentCaretPosition } = inputElement;
            // We need to know what the `previousConformedValue` and `previousPlaceholder` is from the previous `update` call
            const { previousConformedValue, previousPlaceholder } = state;
            let caretTrapIndexes;
            // If the `providedMask` is a function. We need to call it at every `update` to get the `mask` array.
            // Then we also need to get the `placeholder`
            if (typeof providedMask === 'function') {
                mask = providedMask(safeRawValue, {
                    currentCaretPosition,
                    previousConformedValue,
                    placeholderChar,
                });
                // disable masking if `mask` is `false`
                if (mask === false) {
                    return;
                }
                // mask functions can setup caret traps to have some control over how the caret moves. We need to process
                // the mask for any caret traps. `processCaretTraps` will remove the caret traps from the mask and return
                // the indexes of the caret traps.
                const { maskWithoutCaretTraps, indexes } = processCaretTraps(mask);
                mask = maskWithoutCaretTraps; // The processed mask is what we're interested in
                caretTrapIndexes = indexes; // And we need to store these indexes because they're needed by `adjustCaretPosition`
                placeholder = convertMaskToPlaceholder$1(mask, placeholderChar);
                // If the `providedMask` is not a function, we just use it as-is.
            }
            else {
                mask = providedMask;
            }
            // The following object will be passed to `conformToMask` to determine how the `rawValue` will be conformed
            const conformToMaskConfig = {
                previousConformedValue,
                guide,
                placeholderChar,
                pipe,
                placeholder,
                currentCaretPosition,
                keepCharPositions,
            };
            // `conformToMask` returns `conformedValue` as part of an object for future API flexibility
            const { conformedValue } = conformToMask(safeRawValue, mask, conformToMaskConfig);
            // The following few lines are to support the `pipe` feature.
            const piped = typeof pipe === 'function';
            let pipeResults = {};
            // If `pipe` is a function, we call it.
            if (piped) {
                // `pipe` receives the `conformedValue` and the configurations with which `conformToMask` was called.
                pipeResults = pipe(conformedValue, Object.assign({ rawValue: safeRawValue }, conformToMaskConfig));
                // `pipeResults` should be an object. But as a convenience, we allow the pipe author to just return `false` to
                // indicate rejection. Or return just a string when there are no piped characters.
                // If the `pipe` returns `false` or a string, the block below turns it into an object that the rest
                // of the code can work with.
                if (pipeResults === false) {
                    // If the `pipe` rejects `conformedValue`, we use the `previousConformedValue`, and set `rejected` to `true`.
                    pipeResults = { value: previousConformedValue, rejected: true };
                }
                else if (isString(pipeResults)) {
                    pipeResults = { value: pipeResults };
                }
            }
            // Before we proceed, we need to know which conformed value to use, the one returned by the pipe or the one
            // returned by `conformToMask`.
            const finalConformedValue = piped
                ? pipeResults.value
                : conformedValue;
            // After determining the conformed value, we will need to know where to set
            // the caret position. `adjustCaretPosition` will tell us.
            const adjustedCaretPosition = adjustCaretPosition({
                previousConformedValue,
                previousPlaceholder,
                conformedValue: finalConformedValue,
                placeholder,
                rawValue: safeRawValue,
                currentCaretPosition,
                placeholderChar,
                indexesOfPipedChars: pipeResults.indexesOfPipedChars,
                caretTrapIndexes,
            });
            // Text Mask sets the input value to an empty string when the condition below is set. It provides a better UX.
            const inputValueShouldBeEmpty = finalConformedValue === placeholder && adjustedCaretPosition === 0;
            const emptyValue = showMask ? placeholder : emptyString$2;
            const inputElementValue = inputValueShouldBeEmpty
                ? emptyValue
                : finalConformedValue;
            state.previousConformedValue = inputElementValue; // store value for access for next time
            state.previousPlaceholder = placeholder;
            // In some cases, this `update` method will be repeatedly called with a raw value that has already been conformed
            // and set to `inputElement.value`. The below check guards against needlessly readjusting the input state.
            // See https://github.com/text-mask/text-mask/issues/231
            if (inputElement.value === inputElementValue) {
                return;
            }
            inputElement.value = inputElementValue; // set the input value
            safeSetSelection(inputElement, adjustedCaretPosition); // adjust caret position
        },
    };
}
function safeSetSelection(element, selectionPosition) {
    if (document.activeElement === element) {
        if (isAndroid) {
            defer(() => element.setSelectionRange(selectionPosition, selectionPosition, 'none'), 0);
        }
        else {
            element.setSelectionRange(selectionPosition, selectionPosition, 'none');
        }
    }
}
function getSafeRawValue(inputValue) {
    if (isString(inputValue)) {
        return inputValue;
    }
    else if (isNumber(inputValue)) {
        return String(inputValue);
    }
    else if (inputValue === undefined || inputValue === null) {
        return emptyString$2;
    }
    else {
        throw new Error("The 'value' provided to Text Mask needs to be a string or a number. The value " +
            `received was:\n\n ${JSON.stringify(inputValue)}`);
    }
}

class TextMaskConfig {
}
const MASKEDINPUT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MaskedInputDirective),
    multi: true,
};
/**
 * We must check whether the agent is Android because composition events
 * behave differently between iOS and Android.
 */
function _isAndroid() {
    const userAgent = ɵgetDOM() ? ɵgetDOM().getUserAgent() : '';
    return /android (\d+)/.test(userAgent.toLowerCase());
}
class MaskedInputDirective {
    constructor(_renderer, _elementRef, _compositionMode) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._compositionMode = _compositionMode;
        this.textMaskConfig = {
            mask: [],
            guide: true,
            placeholderChar: '_',
            pipe: undefined,
            keepCharPositions: false,
        };
        /** Whether the user is creating a composition string (IME events). */
        this._composing = false;
        this.onChange = (_) => {
            // noop
        };
        this.onTouched = () => {
            // noop
        };
        if (this._compositionMode == null) {
            this._compositionMode = !_isAndroid();
        }
    }
    ngOnChanges(changes) {
        this._setupMask(true);
        if (this.textMaskInputElement !== undefined) {
            this.textMaskInputElement.update(this.inputElement.value);
        }
    }
    writeValue(value) {
        this._setupMask();
        // set the initial value for cases where the mask is disabled
        const normalizedValue = value == null ? '' : value;
        this._renderer.setProperty(this.inputElement, 'value', normalizedValue);
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
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
    _handleInput(value) {
        if (!this._compositionMode || (this._compositionMode && !this._composing)) {
            this._setupMask();
            if (this.textMaskInputElement !== undefined) {
                this.textMaskInputElement.update(value);
                // get the updated value
                value = this.inputElement.value;
                this.onChange(value);
            }
        }
    }
    _setupMask(create = false) {
        if (!this.inputElement) {
            if (this._elementRef.nativeElement.tagName.toUpperCase() === 'INPUT') {
                // `textMask` directive is used directly on an input element
                this.inputElement = this._elementRef.nativeElement;
            }
            else {
                // `textMask` directive is used on an abstracted input element, `md-input-container`, etc
                this.inputElement = this._elementRef.nativeElement.getElementsByTagName('INPUT')[0];
            }
        }
        if (this.inputElement && create) {
            this.textMaskInputElement = createTextMaskInputElement(Object.assign({ inputElement: this.inputElement }, this.textMaskConfig));
        }
    }
    _compositionStart() {
        this._composing = true;
    }
    _compositionEnd(value) {
        this._composing = false;
        if (this._compositionMode) {
            this._handleInput(value);
        }
    }
}
MaskedInputDirective.decorators = [
    { type: Directive, args: [{
                host: {
                    '(input)': '_handleInput($event.target.value)',
                    '(blur)': 'onTouched()',
                    '(compositionstart)': '_compositionStart()',
                    '(compositionend)': '_compositionEnd($event.target.value)',
                },
                selector: '[textMask]',
                exportAs: 'textMask',
                providers: [MASKEDINPUT_VALUE_ACCESSOR],
            },] }
];
MaskedInputDirective.ctorParameters = () => [
    { type: Renderer2 },
    { type: ElementRef },
    { type: Boolean, decorators: [{ type: Optional }, { type: Inject, args: [COMPOSITION_BUFFER_MODE,] }] }
];
MaskedInputDirective.propDecorators = {
    textMaskConfig: [{ type: Input, args: ['textMask',] }]
};
class TextMaskModule {
}
TextMaskModule.decorators = [
    { type: NgModule, args: [{
                declarations: [MaskedInputDirective],
                exports: [MaskedInputDirective],
            },] }
];

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

class TextMaskConfig$1 {
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
                exportAs: 'cntMaskPhone',
                providers: [
                    {
                        multi: true,
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => PhoneMaskDirective),
                    },
                ],
                selector: '[cntMaskPhone]',
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
                providers: [CardExpirationPipe, PhoneMaskPipe],
            },] }
];

// @dynamic
class PhoneMaskDirectiveMock {
}
PhoneMaskDirectiveMock.decorators = [
    { type: Directive, args: [{
                exportAs: 'cntMaskPhone',
                providers: [
                    {
                        multi: true,
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => PhoneMaskDirectiveMock),
                    },
                ],
                selector: '[cntMaskPhone]',
            },] }
];

class PhoneMaskPipeMock {
    transform(value) {
        return value;
    }
}
PhoneMaskPipeMock.decorators = [
    { type: Pipe, args: [{
                name: 'cntMaskPhone',
            },] }
];

/*
 * Public API Surface of cnt-masks
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CCCvcFormatDirective, CCCvcFormatDirectiveMock, CCExpiryFormatDirective, CCExpiryFormatDirectiveMock, CCNumberFormatDirective, CCNumberFormatDirectiveMock, CardExpirationPipe, CardExpirationPipeMock, CntMasksModule, CreditCardValidator, PhoneMaskDirective, PhoneMaskDirectiveMock, PhoneMaskPipe, PhoneMaskPipeMock, TextMaskConfig$1 as TextMaskConfig, MASKEDINPUT_VALUE_ACCESSOR as ɵa, MaskedInputDirective as ɵb, TextMaskModule as ɵc };
//# sourceMappingURL=cnt-masks.js.map
