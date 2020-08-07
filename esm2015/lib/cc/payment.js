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
export class Payment {
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
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NudC1tYXNrcy9zcmMvbGliL2NjL3BheW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBK0JBLElBQUksS0FBb0IsQ0FBQztBQUN6QixJQUFJLGFBQWEsQ0FBQztXQUloQixVQUF1QixJQUFTO0lBQzlCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDM0MsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDakMsT0FBTyxDQUFDLENBQUM7U0FDVjtLQUNGO0lBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNaLENBQUM7QUFUSCxNQUFNLE9BQU8sR0FDWCxFQUFFLENBQUMsT0FBTyxNQVFULENBQUM7QUFFSixhQUFhLEdBQUcsWUFBWSxDQUFDO0FBRTdCLEtBQUssR0FBRztJQUNOO1FBQ0UsSUFBSSxFQUFFLE1BQU07UUFDWixPQUFPLEVBQUUsUUFBUTtRQUNqQixNQUFNLEVBQUUsK0JBQStCO1FBQ3ZDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNaLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNkLElBQUksRUFBRSxJQUFJO0tBQ1g7SUFDRDtRQUNFLElBQUksRUFBRSxTQUFTO1FBQ2YsT0FBTyxFQUFFLE9BQU87UUFDaEIsTUFBTSxFQUFFLGFBQWE7UUFDckIsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ1osU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxFQUFFLElBQUk7S0FDWDtJQUNEO1FBQ0UsSUFBSSxFQUFFLFdBQVc7UUFDakIsT0FBTyxFQUFFLHVEQUF1RDtRQUNoRSxNQUFNLEVBQUUsYUFBYTtRQUNy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LEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUN6QixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxTQUFTLENBQUM7SUFFeEQsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ3RFLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRTVELE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRS9CLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUMxQixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxFQUFFO2dCQUMzQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUNwQztTQUNGO2FBQU07WUFDTCxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUN2QztRQUNELE9BQU8sT0FBTyxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUN0RDtJQUVELE9BQU87QUFDVCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgSmVzc2UgUG9sbGFrXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXG4gKiBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbiAqIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuICogd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuICogZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cbiAqIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuICogaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuICogTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbiAqIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbiAqIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuICogV0lUSCBUSFxuICovXG5pbnRlcmZhY2UgSUNhcmRPYmplY3Qge1xuICB0eXBlOiBzdHJpbmc7XG4gIHBhdHRlcm46IFJlZ0V4cDtcbiAgZm9ybWF0OiBSZWdFeHA7XG4gIGxlbmd0aDogbnVtYmVyW107XG4gIGN2Y0xlbmd0aDogbnVtYmVyW107XG4gIGx1aG46IGJvb2xlYW47XG59XG5cbmxldCBjYXJkczogSUNhcmRPYmplY3RbXTtcbmxldCBkZWZhdWx0Rm9ybWF0O1xuXG5jb25zdCBpbmRleE9mID1cbiAgW10uaW5kZXhPZiB8fFxuICBmdW5jdGlvbiAodGhpczogYW55W10sIGl0ZW06IGFueSk6IG51bWJlciB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbmRlZmF1bHRGb3JtYXQgPSAvKFxcZHsxLDR9KS9nO1xuXG5jYXJkcyA9IFtcbiAge1xuICAgIHR5cGU6ICdhbWV4JyxcbiAgICBwYXR0ZXJuOiAvXjNbNDddLyxcbiAgICBmb3JtYXQ6IC8oXFxkezEsNH0pKFxcZHsxLDZ9KT8oXFxkezEsNX0pPy8sXG4gICAgbGVuZ3RoOiBbMTVdLFxuICAgIGN2Y0xlbmd0aDogWzRdLFxuICAgIGx1aG46IHRydWUsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnZGFua29ydCcsXG4gICAgcGF0dGVybjogL141MDE5LyxcbiAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgbGVuZ3RoOiBbMTZdLFxuICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgIGx1aG46IHRydWUsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnaGlwZXJjYXJkJyxcbiAgICBwYXR0ZXJuOiAvXigzODQxMDB8Mzg0MTQwfDM4NDE2MHw2MDYyODJ8NjM3MDk1fDYzNzU2OHw2MCg/ITExKSkvLFxuICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICBsZW5ndGg6IFsxNCwgMTUsIDE2LCAxNywgMTgsIDE5XSxcbiAgICBjdmNMZW5ndGg6IFszXSxcbiAgICBsdWhuOiB0cnVlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ2RpbmVyc2NsdWInLFxuICAgIHBhdHRlcm46IC9eKDM2fDM4fDMwWzAtNV0pLyxcbiAgICBmb3JtYXQ6IC8oXFxkezEsNH0pKFxcZHsxLDZ9KT8oXFxkezEsNH0pPy8sXG4gICAgbGVuZ3RoOiBbMTRdLFxuICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgIGx1aG46IHRydWUsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnZGlzY292ZXInLFxuICAgIHBhdHRlcm46IC9eKDYwMTF8NjV8NjRbNC05XXw2MjIpLyxcbiAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgbGVuZ3RoOiBbMTZdLFxuICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgIGx1aG46IHRydWUsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnamNiJyxcbiAgICBwYXR0ZXJuOiAvXjM1LyxcbiAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgbGVuZ3RoOiBbMTZdLFxuICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgIGx1aG46IHRydWUsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnbGFzZXInLFxuICAgIHBhdHRlcm46IC9eKDY3MDZ8Njc3MXw2NzA5KS8sXG4gICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgIGxlbmd0aDogWzE2LCAxNywgMTgsIDE5XSxcbiAgICBjdmNMZW5ndGg6IFszXSxcbiAgICBsdWhuOiB0cnVlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ21hZXN0cm8nLFxuICAgIHBhdHRlcm46IC9eKDUwMTh8NTAyMHw1MDM4fDYzMDR8NjcwM3w2NzA4fDY3NTl8Njc2WzEtM10pLyxcbiAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgbGVuZ3RoOiBbMTIsIDEzLCAxNCwgMTUsIDE2LCAxNywgMTgsIDE5XSxcbiAgICBjdmNMZW5ndGg6IFszXSxcbiAgICBsdWhuOiB0cnVlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ21hc3RlcmNhcmQnLFxuICAgIHBhdHRlcm46IC9eKDVbMS01XXw2NzcxODkpfF4oMjIyWzEtOV18MlszLTZdXFxkezJ9fDI3WzAtMV1cXGR8MjcyMCkvLFxuICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICBsZW5ndGg6IFsxNl0sXG4gICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgbHVobjogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICd1bmlvbnBheScsXG4gICAgcGF0dGVybjogL142Mi8sXG4gICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgIGxlbmd0aDogWzE2LCAxNywgMTgsIDE5XSxcbiAgICBjdmNMZW5ndGg6IFszXSxcbiAgICBsdWhuOiBmYWxzZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICd2aXNhZWxlY3Ryb24nLFxuICAgIHBhdHRlcm46IC9eNCgwMjZ8MTc1MDB8NDA1fDUwOHw4NDR8OTFbMzddKS8sXG4gICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgIGxlbmd0aDogWzE2XSxcbiAgICBjdmNMZW5ndGg6IFszXSxcbiAgICBsdWhuOiB0cnVlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ2VsbycsXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgIHBhdHRlcm46IC9eKDQwMTEoNzh8NzkpfDQzKDEyNzR8ODkzNSl8NDUoMTQxNnw3MzkzfDc2MygxfDIpKXw1MCg0MTc1fDY2OTl8NjdbMC03XVswLTldfDkwMDApfDYyNzc4MHw2Myg2Mjk3fDYzNjgpfDY1MCgwMyhbXjRdKXwwNChbMC05XSl8MDUoMHwxKXw0KDBbNS05XXwzWzAtOV18OFs1LTldfDlbMC05XSl8NShbMC0yXVswLTldfDNbMC04XSl8OShbMi02XVswLTldfDdbMC04XSl8NTQxfDcwMHw3MjB8OTAxKXw2NTE2NTJ8NjU1MDAwfDY1NTAyMSkvLFxuICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICBsZW5ndGg6IFsxNl0sXG4gICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgbHVobjogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICd2aXNhJyxcbiAgICBwYXR0ZXJuOiAvXjQvLFxuICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICBsZW5ndGg6IFsxMywgMTYsIDE5XSxcbiAgICBjdmNMZW5ndGg6IFszXSxcbiAgICBsdWhuOiB0cnVlLFxuICB9LFxuXTtcblxuZnVuY3Rpb24gY2FyZEZyb21OdW1iZXIobnVtOiBzdHJpbmcpOiBhbnkge1xuICBsZXQgY2FyZDtcbiAgbGV0IGk7XG4gIGxldCBsZW47XG4gIGNvbnN0IG51bVN0cmluZyA9IChudW0gKyAnJykucmVwbGFjZSgvXFxEL2csICcnKTtcbiAgZm9yIChpID0gMCwgbGVuID0gY2FyZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBjYXJkID0gY2FyZHNbaV07XG4gICAgaWYgKGNhcmQucGF0dGVybi50ZXN0KG51bVN0cmluZykpIHtcbiAgICAgIHJldHVybiBjYXJkO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybjtcbn1cblxuZnVuY3Rpb24gY2FyZEZyb21UeXBlKHR5cGU6IHN0cmluZyk6IGFueSB7XG4gIGxldCBjYXJkO1xuICBsZXQgaTtcbiAgbGV0IGxlbjtcbiAgZm9yIChpID0gMCwgbGVuID0gY2FyZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBjYXJkID0gY2FyZHNbaV07XG4gICAgaWYgKGNhcmQudHlwZSA9PT0gdHlwZSkge1xuICAgICAgcmV0dXJuIGNhcmQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuO1xufVxuXG5mdW5jdGlvbiBsdWhuQ2hlY2sobnVtOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgbGV0IGRpZ2l0cztcbiAgbGV0IG9kZCA9IHRydWU7XG4gIGxldCBzdW0gPSAwO1xuXG4gIGRpZ2l0cyA9IChudW0gKyAnJykuc3BsaXQoJycpLnJldmVyc2UoKTtcblxuICBkaWdpdHMuZm9yRWFjaCgoZGlnaXRTdHJpbmcpID0+IHtcbiAgICBsZXQgZGlnaXQgPSBwYXJzZUludChkaWdpdFN0cmluZywgMTApO1xuICAgIG9kZCA9ICFvZGQ7XG4gICAgaWYgKG9kZCkge1xuICAgICAgZGlnaXQgKj0gMjtcbiAgICB9XG4gICAgaWYgKGRpZ2l0ID4gOSkge1xuICAgICAgZGlnaXQgLT0gOTtcbiAgICB9XG4gICAgcmV0dXJuIChzdW0gKz0gZGlnaXQpO1xuICB9KTtcblxuICByZXR1cm4gc3VtICUgMTAgPT09IDA7XG59XG5cbmZ1bmN0aW9uIGhhc1RleHRTZWxlY3RlZCh0YXJnZXQ/OiBFdmVudFRhcmdldCk6IGJvb2xlYW4ge1xuICBsZXQgZTtcbiAgdHJ5IHtcbiAgICAvLyBJZiBzb21lIHRleHQgaXMgc2VsZWN0ZWRcbiAgICBpZiAoXG4gICAgICB0YXJnZXQgJiZcbiAgICAgICh0YXJnZXQgYXMgYW55KS5zZWxlY3Rpb25TdGFydCAhPSBudWxsICYmXG4gICAgICAodGFyZ2V0IGFzIGFueSkuc2VsZWN0aW9uU3RhcnQgIT09ICh0YXJnZXQgYXMgYW55KS5zZWxlY3Rpb25FbmRcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHFqb24oXG4gIGVsZW1lbnQ6IEVsZW1lbnQgfCBhbnksXG4gIGV2ZW50TmFtZTogc3RyaW5nLFxuICBjYWxsYmFjazogKGU6IEV2ZW50KSA9PiB2b2lkXG4pOiBhbnkge1xuICBpZiAoZWxlbWVudC5sZW5ndGgpIHtcbiAgICAvLyBoYW5kbGUgbXVsdGlwbGUgZWxlbWVudHNcbiAgICBmb3IgKGNvbnN0IGVsIG9mIEFycmF5LmZyb20oZWxlbWVudCkpIHtcbiAgICAgIHFqb24oZWwsIGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoZXZlbnROYW1lLm1hdGNoKCcgJykpIHtcbiAgICAvLyBoYW5kbGUgbXVsdGlwbGUgZXZlbnQgYXR0YWNobWVudFxuICAgIGZvciAoY29uc3QgbXVsdGlFdmVudE5hbWUgb2YgQXJyYXkuZnJvbShldmVudE5hbWUuc3BsaXQoJyAnKSkpIHtcbiAgICAgIHFqb24oZWxlbWVudCwgbXVsdGlFdmVudE5hbWUsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgIHJldHVybiBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgZmFsc2UpO1xuICB9XG5cbiAgaWYgKGVsZW1lbnQuYXR0YWNoRXZlbnQpIHtcbiAgICBldmVudE5hbWUgPSAnb24nICsgZXZlbnROYW1lO1xuICAgIHJldHVybiBlbGVtZW50LmF0dGFjaEV2ZW50KGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuICB9XG5cbiAgZWxlbWVudFsnb24nICsgZXZlbnROYW1lXSA9IGNhbGxiYWNrO1xufVxuXG5mdW5jdGlvbiB0cmlnZ2VyKGVsOiBFbGVtZW50LCBuYW1lOiBzdHJpbmcsIGRhdGE/OiBhbnkpOiBib29sZWFuIHtcbiAgbGV0IGV2O1xuXG4gIHRyeSB7XG4gICAgZXYgPSBuZXcgQ3VzdG9tRXZlbnQobmFtZSwgeyBkZXRhaWw6IGRhdGEgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBldiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgIC8vIGpzZG9tIGRvZXNuJ3QgaGF2ZSBpbml0Q3VzdG9tRXZlbnQsIHNvIHdlIG5lZWQgdGhpcyBjaGVjayBmb3JcbiAgICAvLyB0ZXN0aW5nXG4gICAgaWYgKGV2LmluaXRDdXN0b21FdmVudCkge1xuICAgICAgZXYuaW5pdEN1c3RvbUV2ZW50KG5hbWUsIHRydWUsIHRydWUsIGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICAoZXYgYXMgYW55KS5pbml0RXZlbnQobmFtZSwgdHJ1ZSwgdHJ1ZSwgZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVsLmRpc3BhdGNoRXZlbnQoZXYpO1xufVxuXG4vLyBQdWJsaWNcbi8vIEBkeW5hbWljXG5leHBvcnQgY2xhc3MgUGF5bWVudCB7XG4gIHB1YmxpYyBzdGF0aWMgZm5zID0ge1xuICAgIGNhcmRFeHBpcnlWYWw6ICh2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgICBsZXQgbW9udGg7XG4gICAgICBsZXQgcHJlZml4O1xuICAgICAgbGV0IHllYXI7XG4gICAgICBsZXQgcmVmO1xuXG4gICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xccy9nLCAnJyk7XG4gICAgICAocmVmID0gdmFsdWUuc3BsaXQoJy8nLCAyKSksIChtb250aCA9IHJlZlswXSksICh5ZWFyID0gcmVmWzFdKTtcblxuICAgICAgLy8gQWxsb3cgZm9yIHllYXIgc2hvcnRjdXRcbiAgICAgIGlmICgoeWVhciAhPSBudWxsID8geWVhci5sZW5ndGggOiB2b2lkIDApID09PSAyICYmIC9eXFxkKyQvLnRlc3QoeWVhcikpIHtcbiAgICAgICAgcHJlZml4ID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICAgICAgICBwcmVmaXggPSBwcmVmaXgudG9TdHJpbmcoKS5zbGljZSgwLCAyKTtcbiAgICAgICAgeWVhciA9IHByZWZpeCArIHllYXI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1vbnRoLFxuICAgICAgICB5ZWFyLFxuICAgICAgfTtcbiAgICB9LFxuICAgIHZhbGlkYXRlQ2FyZE51bWJlcjogKG51bTogc3RyaW5nKSA9PiB7XG4gICAgICBsZXQgY2FyZDtcbiAgICAgIGxldCByZWY7XG5cbiAgICAgIG51bSA9IChudW0gKyAnJykucmVwbGFjZSgvXFxzK3wtL2csICcnKTtcbiAgICAgIGlmICghL15cXGQrJC8udGVzdChudW0pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY2FyZCA9IGNhcmRGcm9tTnVtYmVyKG51bSk7XG4gICAgICBpZiAoIWNhcmQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICAoKHJlZiA9IG51bS5sZW5ndGgpLCBpbmRleE9mLmNhbGwoY2FyZC5sZW5ndGgsIHJlZikgPj0gMCkgJiZcbiAgICAgICAgKGNhcmQubHVobiA9PT0gZmFsc2UgfHwgbHVobkNoZWNrKG51bSkpXG4gICAgICApO1xuICAgIH0sXG4gICAgdmFsaWRhdGVDYXJkRXhwaXJ5OiAobW9udGg6IHN0cmluZywgeWVhcjogc3RyaW5nKSA9PiB7XG4gICAgICAvLyBBbGxvdyBwYXNzaW5nIGFuIG9iamVjdFxuICAgICAgbGV0IGN1cnJlbnRUaW1lO1xuICAgICAgbGV0IGV4cGlyeTtcbiAgICAgIGxldCBwcmVmaXg7XG4gICAgICBsZXQgcmVmMTtcblxuICAgICAgaWYgKHR5cGVvZiBtb250aCA9PT0gJ3N0cmluZycgJiYgaW5kZXhPZi5jYWxsKG1vbnRoLCAnLycpID49IDApIHtcbiAgICAgICAgKHJlZjEgPSBQYXltZW50LmZucy5jYXJkRXhwaXJ5VmFsKG1vbnRoKSksXG4gICAgICAgICAgKG1vbnRoID0gcmVmMS5tb250aCksXG4gICAgICAgICAgKHllYXIgPSByZWYxLnllYXIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIShtb250aCAmJiB5ZWFyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIG1vbnRoID0gbW9udGgudHJpbSgpO1xuICAgICAgeWVhciA9IHllYXIudHJpbSgpO1xuXG4gICAgICBpZiAoIS9eXFxkKyQvLnRlc3QobW9udGgpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICghL15cXGQrJC8udGVzdCh5ZWFyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1vbnRoSW50ID0gcGFyc2VJbnQobW9udGgsIDEwKTtcblxuICAgICAgaWYgKCEobW9udGhJbnQgJiYgbW9udGhJbnQgPD0gMTIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHllYXIubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIHByZWZpeCA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgcHJlZml4ID0gcHJlZml4LnRvU3RyaW5nKCkuc2xpY2UoMCwgMik7XG4gICAgICAgIHllYXIgPSBwcmVmaXggKyB5ZWFyO1xuICAgICAgfVxuXG4gICAgICBleHBpcnkgPSBuZXcgRGF0ZShwYXJzZUludCh5ZWFyLCAxMCksIG1vbnRoSW50KTtcbiAgICAgIGN1cnJlbnRUaW1lID0gbmV3IERhdGUoKTtcblxuICAgICAgLy8gTW9udGhzIHN0YXJ0IGZyb20gMCBpbiBKYXZhU2NyaXB0XG4gICAgICBleHBpcnkuc2V0TW9udGgoZXhwaXJ5LmdldE1vbnRoKCkgLSAxKTtcblxuICAgICAgLy8gVGhlIGNjIGV4cGlyZXMgYXQgdGhlIGVuZCBvZiB0aGUgbW9udGgsXG4gICAgICAvLyBzbyB3ZSBuZWVkIHRvIG1ha2UgdGhlIGV4cGlyeSB0aGUgZmlyc3QgZGF5XG4gICAgICAvLyBvZiB0aGUgbW9udGggYWZ0ZXJcbiAgICAgIGV4cGlyeS5zZXRNb250aChleHBpcnkuZ2V0TW9udGgoKSArIDEsIDEpO1xuXG4gICAgICByZXR1cm4gZXhwaXJ5ID4gY3VycmVudFRpbWU7XG4gICAgfSxcbiAgICB2YWxpZGF0ZUNhcmRDVkM6IChjdmM6IHN0cmluZywgdHlwZT86IHN0cmluZykgPT4ge1xuICAgICAgbGV0IHJlZjtcbiAgICAgIGxldCByZWYxO1xuXG4gICAgICBjdmMgPSBjdmMudHJpbSgpO1xuICAgICAgaWYgKCEvXlxcZCskLy50ZXN0KGN2YykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZSAmJiBjYXJkRnJvbVR5cGUodHlwZSkpIHtcbiAgICAgICAgLy8gQ2hlY2sgYWdhaW5zdCBhIGV4cGxpY2l0IGNhcmQgdHlwZVxuICAgICAgICByZWYxID0gY2FyZEZyb21UeXBlKHR5cGUpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIChyZWYgPSBjdmMubGVuZ3RoKSxcbiAgICAgICAgICBpbmRleE9mLmNhbGwocmVmMSAhPSBudWxsID8gcmVmMS5jdmNMZW5ndGggOiB2b2lkIDAsIHJlZikgPj0gMFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ2hlY2sgYWdhaW5zdCBhbGwgdHlwZXNcbiAgICAgICAgcmV0dXJuIGN2Yy5sZW5ndGggPj0gMyAmJiBjdmMubGVuZ3RoIDw9IDQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBjYXJkVHlwZTogKG51bTogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAoIW51bSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlZiA9IGNhcmRGcm9tTnVtYmVyKG51bSk7XG4gICAgICByZXR1cm4gKHJlZiAhPSBudWxsID8gcmVmLnR5cGUgOiB2b2lkIDApIHx8IG51bGw7XG4gICAgfSxcbiAgICBmb3JtYXRDYXJkTnVtYmVyOiAobnVtOiBzdHJpbmcpID0+IHtcbiAgICAgIGxldCBjYXJkO1xuICAgICAgbGV0IGdyb3VwcztcbiAgICAgIGxldCB1cHBlckxlbmd0aDtcblxuICAgICAgY2FyZCA9IGNhcmRGcm9tTnVtYmVyKG51bSk7XG4gICAgICBpZiAoIWNhcmQpIHtcbiAgICAgICAgcmV0dXJuIG51bTtcbiAgICAgIH1cblxuICAgICAgdXBwZXJMZW5ndGggPSBjYXJkLmxlbmd0aFtjYXJkLmxlbmd0aC5sZW5ndGggLSAxXTtcblxuICAgICAgbnVtID0gbnVtLnJlcGxhY2UoL1xcRC9nLCAnJyk7XG4gICAgICBudW0gPSBudW0uc2xpY2UoMCwgdXBwZXJMZW5ndGgpO1xuXG4gICAgICBpZiAoY2FyZC5mb3JtYXQuZ2xvYmFsKSB7XG4gICAgICAgIGNvbnN0IHJlZiA9IG51bS5tYXRjaChjYXJkLmZvcm1hdCk7XG4gICAgICAgIHJldHVybiByZWYgIT0gbnVsbCA/IHJlZi5qb2luKCcgJykgOiB2b2lkIDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBncm91cHMgPSBjYXJkLmZvcm1hdC5leGVjKG51bSk7XG4gICAgICAgIGlmIChncm91cHMgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBncm91cHMuc2hpZnQoKTtcbiAgICAgICAgZ3JvdXBzID0gZ3JvdXBzLmZpbHRlcigobikgPT4gbik7IC8vIEZpbHRlciBlbXB0eSBncm91cHNcbiAgICAgICAgcmV0dXJuIGdyb3Vwcy5qb2luKCcgJyk7XG4gICAgICB9XG4gICAgfSxcbiAgfTtcblxuICBwdWJsaWMgc3RhdGljIHJlc3RyaWN0TnVtZXJpYyhlbDogRWxlbWVudCk6IGFueSB7XG4gICAgcmV0dXJuIHFqb24oZWwsICdrZXlwcmVzcycsIHJlc3RyaWN0TnVtZXJpYyk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGZvcm1hdENhcmRDVkMoZWw6IEVsZW1lbnQpOiBFbGVtZW50IHtcbiAgICBQYXltZW50LnJlc3RyaWN0TnVtZXJpYyhlbCk7XG4gICAgcWpvbihlbCwgJ2tleXByZXNzJywgcmVzdHJpY3RDVkMpO1xuICAgIHJldHVybiBlbDtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZm9ybWF0Q2FyZEV4cGlyeShlbDogRWxlbWVudCk6IEVsZW1lbnQge1xuICAgIGxldCBtb250aDtcbiAgICBsZXQgeWVhcjtcblxuICAgIFBheW1lbnQucmVzdHJpY3ROdW1lcmljKGVsKTtcbiAgICBpZiAoKGVsIGFzIGFueSkubGVuZ3RoICYmIChlbCBhcyBhbnkpLmxlbmd0aCA9PT0gMikge1xuICAgICAgKG1vbnRoID0gKGVsIGFzIGFueSlbMF0pLCAoeWVhciA9IChlbCBhcyBhbnkpWzFdKTtcbiAgICAgIHRoaXMuZm9ybWF0Q2FyZEV4cGlyeU11bHRpcGxlKG1vbnRoLCB5ZWFyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcWpvbihlbCwgJ2tleXByZXNzJywgcmVzdHJpY3RDb21iaW5lZEV4cGlyeSk7XG4gICAgICBxam9uKGVsLCAna2V5cHJlc3MnLCBmb3JtYXRFeHBpcnkpO1xuICAgICAgcWpvbihlbCwgJ2tleXByZXNzJywgZm9ybWF0Rm9yd2FyZFNsYXNoKTtcbiAgICAgIHFqb24oZWwsICdrZXlwcmVzcycsIGZvcm1hdEZvcndhcmRFeHBpcnkpO1xuICAgICAgcWpvbihlbCwgJ2tleWRvd24nLCBmb3JtYXRCYWNrRXhwaXJ5KTtcbiAgICB9XG4gICAgcmV0dXJuIGVsO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBmb3JtYXRDYXJkRXhwaXJ5TXVsdGlwbGUobW9udGg6IHN0cmluZywgeWVhcjogc3RyaW5nKTogYW55IHtcbiAgICBxam9uKG1vbnRoLCAna2V5cHJlc3MnLCByZXN0cmljdE1vbnRoRXhwaXJ5KTtcbiAgICBxam9uKG1vbnRoLCAna2V5cHJlc3MnLCBmb3JtYXRNb250aEV4cGlyeSk7XG4gICAgcmV0dXJuIHFqb24oeWVhciwgJ2tleXByZXNzJywgcmVzdHJpY3RZZWFyRXhwaXJ5KTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZm9ybWF0Q2FyZE51bWJlcihlbDogRWxlbWVudCwgbWF4TGVuZ3RoPzogbnVtYmVyKTogRWxlbWVudCB7XG4gICAgUGF5bWVudC5yZXN0cmljdE51bWVyaWMoZWwpO1xuICAgIHFqb24oZWwsICdrZXlwcmVzcycsIHJlc3RyaWN0Q2FyZE51bWJlcihtYXhMZW5ndGgpKTtcbiAgICBxam9uKGVsLCAna2V5cHJlc3MnLCBmb3JtYXRDYXJkTnVtYmVyKG1heExlbmd0aCkpO1xuICAgIHFqb24oZWwsICdrZXlkb3duJywgZm9ybWF0QmFja0NhcmROdW1iZXIpO1xuICAgIHFqb24oZWwsICdrZXl1cCBibHVyJywgc2V0Q2FyZFR5cGUpO1xuICAgIHFqb24oZWwsICdwYXN0ZScsIHJlRm9ybWF0Q2FyZE51bWJlcik7XG4gICAgcWpvbihlbCwgJ2lucHV0JywgcmVGb3JtYXRDYXJkTnVtYmVyKTtcbiAgICByZXR1cm4gZWw7XG4gIH1cbn1cbi8vIFByaXZhdGVcblxuLy8gRm9ybWF0IENhcmQgTnVtYmVyXG5cbmZ1bmN0aW9uIHJlRm9ybWF0Q2FyZE51bWJlcihlOiBFdmVudCk6IG51bWJlciB7XG4gIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBsZXQgdmFsdWU7XG4gICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTERhdGFFbGVtZW50O1xuXG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YWx1ZSA9IHRhcmdldC52YWx1ZTtcbiAgICB2YWx1ZSA9IFBheW1lbnQuZm5zLmZvcm1hdENhcmROdW1iZXIodmFsdWUpO1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGFyZ2V0LnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiB0cmlnZ2VyKHRhcmdldCwgJ2NoYW5nZScpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0Q2FyZE51bWJlcihtYXhMZW5ndGg/OiBudW1iZXIpOiAoZXZlbnQpID0+IGJvb2xlYW4ge1xuICByZXR1cm4gKGU6IEV2ZW50KSA9PiB7XG4gICAgLy8gT25seSBmb3JtYXQgaWYgaW5wdXQgaXMgYSBudW1iZXJcbiAgICBsZXQgY2FyZDtcbiAgICBsZXQgZGlnaXQ7XG4gICAgbGV0IGk7XG4gICAgbGV0IGxlbmd0aDtcbiAgICBsZXQgcmU7XG4gICAgbGV0IHRhcmdldDtcbiAgICBsZXQgdXBwZXJMZW5ndGg7XG4gICAgbGV0IHVwcGVyTGVuZ3RocztcbiAgICBsZXQgdmFsdWU7XG4gICAgbGV0IGo7XG4gICAgbGV0IGxlbjtcbiAgICBkaWdpdCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGUgYXMgYW55KS53aGljaCk7XG4gICAgaWYgKCEvXlxcZCskLy50ZXN0KGRpZ2l0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxEYXRhRWxlbWVudDtcbiAgICB2YWx1ZSA9IHRhcmdldC52YWx1ZTtcbiAgICBjYXJkID0gY2FyZEZyb21OdW1iZXIodmFsdWUgKyBkaWdpdCk7XG4gICAgbGVuZ3RoID0gKHZhbHVlLnJlcGxhY2UoL1xcRC9nLCAnJykgKyBkaWdpdCkubGVuZ3RoO1xuXG4gICAgdXBwZXJMZW5ndGhzID0gWzE2XTtcbiAgICBpZiAoY2FyZCkge1xuICAgICAgdXBwZXJMZW5ndGhzID0gY2FyZC5sZW5ndGg7XG4gICAgfVxuICAgIGlmIChtYXhMZW5ndGgpIHtcbiAgICAgIHVwcGVyTGVuZ3RocyA9IHVwcGVyTGVuZ3Rocy5maWx0ZXIoKHgpID0+IHggPD0gbWF4TGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gaWYgYW4gdXBwZXIgbGVuZ3RoIGhhcyBiZWVuIHJlYWNoZWRcbiAgICBmb3IgKGkgPSBqID0gMCwgbGVuID0gdXBwZXJMZW5ndGhzLmxlbmd0aDsgaiA8IGxlbjsgaSA9ICsraikge1xuICAgICAgdXBwZXJMZW5ndGggPSB1cHBlckxlbmd0aHNbaV07XG4gICAgICBpZiAobGVuZ3RoID49IHVwcGVyTGVuZ3RoICYmIHVwcGVyTGVuZ3Roc1tpICsgMV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAobGVuZ3RoID49IHVwcGVyTGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gaWYgZm9jdXMgaXNuJ3QgYXQgdGhlIGVuZCBvZiB0aGUgdGV4dFxuICAgIGlmIChoYXNUZXh0U2VsZWN0ZWQodGFyZ2V0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjYXJkICYmIGNhcmQudHlwZSA9PT0gJ2FtZXgnKSB7XG4gICAgICAvLyBBbWV4IGNhcmRzIGFyZSBmb3JtYXR0ZWQgZGlmZmVyZW50bHlcbiAgICAgIHJlID0gL14oXFxkezR9fFxcZHs0fVxcc1xcZHs2fSkkLztcbiAgICB9IGVsc2Uge1xuICAgICAgcmUgPSAvKD86XnxcXHMpKFxcZHs0fSkkLztcbiAgICB9XG5cbiAgICAvLyBJZiAnNDI0MicgKyA0XG4gICAgaWYgKHJlLnRlc3QodmFsdWUpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0YXJnZXQudmFsdWUgPSB2YWx1ZSArICcgJyArIGRpZ2l0O1xuICAgICAgcmV0dXJuIHRyaWdnZXIodGFyZ2V0LCAnY2hhbmdlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9O1xufVxuXG5mdW5jdGlvbiBmb3JtYXRCYWNrQ2FyZE51bWJlcihlOiBFdmVudCk6IGJvb2xlYW4ge1xuICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRGF0YUVsZW1lbnQ7XG4gIGNvbnN0IHZhbHVlID0gdGFyZ2V0LnZhbHVlO1xuXG4gIGlmICgoZSBhcyBhbnkpLm1ldGEpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBSZXR1cm4gdW5sZXNzIGJhY2tzcGFjaW5nXG4gIGlmICgoZSBhcyBhbnkpLndoaWNoICE9PSA4KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gUmV0dXJuIGlmIGZvY3VzIGlzbid0IGF0IHRoZSBlbmQgb2YgdGhlIHRleHRcbiAgaWYgKGhhc1RleHRTZWxlY3RlZCh0YXJnZXQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gUmVtb3ZlIHRoZSB0cmFpbGluZyBzcGFjZVxuICBpZiAoL1xcZFxccyQvLnRlc3QodmFsdWUpKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRhcmdldC52YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xcZFxccyQvLCAnJyk7XG4gICAgcmV0dXJuIHRyaWdnZXIodGFyZ2V0LCAnY2hhbmdlJyk7XG4gIH0gZWxzZSBpZiAoL1xcc1xcZD8kLy50ZXN0KHZhbHVlKSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0YXJnZXQudmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXHNcXGQ/JC8sICcnKTtcbiAgICByZXR1cm4gdHJpZ2dlcih0YXJnZXQsICdjaGFuZ2UnKTtcbiAgfVxuXG4gIHJldHVybjtcbn1cblxuLy8gRm9ybWF0IEV4cGlyeVxuXG5mdW5jdGlvbiBmb3JtYXRFeHBpcnkoZTogRXZlbnQpOiBib29sZWFuIHtcbiAgLy8gT25seSBmb3JtYXQgaWYgaW5wdXQgaXMgYSBudW1iZXJcbiAgY29uc3QgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKChlIGFzIGFueSkud2hpY2gpO1xuICBpZiAoIS9eXFxkKyQvLnRlc3QoZGlnaXQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTERhdGFFbGVtZW50O1xuICBjb25zdCB2YWwgPSB0YXJnZXQudmFsdWUgKyBkaWdpdDtcblxuICBpZiAoL15cXGQkLy50ZXN0KHZhbCkgJiYgdmFsICE9PSAnMCcgJiYgdmFsICE9PSAnMScpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGFyZ2V0LnZhbHVlID0gJzAnICsgdmFsICsgJyAvICc7XG4gICAgcmV0dXJuIHRyaWdnZXIodGFyZ2V0LCAnY2hhbmdlJyk7XG4gIH0gZWxzZSBpZiAoL15cXGRcXGQkLy50ZXN0KHZhbCkpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGFyZ2V0LnZhbHVlID0gdmFsICsgJyAvICc7XG4gICAgcmV0dXJuIHRyaWdnZXIodGFyZ2V0LCAnY2hhbmdlJyk7XG4gIH1cblxuICByZXR1cm47XG59XG5cbmZ1bmN0aW9uIGZvcm1hdE1vbnRoRXhwaXJ5KGU6IEV2ZW50KTogYm9vbGVhbiB7XG4gIGNvbnN0IGRpZ2l0ID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoZSBhcyBhbnkpLndoaWNoKTtcbiAgaWYgKCEvXlxcZCskLy50ZXN0KGRpZ2l0KSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxEYXRhRWxlbWVudDtcbiAgY29uc3QgdmFsID0gdGFyZ2V0LnZhbHVlICsgZGlnaXQ7XG5cbiAgaWYgKC9eXFxkJC8udGVzdCh2YWwpICYmIHZhbCAhPT0gJzAnICYmIHZhbCAhPT0gJzEnKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRhcmdldC52YWx1ZSA9ICcwJyArIHZhbDtcbiAgICByZXR1cm4gdHJpZ2dlcih0YXJnZXQsICdjaGFuZ2UnKTtcbiAgfSBlbHNlIGlmICgvXlxcZFxcZCQvLnRlc3QodmFsKSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0YXJnZXQudmFsdWUgPSB2YWw7XG4gICAgcmV0dXJuIHRyaWdnZXIodGFyZ2V0LCAnY2hhbmdlJyk7XG4gIH1cblxuICByZXR1cm47XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEZvcndhcmRFeHBpcnkoZTogRXZlbnQpOiBib29sZWFuIHtcbiAgY29uc3QgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKChlIGFzIGFueSkud2hpY2gpO1xuICBpZiAoIS9eXFxkKyQvLnRlc3QoZGlnaXQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTERhdGFFbGVtZW50O1xuICBjb25zdCB2YWwgPSB0YXJnZXQudmFsdWU7XG5cbiAgaWYgKC9eXFxkXFxkJC8udGVzdCh2YWwpKSB7XG4gICAgdGFyZ2V0LnZhbHVlID0gdmFsICsgJyAvICc7XG4gICAgcmV0dXJuIHRyaWdnZXIodGFyZ2V0LCAnY2hhbmdlJyk7XG4gIH1cblxuICByZXR1cm47XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEZvcndhcmRTbGFzaChlOiBFdmVudCk6IGJvb2xlYW4ge1xuICBjb25zdCBzbGFzaCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGUgYXMgYW55KS53aGljaCk7XG4gIGlmIChzbGFzaCAhPT0gJy8nKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTERhdGFFbGVtZW50O1xuICBjb25zdCB2YWwgPSB0YXJnZXQudmFsdWU7XG5cbiAgaWYgKC9eXFxkJC8udGVzdCh2YWwpICYmIHZhbCAhPT0gJzAnKSB7XG4gICAgdGFyZ2V0LnZhbHVlID0gJzAnICsgdmFsICsgJyAvICc7XG4gICAgcmV0dXJuIHRyaWdnZXIodGFyZ2V0LCAnY2hhbmdlJyk7XG4gIH1cblxuICByZXR1cm47XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEJhY2tFeHBpcnkoZTogRXZlbnQpOiBib29sZWFuIHtcbiAgLy8gSWYgc2hpZnQrYmFja3NwYWNlIGlzIHByZXNzZWRcbiAgaWYgKChlIGFzIGFueSkubWV0YUtleSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxEYXRhRWxlbWVudDtcbiAgY29uc3QgdmFsdWUgPSB0YXJnZXQudmFsdWU7XG5cbiAgLy8gUmV0dXJuIHVubGVzcyBiYWNrc3BhY2luZ1xuICBpZiAoKGUgYXMgYW55KS53aGljaCAhPT0gOCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFJldHVybiBpZiBmb2N1cyBpc24ndCBhdCB0aGUgZW5kIG9mIHRoZSB0ZXh0XG4gIGlmIChoYXNUZXh0U2VsZWN0ZWQodGFyZ2V0KSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFJlbW92ZSB0aGUgdHJhaWxpbmcgc3BhY2VcbiAgaWYgKC9cXGQoXFxzfFxcLykrJC8udGVzdCh2YWx1ZSkpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGFyZ2V0LnZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxkKFxcc3xcXC8pKiQvLCAnJyk7XG4gICAgcmV0dXJuIHRyaWdnZXIodGFyZ2V0LCAnY2hhbmdlJyk7XG4gIH0gZWxzZSBpZiAoL1xcc1xcL1xccz9cXGQ/JC8udGVzdCh2YWx1ZSkpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGFyZ2V0LnZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxzXFwvXFxzP1xcZD8kLywgJycpO1xuICAgIHJldHVybiB0cmlnZ2VyKHRhcmdldCwgJ2NoYW5nZScpO1xuICB9XG5cbiAgcmV0dXJuO1xufVxuXG4vLyAgUmVzdHJpY3Rpb25zXG5cbmZ1bmN0aW9uIHJlc3RyaWN0TnVtZXJpYyhlOiBFdmVudCk6IGJvb2xlYW4ge1xuICAvLyBLZXkgZXZlbnQgaXMgZm9yIGEgYnJvd3NlciBzaG9ydGN1dFxuICBsZXQgaW5wdXQ7XG4gIGlmICgoZSBhcyBhbnkpLm1ldGFLZXkgfHwgKGUgYXMgYW55KS5jdHJsS2V5KSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBJZiBrZXljb2RlIGlzIGEgc3BhY2VcbiAgaWYgKChlIGFzIGFueSkud2hpY2ggPT09IDMyKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIElmIGtleWNvZGUgaXMgYSBzcGVjaWFsIGNoYXIgKFdlYktpdClcbiAgaWYgKChlIGFzIGFueSkud2hpY2ggPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIElmIGNoYXIgaXMgYSBzcGVjaWFsIGNoYXIgKEZpcmVmb3gpXG4gIGlmICgoZSBhcyBhbnkpLndoaWNoIDwgMzMpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlucHV0ID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoZSBhcyBhbnkpLndoaWNoKTtcblxuICAvLyBDaGFyIGlzIGEgbnVtYmVyIG9yIGEgc3BhY2VcbiAgaWYgKCEvW1xcZFxcc10vLnRlc3QoaW5wdXQpKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZXN0cmljdENhcmROdW1iZXIobWF4TGVuZ3RoPzogbnVtYmVyKTogKEV2ZW50KSA9PiB2b2lkIHtcbiAgcmV0dXJuIChlOiBFdmVudCkgPT4ge1xuICAgIGxldCBsZW5ndGg7XG5cbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRGF0YUVsZW1lbnQ7XG4gICAgY29uc3QgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKChlIGFzIGFueSkud2hpY2gpO1xuICAgIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaGFzVGV4dFNlbGVjdGVkKHRhcmdldCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZXN0cmljdCBudW1iZXIgb2YgZGlnaXRzXG4gICAgY29uc3QgdmFsdWUgPSAodGFyZ2V0LnZhbHVlICsgZGlnaXQpLnJlcGxhY2UoL1xcRC9nLCAnJyk7XG4gICAgY29uc3QgY2FyZCA9IGNhcmRGcm9tTnVtYmVyKHZhbHVlKTtcblxuICAgIGxlbmd0aCA9IDE2O1xuICAgIGlmIChjYXJkKSB7XG4gICAgICBsZW5ndGggPSBjYXJkLmxlbmd0aFtjYXJkLmxlbmd0aC5sZW5ndGggLSAxXTtcbiAgICB9XG4gICAgaWYgKG1heExlbmd0aCkge1xuICAgICAgbGVuZ3RoID0gTWF0aC5taW4obGVuZ3RoLCBtYXhMZW5ndGgpO1xuICAgIH1cblxuICAgIGlmICghKHZhbHVlLmxlbmd0aCA8PSBsZW5ndGgpKSB7XG4gICAgICByZXR1cm4gZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVzdHJpY3RFeHBpcnkoZTogRXZlbnQsIGxlbmd0aDogbnVtYmVyKTogdm9pZCB7XG4gIGxldCB2YWx1ZTtcbiAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTERhdGFFbGVtZW50O1xuICBjb25zdCBkaWdpdCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGUgYXMgYW55KS53aGljaCk7XG4gIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaGFzVGV4dFNlbGVjdGVkKHRhcmdldCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YWx1ZSA9IHRhcmdldC52YWx1ZSArIGRpZ2l0O1xuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xcRC9nLCAnJyk7XG5cbiAgaWYgKHZhbHVlLmxlbmd0aCA+IGxlbmd0aCkge1xuICAgIHJldHVybiBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzdHJpY3RDb21iaW5lZEV4cGlyeShlOiBFdmVudCk6IHZvaWQge1xuICByZXR1cm4gcmVzdHJpY3RFeHBpcnkoZSwgNik7XG59XG5cbmZ1bmN0aW9uIHJlc3RyaWN0TW9udGhFeHBpcnkoZTogRXZlbnQpOiB2b2lkIHtcbiAgcmV0dXJuIHJlc3RyaWN0RXhwaXJ5KGUsIDIpO1xufVxuXG5mdW5jdGlvbiByZXN0cmljdFllYXJFeHBpcnkoZTogRXZlbnQpOiB2b2lkIHtcbiAgcmV0dXJuIHJlc3RyaWN0RXhwaXJ5KGUsIDQpO1xufVxuXG5mdW5jdGlvbiByZXN0cmljdENWQyhlOiBFdmVudCk6IHZvaWQge1xuICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRGF0YUVsZW1lbnQ7XG4gIGNvbnN0IGRpZ2l0ID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoZSBhcyBhbnkpLndoaWNoKTtcbiAgaWYgKCEvXlxcZCskLy50ZXN0KGRpZ2l0KSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChoYXNUZXh0U2VsZWN0ZWQodGFyZ2V0KSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHZhbCA9IHRhcmdldC52YWx1ZSArIGRpZ2l0O1xuICBpZiAoISh2YWwubGVuZ3RoIDw9IDQpKSB7XG4gICAgcmV0dXJuIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRDYXJkVHlwZShlOiBFdmVudCk6IGJvb2xlYW4ge1xuICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRGF0YUVsZW1lbnQ7XG4gIGNvbnN0IHZhbCA9IHRhcmdldC52YWx1ZTtcbiAgY29uc3QgY2FyZFR5cGUgPSBQYXltZW50LmZucy5jYXJkVHlwZSh2YWwpIHx8ICd1bmtub3duJztcblxuICBpZiAodGFyZ2V0ICYmIHRhcmdldC5jbGFzc0xpc3QgJiYgIXRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoY2FyZFR5cGUpKSB7XG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3Vua25vd24nKTtcbiAgICBjYXJkcy5mb3JFYWNoKChjYXJkKSA9PiB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZShjYXJkLnR5cGUpKTtcblxuICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKGNhcmRUeXBlKTtcblxuICAgIGlmIChjYXJkVHlwZSAhPT0gJ3Vua25vd24nKSB7XG4gICAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaWRlbnRpZmllZCcpKSB7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdpZGVudGlmaWVkJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdpZGVudGlmaWVkJyk7XG4gICAgfVxuICAgIHJldHVybiB0cmlnZ2VyKHRhcmdldCwgJ3BheW1lbnQuY2FyZFR5cGUnLCBjYXJkVHlwZSk7XG4gIH1cblxuICByZXR1cm47XG59XG4iXX0=