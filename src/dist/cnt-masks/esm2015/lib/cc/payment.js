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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NudC1tYXNrcy9zcmMvbGliL2NjL3BheW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBZ0NBLElBQUksS0FBb0IsQ0FBQztBQUN6QixJQUFJLGFBQWEsQ0FBQztXQUloQixVQUF1QixJQUFTO0lBQzlCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDM0MsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDakMsT0FBTyxDQUFDLENBQUM7U0FDVjtLQUNGO0lBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNaLENBQUM7QUFUSCxNQUFNLE9BQU8sR0FDWCxFQUFFLENBQUMsT0FBTyxNQVFULENBQUM7QUFFSixhQUFhLEdBQUcsWUFBWSxDQUFDO0FBRTdCLEtBQUssR0FBRztJQUNOO1FBQ0UsSUFBSSxFQUFFLE1BQU07UUFDWixPQUFPLEVBQUUsUUFBUTtRQUNqQixNQUFNLEVBQUUsK0JBQStCO1FBQ3ZDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNaLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNkLElBQUksRUFBRSxJQUFJO0tBQ1g7SUFDRDtRQUNFLElBQUksRUFBRSxTQUFTO1FBQ2YsT0FBTyxFQUFFLE9BQU87UUFDaEIsTUFBTSxFQUFFLGFBQWE7UUFDckIsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ1osU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxFQUFFLElBQUk7S0FDWDtJQUNEO1FBQ0UsSUFBSSxFQUFFLFdBQVc7UUFDakIsT0FBTyxFQUFFLHVEQUF1RDtRQUNoRSxNQUFNLEVBQUUsYUFBYTtRQUNy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LEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUN6QixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxTQUFTLENBQUM7SUFFeEQsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ3RFLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRTVELE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRS9CLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUMxQixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxFQUFFO2dCQUMzQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUNwQztTQUNGO2FBQU07WUFDTCxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUN2QztRQUNELE9BQU8sT0FBTyxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUN0RDtJQUVELE9BQU87QUFDVCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBCYXNlZCBvbjpcbiAqIENvcHlyaWdodCAoYykgMjAxNCBKZXNzZSBQb2xsYWtcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmdcbiAqIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuICogXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4gKiB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4gKiBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0b1xuICogdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG4gKiBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gKiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICogTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuICogTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuICogT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG4gKiBXSVRIIFRIXG4gKi9cbmludGVyZmFjZSBJQ2FyZE9iamVjdCB7XG4gIHR5cGU6IHN0cmluZztcbiAgcGF0dGVybjogUmVnRXhwO1xuICBmb3JtYXQ6IFJlZ0V4cDtcbiAgbGVuZ3RoOiBudW1iZXJbXTtcbiAgY3ZjTGVuZ3RoOiBudW1iZXJbXTtcbiAgbHVobjogYm9vbGVhbjtcbn1cblxubGV0IGNhcmRzOiBJQ2FyZE9iamVjdFtdO1xubGV0IGRlZmF1bHRGb3JtYXQ7XG5cbmNvbnN0IGluZGV4T2YgPVxuICBbXS5pbmRleE9mIHx8XG4gIGZ1bmN0aW9uICh0aGlzOiBhbnlbXSwgaXRlbTogYW55KTogbnVtYmVyIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAtMTtcbiAgfTtcblxuZGVmYXVsdEZvcm1hdCA9IC8oXFxkezEsNH0pL2c7XG5cbmNhcmRzID0gW1xuICB7XG4gICAgdHlwZTogJ2FtZXgnLFxuICAgIHBhdHRlcm46IC9eM1s0N10vLFxuICAgIGZvcm1hdDogLyhcXGR7MSw0fSkoXFxkezEsNn0pPyhcXGR7MSw1fSk/LyxcbiAgICBsZW5ndGg6IFsxNV0sXG4gICAgY3ZjTGVuZ3RoOiBbNF0sXG4gICAgbHVobjogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdkYW5rb3J0JyxcbiAgICBwYXR0ZXJuOiAvXjUwMTkvLFxuICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICBsZW5ndGg6IFsxNl0sXG4gICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgbHVobjogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdoaXBlcmNhcmQnLFxuICAgIHBhdHRlcm46IC9eKDM4NDEwMHwzODQxNDB8Mzg0MTYwfDYwNjI4Mnw2MzcwOTV8NjM3NTY4fDYwKD8hMTEpKS8sXG4gICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgIGxlbmd0aDogWzE0LCAxNSwgMTYsIDE3LCAxOCwgMTldLFxuICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgIGx1aG46IHRydWUsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnZGluZXJzY2x1YicsXG4gICAgcGF0dGVybjogL14oMzZ8Mzh8MzBbMC01XSkvLFxuICAgIGZvcm1hdDogLyhcXGR7MSw0fSkoXFxkezEsNn0pPyhcXGR7MSw0fSk/LyxcbiAgICBsZW5ndGg6IFsxNF0sXG4gICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgbHVobjogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdkaXNjb3ZlcicsXG4gICAgcGF0dGVybjogL14oNjAxMXw2NXw2NFs0LTldfDYyMikvLFxuICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICBsZW5ndGg6IFsxNl0sXG4gICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgbHVobjogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdqY2InLFxuICAgIHBhdHRlcm46IC9eMzUvLFxuICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICBsZW5ndGg6IFsxNl0sXG4gICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgbHVobjogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdsYXNlcicsXG4gICAgcGF0dGVybjogL14oNjcwNnw2NzcxfDY3MDkpLyxcbiAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgbGVuZ3RoOiBbMTYsIDE3LCAxOCwgMTldLFxuICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgIGx1aG46IHRydWUsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnbWFlc3RybycsXG4gICAgcGF0dGVybjogL14oNTAxOHw1MDIwfDUwMzh8NjMwNHw2NzAzfDY3MDh8Njc1OXw2NzZbMS0zXSkvLFxuICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICBsZW5ndGg6IFsxMiwgMTMsIDE0LCAxNSwgMTYsIDE3LCAxOCwgMTldLFxuICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgIGx1aG46IHRydWUsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnbWFzdGVyY2FyZCcsXG4gICAgcGF0dGVybjogL14oNVsxLTVdfDY3NzE4OSl8XigyMjJbMS05XXwyWzMtNl1cXGR7Mn18MjdbMC0xXVxcZHwyNzIwKS8sXG4gICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgIGxlbmd0aDogWzE2XSxcbiAgICBjdmNMZW5ndGg6IFszXSxcbiAgICBsdWhuOiB0cnVlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ3VuaW9ucGF5JyxcbiAgICBwYXR0ZXJuOiAvXjYyLyxcbiAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgbGVuZ3RoOiBbMTYsIDE3LCAxOCwgMTldLFxuICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgIGx1aG46IGZhbHNlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ3Zpc2FlbGVjdHJvbicsXG4gICAgcGF0dGVybjogL140KDAyNnwxNzUwMHw0MDV8NTA4fDg0NHw5MVszN10pLyxcbiAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgbGVuZ3RoOiBbMTZdLFxuICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgIGx1aG46IHRydWUsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnZWxvJyxcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgcGF0dGVybjogL14oNDAxMSg3OHw3OSl8NDMoMTI3NHw4OTM1KXw0NSgxNDE2fDczOTN8NzYzKDF8MikpfDUwKDQxNzV8NjY5OXw2N1swLTddWzAtOV18OTAwMCl8NjI3NzgwfDYzKDYyOTd8NjM2OCl8NjUwKDAzKFteNF0pfDA0KFswLTldKXwwNSgwfDEpfDQoMFs1LTldfDNbMC05XXw4WzUtOV18OVswLTldKXw1KFswLTJdWzAtOV18M1swLThdKXw5KFsyLTZdWzAtOV18N1swLThdKXw1NDF8NzAwfDcyMHw5MDEpfDY1MTY1Mnw2NTUwMDB8NjU1MDIxKS8sXG4gICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgIGxlbmd0aDogWzE2XSxcbiAgICBjdmNMZW5ndGg6IFszXSxcbiAgICBsdWhuOiB0cnVlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ3Zpc2EnLFxuICAgIHBhdHRlcm46IC9eNC8sXG4gICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgIGxlbmd0aDogWzEzLCAxNiwgMTldLFxuICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgIGx1aG46IHRydWUsXG4gIH0sXG5dO1xuXG5mdW5jdGlvbiBjYXJkRnJvbU51bWJlcihudW06IHN0cmluZyk6IGFueSB7XG4gIGxldCBjYXJkO1xuICBsZXQgaTtcbiAgbGV0IGxlbjtcbiAgY29uc3QgbnVtU3RyaW5nID0gKG51bSArICcnKS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBjYXJkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGNhcmQgPSBjYXJkc1tpXTtcbiAgICBpZiAoY2FyZC5wYXR0ZXJuLnRlc3QobnVtU3RyaW5nKSkge1xuICAgICAgcmV0dXJuIGNhcmQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuO1xufVxuXG5mdW5jdGlvbiBjYXJkRnJvbVR5cGUodHlwZTogc3RyaW5nKTogYW55IHtcbiAgbGV0IGNhcmQ7XG4gIGxldCBpO1xuICBsZXQgbGVuO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBjYXJkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGNhcmQgPSBjYXJkc1tpXTtcbiAgICBpZiAoY2FyZC50eXBlID09PSB0eXBlKSB7XG4gICAgICByZXR1cm4gY2FyZDtcbiAgICB9XG4gIH1cblxuICByZXR1cm47XG59XG5cbmZ1bmN0aW9uIGx1aG5DaGVjayhudW06IHN0cmluZyk6IGJvb2xlYW4ge1xuICBsZXQgZGlnaXRzO1xuICBsZXQgb2RkID0gdHJ1ZTtcbiAgbGV0IHN1bSA9IDA7XG5cbiAgZGlnaXRzID0gKG51bSArICcnKS5zcGxpdCgnJykucmV2ZXJzZSgpO1xuXG4gIGRpZ2l0cy5mb3JFYWNoKChkaWdpdFN0cmluZykgPT4ge1xuICAgIGxldCBkaWdpdCA9IHBhcnNlSW50KGRpZ2l0U3RyaW5nLCAxMCk7XG4gICAgb2RkID0gIW9kZDtcbiAgICBpZiAob2RkKSB7XG4gICAgICBkaWdpdCAqPSAyO1xuICAgIH1cbiAgICBpZiAoZGlnaXQgPiA5KSB7XG4gICAgICBkaWdpdCAtPSA5O1xuICAgIH1cbiAgICByZXR1cm4gKHN1bSArPSBkaWdpdCk7XG4gIH0pO1xuXG4gIHJldHVybiBzdW0gJSAxMCA9PT0gMDtcbn1cblxuZnVuY3Rpb24gaGFzVGV4dFNlbGVjdGVkKHRhcmdldD86IEV2ZW50VGFyZ2V0KTogYm9vbGVhbiB7XG4gIGxldCBlO1xuICB0cnkge1xuICAgIC8vIElmIHNvbWUgdGV4dCBpcyBzZWxlY3RlZFxuICAgIGlmIChcbiAgICAgIHRhcmdldCAmJlxuICAgICAgKHRhcmdldCBhcyBhbnkpLnNlbGVjdGlvblN0YXJ0ICE9IG51bGwgJiZcbiAgICAgICh0YXJnZXQgYXMgYW55KS5zZWxlY3Rpb25TdGFydCAhPT0gKHRhcmdldCBhcyBhbnkpLnNlbGVjdGlvbkVuZFxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gcWpvbihcbiAgZWxlbWVudDogRWxlbWVudCB8IGFueSxcbiAgZXZlbnROYW1lOiBzdHJpbmcsXG4gIGNhbGxiYWNrOiAoZTogRXZlbnQpID0+IHZvaWRcbik6IGFueSB7XG4gIGlmIChlbGVtZW50Lmxlbmd0aCkge1xuICAgIC8vIGhhbmRsZSBtdWx0aXBsZSBlbGVtZW50c1xuICAgIGZvciAoY29uc3QgZWwgb2YgQXJyYXkuZnJvbShlbGVtZW50KSkge1xuICAgICAgcWpvbihlbCwgZXZlbnROYW1lLCBjYWxsYmFjayk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChldmVudE5hbWUubWF0Y2goJyAnKSkge1xuICAgIC8vIGhhbmRsZSBtdWx0aXBsZSBldmVudCBhdHRhY2htZW50XG4gICAgZm9yIChjb25zdCBtdWx0aUV2ZW50TmFtZSBvZiBBcnJheS5mcm9tKGV2ZW50TmFtZS5zcGxpdCgnICcpKSkge1xuICAgICAgcWpvbihlbGVtZW50LCBtdWx0aUV2ZW50TmFtZSwgY2FsbGJhY2spO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrLCBmYWxzZSk7XG4gIH1cblxuICBpZiAoZWxlbWVudC5hdHRhY2hFdmVudCkge1xuICAgIGV2ZW50TmFtZSA9ICdvbicgKyBldmVudE5hbWU7XG4gICAgcmV0dXJuIGVsZW1lbnQuYXR0YWNoRXZlbnQoZXZlbnROYW1lLCBjYWxsYmFjayk7XG4gIH1cblxuICBlbGVtZW50WydvbicgKyBldmVudE5hbWVdID0gY2FsbGJhY2s7XG59XG5cbmZ1bmN0aW9uIHRyaWdnZXIoZWw6IEVsZW1lbnQsIG5hbWU6IHN0cmluZywgZGF0YT86IGFueSk6IGJvb2xlYW4ge1xuICBsZXQgZXY7XG5cbiAgdHJ5IHtcbiAgICBldiA9IG5ldyBDdXN0b21FdmVudChuYW1lLCB7IGRldGFpbDogZGF0YSB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGV2ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gICAgLy8ganNkb20gZG9lc24ndCBoYXZlIGluaXRDdXN0b21FdmVudCwgc28gd2UgbmVlZCB0aGlzIGNoZWNrIGZvclxuICAgIC8vIHRlc3RpbmdcbiAgICBpZiAoZXYuaW5pdEN1c3RvbUV2ZW50KSB7XG4gICAgICBldi5pbml0Q3VzdG9tRXZlbnQobmFtZSwgdHJ1ZSwgdHJ1ZSwgZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIChldiBhcyBhbnkpLmluaXRFdmVudChuYW1lLCB0cnVlLCB0cnVlLCBkYXRhKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZWwuZGlzcGF0Y2hFdmVudChldik7XG59XG5cbi8vIFB1YmxpY1xuLy8gQGR5bmFtaWNcbmV4cG9ydCBjbGFzcyBQYXltZW50IHtcbiAgcHVibGljIHN0YXRpYyBmbnMgPSB7XG4gICAgY2FyZEV4cGlyeVZhbDogKHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgIGxldCBtb250aDtcbiAgICAgIGxldCBwcmVmaXg7XG4gICAgICBsZXQgeWVhcjtcbiAgICAgIGxldCByZWY7XG5cbiAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxzL2csICcnKTtcbiAgICAgIChyZWYgPSB2YWx1ZS5zcGxpdCgnLycsIDIpKSwgKG1vbnRoID0gcmVmWzBdKSwgKHllYXIgPSByZWZbMV0pO1xuXG4gICAgICAvLyBBbGxvdyBmb3IgeWVhciBzaG9ydGN1dFxuICAgICAgaWYgKCh5ZWFyICE9IG51bGwgPyB5ZWFyLmxlbmd0aCA6IHZvaWQgMCkgPT09IDIgJiYgL15cXGQrJC8udGVzdCh5ZWFyKSkge1xuICAgICAgICBwcmVmaXggPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIHByZWZpeCA9IHByZWZpeC50b1N0cmluZygpLnNsaWNlKDAsIDIpO1xuICAgICAgICB5ZWFyID0gcHJlZml4ICsgeWVhcjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbW9udGgsXG4gICAgICAgIHllYXIsXG4gICAgICB9O1xuICAgIH0sXG4gICAgdmFsaWRhdGVDYXJkTnVtYmVyOiAobnVtOiBzdHJpbmcpID0+IHtcbiAgICAgIGxldCBjYXJkO1xuICAgICAgbGV0IHJlZjtcblxuICAgICAgbnVtID0gKG51bSArICcnKS5yZXBsYWNlKC9cXHMrfC0vZywgJycpO1xuICAgICAgaWYgKCEvXlxcZCskLy50ZXN0KG51bSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBjYXJkID0gY2FyZEZyb21OdW1iZXIobnVtKTtcbiAgICAgIGlmICghY2FyZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgICgocmVmID0gbnVtLmxlbmd0aCksIGluZGV4T2YuY2FsbChjYXJkLmxlbmd0aCwgcmVmKSA+PSAwKSAmJlxuICAgICAgICAoY2FyZC5sdWhuID09PSBmYWxzZSB8fCBsdWhuQ2hlY2sobnVtKSlcbiAgICAgICk7XG4gICAgfSxcbiAgICB2YWxpZGF0ZUNhcmRFeHBpcnk6IChtb250aDogc3RyaW5nLCB5ZWFyOiBzdHJpbmcpID0+IHtcbiAgICAgIC8vIEFsbG93IHBhc3NpbmcgYW4gb2JqZWN0XG4gICAgICBsZXQgY3VycmVudFRpbWU7XG4gICAgICBsZXQgZXhwaXJ5O1xuICAgICAgbGV0IHByZWZpeDtcbiAgICAgIGxldCByZWYxO1xuXG4gICAgICBpZiAodHlwZW9mIG1vbnRoID09PSAnc3RyaW5nJyAmJiBpbmRleE9mLmNhbGwobW9udGgsICcvJykgPj0gMCkge1xuICAgICAgICAocmVmMSA9IFBheW1lbnQuZm5zLmNhcmRFeHBpcnlWYWwobW9udGgpKSxcbiAgICAgICAgICAobW9udGggPSByZWYxLm1vbnRoKSxcbiAgICAgICAgICAoeWVhciA9IHJlZjEueWVhcik7XG4gICAgICB9XG5cbiAgICAgIGlmICghKG1vbnRoICYmIHllYXIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgbW9udGggPSBtb250aC50cmltKCk7XG4gICAgICB5ZWFyID0geWVhci50cmltKCk7XG5cbiAgICAgIGlmICghL15cXGQrJC8udGVzdChtb250aCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKCEvXlxcZCskLy50ZXN0KHllYXIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbW9udGhJbnQgPSBwYXJzZUludChtb250aCwgMTApO1xuXG4gICAgICBpZiAoIShtb250aEludCAmJiBtb250aEludCA8PSAxMikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoeWVhci5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgcHJlZml4ID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICAgICAgICBwcmVmaXggPSBwcmVmaXgudG9TdHJpbmcoKS5zbGljZSgwLCAyKTtcbiAgICAgICAgeWVhciA9IHByZWZpeCArIHllYXI7XG4gICAgICB9XG5cbiAgICAgIGV4cGlyeSA9IG5ldyBEYXRlKHBhcnNlSW50KHllYXIsIDEwKSwgbW9udGhJbnQpO1xuICAgICAgY3VycmVudFRpbWUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAvLyBNb250aHMgc3RhcnQgZnJvbSAwIGluIEphdmFTY3JpcHRcbiAgICAgIGV4cGlyeS5zZXRNb250aChleHBpcnkuZ2V0TW9udGgoKSAtIDEpO1xuXG4gICAgICAvLyBUaGUgY2MgZXhwaXJlcyBhdCB0aGUgZW5kIG9mIHRoZSBtb250aCxcbiAgICAgIC8vIHNvIHdlIG5lZWQgdG8gbWFrZSB0aGUgZXhwaXJ5IHRoZSBmaXJzdCBkYXlcbiAgICAgIC8vIG9mIHRoZSBtb250aCBhZnRlclxuICAgICAgZXhwaXJ5LnNldE1vbnRoKGV4cGlyeS5nZXRNb250aCgpICsgMSwgMSk7XG5cbiAgICAgIHJldHVybiBleHBpcnkgPiBjdXJyZW50VGltZTtcbiAgICB9LFxuICAgIHZhbGlkYXRlQ2FyZENWQzogKGN2Yzogc3RyaW5nLCB0eXBlPzogc3RyaW5nKSA9PiB7XG4gICAgICBsZXQgcmVmO1xuICAgICAgbGV0IHJlZjE7XG5cbiAgICAgIGN2YyA9IGN2Yy50cmltKCk7XG4gICAgICBpZiAoIS9eXFxkKyQvLnRlc3QoY3ZjKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlICYmIGNhcmRGcm9tVHlwZSh0eXBlKSkge1xuICAgICAgICAvLyBDaGVjayBhZ2FpbnN0IGEgZXhwbGljaXQgY2FyZCB0eXBlXG4gICAgICAgIHJlZjEgPSBjYXJkRnJvbVR5cGUodHlwZSk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgKHJlZiA9IGN2Yy5sZW5ndGgpLFxuICAgICAgICAgIGluZGV4T2YuY2FsbChyZWYxICE9IG51bGwgPyByZWYxLmN2Y0xlbmd0aCA6IHZvaWQgMCwgcmVmKSA+PSAwXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDaGVjayBhZ2FpbnN0IGFsbCB0eXBlc1xuICAgICAgICByZXR1cm4gY3ZjLmxlbmd0aCA+PSAzICYmIGN2Yy5sZW5ndGggPD0gNDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNhcmRUeXBlOiAobnVtOiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICghbnVtKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgY29uc3QgcmVmID0gY2FyZEZyb21OdW1iZXIobnVtKTtcbiAgICAgIHJldHVybiAocmVmICE9IG51bGwgPyByZWYudHlwZSA6IHZvaWQgMCkgfHwgbnVsbDtcbiAgICB9LFxuICAgIGZvcm1hdENhcmROdW1iZXI6IChudW06IHN0cmluZykgPT4ge1xuICAgICAgbGV0IGNhcmQ7XG4gICAgICBsZXQgZ3JvdXBzO1xuICAgICAgbGV0IHVwcGVyTGVuZ3RoO1xuXG4gICAgICBjYXJkID0gY2FyZEZyb21OdW1iZXIobnVtKTtcbiAgICAgIGlmICghY2FyZCkge1xuICAgICAgICByZXR1cm4gbnVtO1xuICAgICAgfVxuXG4gICAgICB1cHBlckxlbmd0aCA9IGNhcmQubGVuZ3RoW2NhcmQubGVuZ3RoLmxlbmd0aCAtIDFdO1xuXG4gICAgICBudW0gPSBudW0ucmVwbGFjZSgvXFxEL2csICcnKTtcbiAgICAgIG51bSA9IG51bS5zbGljZSgwLCB1cHBlckxlbmd0aCk7XG5cbiAgICAgIGlmIChjYXJkLmZvcm1hdC5nbG9iYWwpIHtcbiAgICAgICAgY29uc3QgcmVmID0gbnVtLm1hdGNoKGNhcmQuZm9ybWF0KTtcbiAgICAgICAgcmV0dXJuIHJlZiAhPSBudWxsID8gcmVmLmpvaW4oJyAnKSA6IHZvaWQgMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdyb3VwcyA9IGNhcmQuZm9ybWF0LmV4ZWMobnVtKTtcbiAgICAgICAgaWYgKGdyb3VwcyA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGdyb3Vwcy5zaGlmdCgpO1xuICAgICAgICBncm91cHMgPSBncm91cHMuZmlsdGVyKChuKSA9PiBuKTsgLy8gRmlsdGVyIGVtcHR5IGdyb3Vwc1xuICAgICAgICByZXR1cm4gZ3JvdXBzLmpvaW4oJyAnKTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xuXG4gIHB1YmxpYyBzdGF0aWMgcmVzdHJpY3ROdW1lcmljKGVsOiBFbGVtZW50KTogYW55IHtcbiAgICByZXR1cm4gcWpvbihlbCwgJ2tleXByZXNzJywgcmVzdHJpY3ROdW1lcmljKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZm9ybWF0Q2FyZENWQyhlbDogRWxlbWVudCk6IEVsZW1lbnQge1xuICAgIFBheW1lbnQucmVzdHJpY3ROdW1lcmljKGVsKTtcbiAgICBxam9uKGVsLCAna2V5cHJlc3MnLCByZXN0cmljdENWQyk7XG4gICAgcmV0dXJuIGVsO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBmb3JtYXRDYXJkRXhwaXJ5KGVsOiBFbGVtZW50KTogRWxlbWVudCB7XG4gICAgbGV0IG1vbnRoO1xuICAgIGxldCB5ZWFyO1xuXG4gICAgUGF5bWVudC5yZXN0cmljdE51bWVyaWMoZWwpO1xuICAgIGlmICgoZWwgYXMgYW55KS5sZW5ndGggJiYgKGVsIGFzIGFueSkubGVuZ3RoID09PSAyKSB7XG4gICAgICAobW9udGggPSAoZWwgYXMgYW55KVswXSksICh5ZWFyID0gKGVsIGFzIGFueSlbMV0pO1xuICAgICAgdGhpcy5mb3JtYXRDYXJkRXhwaXJ5TXVsdGlwbGUobW9udGgsIHllYXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBxam9uKGVsLCAna2V5cHJlc3MnLCByZXN0cmljdENvbWJpbmVkRXhwaXJ5KTtcbiAgICAgIHFqb24oZWwsICdrZXlwcmVzcycsIGZvcm1hdEV4cGlyeSk7XG4gICAgICBxam9uKGVsLCAna2V5cHJlc3MnLCBmb3JtYXRGb3J3YXJkU2xhc2gpO1xuICAgICAgcWpvbihlbCwgJ2tleXByZXNzJywgZm9ybWF0Rm9yd2FyZEV4cGlyeSk7XG4gICAgICBxam9uKGVsLCAna2V5ZG93bicsIGZvcm1hdEJhY2tFeHBpcnkpO1xuICAgIH1cbiAgICByZXR1cm4gZWw7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGZvcm1hdENhcmRFeHBpcnlNdWx0aXBsZShtb250aDogc3RyaW5nLCB5ZWFyOiBzdHJpbmcpOiBhbnkge1xuICAgIHFqb24obW9udGgsICdrZXlwcmVzcycsIHJlc3RyaWN0TW9udGhFeHBpcnkpO1xuICAgIHFqb24obW9udGgsICdrZXlwcmVzcycsIGZvcm1hdE1vbnRoRXhwaXJ5KTtcbiAgICByZXR1cm4gcWpvbih5ZWFyLCAna2V5cHJlc3MnLCByZXN0cmljdFllYXJFeHBpcnkpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBmb3JtYXRDYXJkTnVtYmVyKGVsOiBFbGVtZW50LCBtYXhMZW5ndGg/OiBudW1iZXIpOiBFbGVtZW50IHtcbiAgICBQYXltZW50LnJlc3RyaWN0TnVtZXJpYyhlbCk7XG4gICAgcWpvbihlbCwgJ2tleXByZXNzJywgcmVzdHJpY3RDYXJkTnVtYmVyKG1heExlbmd0aCkpO1xuICAgIHFqb24oZWwsICdrZXlwcmVzcycsIGZvcm1hdENhcmROdW1iZXIobWF4TGVuZ3RoKSk7XG4gICAgcWpvbihlbCwgJ2tleWRvd24nLCBmb3JtYXRCYWNrQ2FyZE51bWJlcik7XG4gICAgcWpvbihlbCwgJ2tleXVwIGJsdXInLCBzZXRDYXJkVHlwZSk7XG4gICAgcWpvbihlbCwgJ3Bhc3RlJywgcmVGb3JtYXRDYXJkTnVtYmVyKTtcbiAgICBxam9uKGVsLCAnaW5wdXQnLCByZUZvcm1hdENhcmROdW1iZXIpO1xuICAgIHJldHVybiBlbDtcbiAgfVxufVxuLy8gUHJpdmF0ZVxuXG4vLyBGb3JtYXQgQ2FyZCBOdW1iZXJcblxuZnVuY3Rpb24gcmVGb3JtYXRDYXJkTnVtYmVyKGU6IEV2ZW50KTogbnVtYmVyIHtcbiAgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGxldCB2YWx1ZTtcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRGF0YUVsZW1lbnQ7XG5cbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhbHVlID0gdGFyZ2V0LnZhbHVlO1xuICAgIHZhbHVlID0gUGF5bWVudC5mbnMuZm9ybWF0Q2FyZE51bWJlcih2YWx1ZSk7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0YXJnZXQudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRyaWdnZXIodGFyZ2V0LCAnY2hhbmdlJyk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRDYXJkTnVtYmVyKG1heExlbmd0aD86IG51bWJlcik6IChldmVudCkgPT4gYm9vbGVhbiB7XG4gIHJldHVybiAoZTogRXZlbnQpID0+IHtcbiAgICAvLyBPbmx5IGZvcm1hdCBpZiBpbnB1dCBpcyBhIG51bWJlclxuICAgIGxldCBjYXJkO1xuICAgIGxldCBkaWdpdDtcbiAgICBsZXQgaTtcbiAgICBsZXQgbGVuZ3RoO1xuICAgIGxldCByZTtcbiAgICBsZXQgdGFyZ2V0O1xuICAgIGxldCB1cHBlckxlbmd0aDtcbiAgICBsZXQgdXBwZXJMZW5ndGhzO1xuICAgIGxldCB2YWx1ZTtcbiAgICBsZXQgajtcbiAgICBsZXQgbGVuO1xuICAgIGRpZ2l0ID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoZSBhcyBhbnkpLndoaWNoKTtcbiAgICBpZiAoIS9eXFxkKyQvLnRlc3QoZGlnaXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTERhdGFFbGVtZW50O1xuICAgIHZhbHVlID0gdGFyZ2V0LnZhbHVlO1xuICAgIGNhcmQgPSBjYXJkRnJvbU51bWJlcih2YWx1ZSArIGRpZ2l0KTtcbiAgICBsZW5ndGggPSAodmFsdWUucmVwbGFjZSgvXFxEL2csICcnKSArIGRpZ2l0KS5sZW5ndGg7XG5cbiAgICB1cHBlckxlbmd0aHMgPSBbMTZdO1xuICAgIGlmIChjYXJkKSB7XG4gICAgICB1cHBlckxlbmd0aHMgPSBjYXJkLmxlbmd0aDtcbiAgICB9XG4gICAgaWYgKG1heExlbmd0aCkge1xuICAgICAgdXBwZXJMZW5ndGhzID0gdXBwZXJMZW5ndGhzLmZpbHRlcigoeCkgPT4geCA8PSBtYXhMZW5ndGgpO1xuICAgIH1cblxuICAgIC8vIFJldHVybiBpZiBhbiB1cHBlciBsZW5ndGggaGFzIGJlZW4gcmVhY2hlZFxuICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSB1cHBlckxlbmd0aHMubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICB1cHBlckxlbmd0aCA9IHVwcGVyTGVuZ3Roc1tpXTtcbiAgICAgIGlmIChsZW5ndGggPj0gdXBwZXJMZW5ndGggJiYgdXBwZXJMZW5ndGhzW2kgKyAxXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChsZW5ndGggPj0gdXBwZXJMZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBpZiBmb2N1cyBpc24ndCBhdCB0aGUgZW5kIG9mIHRoZSB0ZXh0XG4gICAgaWYgKGhhc1RleHRTZWxlY3RlZCh0YXJnZXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNhcmQgJiYgY2FyZC50eXBlID09PSAnYW1leCcpIHtcbiAgICAgIC8vIEFtZXggY2FyZHMgYXJlIGZvcm1hdHRlZCBkaWZmZXJlbnRseVxuICAgICAgcmUgPSAvXihcXGR7NH18XFxkezR9XFxzXFxkezZ9KSQvO1xuICAgIH0gZWxzZSB7XG4gICAgICByZSA9IC8oPzpefFxccykoXFxkezR9KSQvO1xuICAgIH1cblxuICAgIC8vIElmICc0MjQyJyArIDRcbiAgICBpZiAocmUudGVzdCh2YWx1ZSkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRhcmdldC52YWx1ZSA9IHZhbHVlICsgJyAnICsgZGlnaXQ7XG4gICAgICByZXR1cm4gdHJpZ2dlcih0YXJnZXQsICdjaGFuZ2UnKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH07XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEJhY2tDYXJkTnVtYmVyKGU6IEV2ZW50KTogYm9vbGVhbiB7XG4gIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxEYXRhRWxlbWVudDtcbiAgY29uc3QgdmFsdWUgPSB0YXJnZXQudmFsdWU7XG5cbiAgaWYgKChlIGFzIGFueSkubWV0YSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFJldHVybiB1bmxlc3MgYmFja3NwYWNpbmdcbiAgaWYgKChlIGFzIGFueSkud2hpY2ggIT09IDgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBSZXR1cm4gaWYgZm9jdXMgaXNuJ3QgYXQgdGhlIGVuZCBvZiB0aGUgdGV4dFxuICBpZiAoaGFzVGV4dFNlbGVjdGVkKHRhcmdldCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBSZW1vdmUgdGhlIHRyYWlsaW5nIHNwYWNlXG4gIGlmICgvXFxkXFxzJC8udGVzdCh2YWx1ZSkpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGFyZ2V0LnZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxkXFxzJC8sICcnKTtcbiAgICByZXR1cm4gdHJpZ2dlcih0YXJnZXQsICdjaGFuZ2UnKTtcbiAgfSBlbHNlIGlmICgvXFxzXFxkPyQvLnRlc3QodmFsdWUpKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRhcmdldC52YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xcc1xcZD8kLywgJycpO1xuICAgIHJldHVybiB0cmlnZ2VyKHRhcmdldCwgJ2NoYW5nZScpO1xuICB9XG5cbiAgcmV0dXJuO1xufVxuXG4vLyBGb3JtYXQgRXhwaXJ5XG5cbmZ1bmN0aW9uIGZvcm1hdEV4cGlyeShlOiBFdmVudCk6IGJvb2xlYW4ge1xuICAvLyBPbmx5IGZvcm1hdCBpZiBpbnB1dCBpcyBhIG51bWJlclxuICBjb25zdCBkaWdpdCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGUgYXMgYW55KS53aGljaCk7XG4gIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRGF0YUVsZW1lbnQ7XG4gIGNvbnN0IHZhbCA9IHRhcmdldC52YWx1ZSArIGRpZ2l0O1xuXG4gIGlmICgvXlxcZCQvLnRlc3QodmFsKSAmJiB2YWwgIT09ICcwJyAmJiB2YWwgIT09ICcxJykge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0YXJnZXQudmFsdWUgPSAnMCcgKyB2YWwgKyAnIC8gJztcbiAgICByZXR1cm4gdHJpZ2dlcih0YXJnZXQsICdjaGFuZ2UnKTtcbiAgfSBlbHNlIGlmICgvXlxcZFxcZCQvLnRlc3QodmFsKSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0YXJnZXQudmFsdWUgPSB2YWwgKyAnIC8gJztcbiAgICByZXR1cm4gdHJpZ2dlcih0YXJnZXQsICdjaGFuZ2UnKTtcbiAgfVxuXG4gIHJldHVybjtcbn1cblxuZnVuY3Rpb24gZm9ybWF0TW9udGhFeHBpcnkoZTogRXZlbnQpOiBib29sZWFuIHtcbiAgY29uc3QgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKChlIGFzIGFueSkud2hpY2gpO1xuICBpZiAoIS9eXFxkKyQvLnRlc3QoZGlnaXQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTERhdGFFbGVtZW50O1xuICBjb25zdCB2YWwgPSB0YXJnZXQudmFsdWUgKyBkaWdpdDtcblxuICBpZiAoL15cXGQkLy50ZXN0KHZhbCkgJiYgdmFsICE9PSAnMCcgJiYgdmFsICE9PSAnMScpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGFyZ2V0LnZhbHVlID0gJzAnICsgdmFsO1xuICAgIHJldHVybiB0cmlnZ2VyKHRhcmdldCwgJ2NoYW5nZScpO1xuICB9IGVsc2UgaWYgKC9eXFxkXFxkJC8udGVzdCh2YWwpKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRhcmdldC52YWx1ZSA9IHZhbDtcbiAgICByZXR1cm4gdHJpZ2dlcih0YXJnZXQsICdjaGFuZ2UnKTtcbiAgfVxuXG4gIHJldHVybjtcbn1cblxuZnVuY3Rpb24gZm9ybWF0Rm9yd2FyZEV4cGlyeShlOiBFdmVudCk6IGJvb2xlYW4ge1xuICBjb25zdCBkaWdpdCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGUgYXMgYW55KS53aGljaCk7XG4gIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRGF0YUVsZW1lbnQ7XG4gIGNvbnN0IHZhbCA9IHRhcmdldC52YWx1ZTtcblxuICBpZiAoL15cXGRcXGQkLy50ZXN0KHZhbCkpIHtcbiAgICB0YXJnZXQudmFsdWUgPSB2YWwgKyAnIC8gJztcbiAgICByZXR1cm4gdHJpZ2dlcih0YXJnZXQsICdjaGFuZ2UnKTtcbiAgfVxuXG4gIHJldHVybjtcbn1cblxuZnVuY3Rpb24gZm9ybWF0Rm9yd2FyZFNsYXNoKGU6IEV2ZW50KTogYm9vbGVhbiB7XG4gIGNvbnN0IHNsYXNoID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoZSBhcyBhbnkpLndoaWNoKTtcbiAgaWYgKHNsYXNoICE9PSAnLycpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRGF0YUVsZW1lbnQ7XG4gIGNvbnN0IHZhbCA9IHRhcmdldC52YWx1ZTtcblxuICBpZiAoL15cXGQkLy50ZXN0KHZhbCkgJiYgdmFsICE9PSAnMCcpIHtcbiAgICB0YXJnZXQudmFsdWUgPSAnMCcgKyB2YWwgKyAnIC8gJztcbiAgICByZXR1cm4gdHJpZ2dlcih0YXJnZXQsICdjaGFuZ2UnKTtcbiAgfVxuXG4gIHJldHVybjtcbn1cblxuZnVuY3Rpb24gZm9ybWF0QmFja0V4cGlyeShlOiBFdmVudCk6IGJvb2xlYW4ge1xuICAvLyBJZiBzaGlmdCtiYWNrc3BhY2UgaXMgcHJlc3NlZFxuICBpZiAoKGUgYXMgYW55KS5tZXRhS2V5KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTERhdGFFbGVtZW50O1xuICBjb25zdCB2YWx1ZSA9IHRhcmdldC52YWx1ZTtcblxuICAvLyBSZXR1cm4gdW5sZXNzIGJhY2tzcGFjaW5nXG4gIGlmICgoZSBhcyBhbnkpLndoaWNoICE9PSA4KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gUmV0dXJuIGlmIGZvY3VzIGlzbid0IGF0IHRoZSBlbmQgb2YgdGhlIHRleHRcbiAgaWYgKGhhc1RleHRTZWxlY3RlZCh0YXJnZXQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gUmVtb3ZlIHRoZSB0cmFpbGluZyBzcGFjZVxuICBpZiAoL1xcZChcXHN8XFwvKSskLy50ZXN0KHZhbHVlKSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0YXJnZXQudmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXGQoXFxzfFxcLykqJC8sICcnKTtcbiAgICByZXR1cm4gdHJpZ2dlcih0YXJnZXQsICdjaGFuZ2UnKTtcbiAgfSBlbHNlIGlmICgvXFxzXFwvXFxzP1xcZD8kLy50ZXN0KHZhbHVlKSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0YXJnZXQudmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXHNcXC9cXHM/XFxkPyQvLCAnJyk7XG4gICAgcmV0dXJuIHRyaWdnZXIodGFyZ2V0LCAnY2hhbmdlJyk7XG4gIH1cblxuICByZXR1cm47XG59XG5cbi8vICBSZXN0cmljdGlvbnNcblxuZnVuY3Rpb24gcmVzdHJpY3ROdW1lcmljKGU6IEV2ZW50KTogYm9vbGVhbiB7XG4gIC8vIEtleSBldmVudCBpcyBmb3IgYSBicm93c2VyIHNob3J0Y3V0XG4gIGxldCBpbnB1dDtcbiAgaWYgKChlIGFzIGFueSkubWV0YUtleSB8fCAoZSBhcyBhbnkpLmN0cmxLZXkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIElmIGtleWNvZGUgaXMgYSBzcGFjZVxuICBpZiAoKGUgYXMgYW55KS53aGljaCA9PT0gMzIpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gSWYga2V5Y29kZSBpcyBhIHNwZWNpYWwgY2hhciAoV2ViS2l0KVxuICBpZiAoKGUgYXMgYW55KS53aGljaCA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gSWYgY2hhciBpcyBhIHNwZWNpYWwgY2hhciAoRmlyZWZveClcbiAgaWYgKChlIGFzIGFueSkud2hpY2ggPCAzMykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaW5wdXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKChlIGFzIGFueSkud2hpY2gpO1xuXG4gIC8vIENoYXIgaXMgYSBudW1iZXIgb3IgYSBzcGFjZVxuICBpZiAoIS9bXFxkXFxzXS8udGVzdChpbnB1dCkpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc3RyaWN0Q2FyZE51bWJlcihtYXhMZW5ndGg/OiBudW1iZXIpOiAoRXZlbnQpID0+IHZvaWQge1xuICByZXR1cm4gKGU6IEV2ZW50KSA9PiB7XG4gICAgbGV0IGxlbmd0aDtcblxuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxEYXRhRWxlbWVudDtcbiAgICBjb25zdCBkaWdpdCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGUgYXMgYW55KS53aGljaCk7XG4gICAgaWYgKCEvXlxcZCskLy50ZXN0KGRpZ2l0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChoYXNUZXh0U2VsZWN0ZWQodGFyZ2V0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJlc3RyaWN0IG51bWJlciBvZiBkaWdpdHNcbiAgICBjb25zdCB2YWx1ZSA9ICh0YXJnZXQudmFsdWUgKyBkaWdpdCkucmVwbGFjZSgvXFxEL2csICcnKTtcbiAgICBjb25zdCBjYXJkID0gY2FyZEZyb21OdW1iZXIodmFsdWUpO1xuXG4gICAgbGVuZ3RoID0gMTY7XG4gICAgaWYgKGNhcmQpIHtcbiAgICAgIGxlbmd0aCA9IGNhcmQubGVuZ3RoW2NhcmQubGVuZ3RoLmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICBpZiAobWF4TGVuZ3RoKSB7XG4gICAgICBsZW5ndGggPSBNYXRoLm1pbihsZW5ndGgsIG1heExlbmd0aCk7XG4gICAgfVxuXG4gICAgaWYgKCEodmFsdWUubGVuZ3RoIDw9IGxlbmd0aCkpIHtcbiAgICAgIHJldHVybiBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiByZXN0cmljdEV4cGlyeShlOiBFdmVudCwgbGVuZ3RoOiBudW1iZXIpOiB2b2lkIHtcbiAgbGV0IHZhbHVlO1xuICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRGF0YUVsZW1lbnQ7XG4gIGNvbnN0IGRpZ2l0ID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoZSBhcyBhbnkpLndoaWNoKTtcbiAgaWYgKCEvXlxcZCskLy50ZXN0KGRpZ2l0KSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChoYXNUZXh0U2VsZWN0ZWQodGFyZ2V0KSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhbHVlID0gdGFyZ2V0LnZhbHVlICsgZGlnaXQ7XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxEL2csICcnKTtcblxuICBpZiAodmFsdWUubGVuZ3RoID4gbGVuZ3RoKSB7XG4gICAgcmV0dXJuIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZXN0cmljdENvbWJpbmVkRXhwaXJ5KGU6IEV2ZW50KTogdm9pZCB7XG4gIHJldHVybiByZXN0cmljdEV4cGlyeShlLCA2KTtcbn1cblxuZnVuY3Rpb24gcmVzdHJpY3RNb250aEV4cGlyeShlOiBFdmVudCk6IHZvaWQge1xuICByZXR1cm4gcmVzdHJpY3RFeHBpcnkoZSwgMik7XG59XG5cbmZ1bmN0aW9uIHJlc3RyaWN0WWVhckV4cGlyeShlOiBFdmVudCk6IHZvaWQge1xuICByZXR1cm4gcmVzdHJpY3RFeHBpcnkoZSwgNCk7XG59XG5cbmZ1bmN0aW9uIHJlc3RyaWN0Q1ZDKGU6IEV2ZW50KTogdm9pZCB7XG4gIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxEYXRhRWxlbWVudDtcbiAgY29uc3QgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKChlIGFzIGFueSkud2hpY2gpO1xuICBpZiAoIS9eXFxkKyQvLnRlc3QoZGlnaXQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGhhc1RleHRTZWxlY3RlZCh0YXJnZXQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdmFsID0gdGFyZ2V0LnZhbHVlICsgZGlnaXQ7XG4gIGlmICghKHZhbC5sZW5ndGggPD0gNCkpIHtcbiAgICByZXR1cm4gZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldENhcmRUeXBlKGU6IEV2ZW50KTogYm9vbGVhbiB7XG4gIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxEYXRhRWxlbWVudDtcbiAgY29uc3QgdmFsID0gdGFyZ2V0LnZhbHVlO1xuICBjb25zdCBjYXJkVHlwZSA9IFBheW1lbnQuZm5zLmNhcmRUeXBlKHZhbCkgfHwgJ3Vua25vd24nO1xuXG4gIGlmICh0YXJnZXQgJiYgdGFyZ2V0LmNsYXNzTGlzdCAmJiAhdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhjYXJkVHlwZSkpIHtcbiAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgndW5rbm93bicpO1xuICAgIGNhcmRzLmZvckVhY2goKGNhcmQpID0+IHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKGNhcmQudHlwZSkpO1xuXG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoY2FyZFR5cGUpO1xuXG4gICAgaWYgKGNhcmRUeXBlICE9PSAndW5rbm93bicpIHtcbiAgICAgIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpZGVudGlmaWVkJykpIHtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2lkZW50aWZpZWQnKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2lkZW50aWZpZWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRyaWdnZXIodGFyZ2V0LCAncGF5bWVudC5jYXJkVHlwZScsIGNhcmRUeXBlKTtcbiAgfVxuXG4gIHJldHVybjtcbn1cbiJdfQ==