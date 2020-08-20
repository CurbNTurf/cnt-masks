let cards;
let defaultFormat;
const indexOf = [].indexOf ||
    function (item) {
        for (let i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === item) {
                return i;
            }
        }
        return -1;
    };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NudC1tYXNrcy9zcmMvbGliL2NjL3BheW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBK0JBLElBQUksS0FBb0IsQ0FBQztBQUN6QixJQUFJLGFBQWEsQ0FBQztBQUVsQixNQUFNLE9BQU8sR0FDWCxFQUFFLENBQUMsT0FBTztJQUNWLFVBQXVCLElBQVM7UUFDOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtnQkFDakMsT0FBTyxDQUFDLENBQUM7YUFDVjtTQUNGO1FBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNaLENBQUMsQ0FBQztBQUVKLGFBQWEsR0FBRyxZQUFZLENBQUM7QUFFN0IsS0FBSyxHQUFHO0lBQ047UUFDRSxJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxRQUFRO1FBQ2pCLE1BQU0sRUFBRSwrQkFBK0I7UUFDdkMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ1osU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxFQUFFLElBQUk7S0FDWDtJQUNEO1FBQ0UsSUFBSSxFQUFFLFNBQVM7UUFDZixPQUFPLEVBQUUsT0FBTztRQUNoQixNQUFNLEVBQUUsYUFBYTtRQUNyQixNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDWixTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDZCxJQUFJLEVBQUUsSUFBSTtLQUNYO0lBQ0Q7UUFDRSxJQUFJLEVBQUUsV0FBVztRQUNqQixPQUFPLEVBQUUsdURBQXVEO1FBQ2hFLE1BQU0sRUFBRSxhQUFhO1FBQ3JCLE1B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RyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ3pCLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLFNBQVMsQ0FBQztJQUV4RCxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDdEUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFNUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFL0IsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQzFCLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQzNDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ3BDO1NBQ0Y7YUFBTTtZQUNMLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ3ZDO1FBQ0QsT0FBTyxPQUFPLENBQUMsTUFBTSxFQUFFLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3REO0lBRUQsT0FBTztBQUNULENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBKZXNzZSBQb2xsYWtcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmdcbiAqIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuICogXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4gKiB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4gKiBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0b1xuICogdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG4gKiBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gKiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICogTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuICogTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuICogT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG4gKiBXSVRIIFRIXG4gKi9cbmludGVyZmFjZSBJQ2FyZE9iamVjdCB7XG4gIHR5cGU6IHN0cmluZztcbiAgcGF0dGVybjogUmVnRXhwO1xuICBmb3JtYXQ6IFJlZ0V4cDtcbiAgbGVuZ3RoOiBudW1iZXJbXTtcbiAgY3ZjTGVuZ3RoOiBudW1iZXJbXTtcbiAgbHVobjogYm9vbGVhbjtcbn1cblxubGV0IGNhcmRzOiBJQ2FyZE9iamVjdFtdO1xubGV0IGRlZmF1bHRGb3JtYXQ7XG5cbmNvbnN0IGluZGV4T2YgPVxuICBbXS5pbmRleE9mIHx8XG4gIGZ1bmN0aW9uICh0aGlzOiBhbnlbXSwgaXRlbTogYW55KTogbnVtYmVyIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAtMTtcbiAgfTtcblxuZGVmYXVsdEZvcm1hdCA9IC8oXFxkezEsNH0pL2c7XG5cbmNhcmRzID0gW1xuICB7XG4gICAgdHlwZTogJ2FtZXgnLFxuICAgIHBhdHRlcm46IC9eM1s0N10vLFxuICAgIGZvcm1hdDogLyhcXGR7MSw0fSkoXFxkezEsNn0pPyhcXGR7MSw1fSk/LyxcbiAgICBsZW5ndGg6IFsxNV0sXG4gICAgY3ZjTGVuZ3RoOiBbNF0sXG4gICAgbHVobjogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdkYW5rb3J0JyxcbiAgICBwYXR0ZXJuOiAvXjUwMTkvLFxuICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICBsZW5ndGg6IFsxNl0sXG4gICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgbHVobjogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdoaXBlcmNhcmQnLFxuICAgIHBhdHRlcm46IC9eKDM4NDEwMHwzODQxNDB8Mzg0MTYwfDYwNjI4Mnw2MzcwOTV8NjM3NTY4fDYwKD8hMTEpKS8sXG4gICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgIGxlbmd0aDogWzE0LCAxNSwgMTYsIDE3LCAxOCwgMTldLFxuICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgIGx1aG46IHRydWUsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnZGluZXJzY2x1YicsXG4gICAgcGF0dGVybjogL14oMzZ8Mzh8MzBbMC01XSkvLFxuICAgIGZvcm1hdDogLyhcXGR7MSw0fSkoXFxkezEsNn0pPyhcXGR7MSw0fSk/LyxcbiAgICBsZW5ndGg6IFsxNF0sXG4gICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgbHVobjogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdkaXNjb3ZlcicsXG4gICAgcGF0dGVybjogL14oNjAxMXw2NXw2NFs0LTldfDYyMikvLFxuICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICBsZW5ndGg6IFsxNl0sXG4gICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgbHVobjogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdqY2InLFxuICAgIHBhdHRlcm46IC9eMzUvLFxuICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICBsZW5ndGg6IFsxNl0sXG4gICAgY3ZjTGVuZ3RoOiBbM10sXG4gICAgbHVobjogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdsYXNlcicsXG4gICAgcGF0dGVybjogL14oNjcwNnw2NzcxfDY3MDkpLyxcbiAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgbGVuZ3RoOiBbMTYsIDE3LCAxOCwgMTldLFxuICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgIGx1aG46IHRydWUsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnbWFlc3RybycsXG4gICAgcGF0dGVybjogL14oNTAxOHw1MDIwfDUwMzh8NjMwNHw2NzAzfDY3MDh8Njc1OXw2NzZbMS0zXSkvLFxuICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICBsZW5ndGg6IFsxMiwgMTMsIDE0LCAxNSwgMTYsIDE3LCAxOCwgMTldLFxuICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgIGx1aG46IHRydWUsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnbWFzdGVyY2FyZCcsXG4gICAgcGF0dGVybjogL14oNVsxLTVdfDY3NzE4OSl8XigyMjJbMS05XXwyWzMtNl1cXGR7Mn18MjdbMC0xXVxcZHwyNzIwKS8sXG4gICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgIGxlbmd0aDogWzE2XSxcbiAgICBjdmNMZW5ndGg6IFszXSxcbiAgICBsdWhuOiB0cnVlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ3VuaW9ucGF5JyxcbiAgICBwYXR0ZXJuOiAvXjYyLyxcbiAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgbGVuZ3RoOiBbMTYsIDE3LCAxOCwgMTldLFxuICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgIGx1aG46IGZhbHNlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ3Zpc2FlbGVjdHJvbicsXG4gICAgcGF0dGVybjogL140KDAyNnwxNzUwMHw0MDV8NTA4fDg0NHw5MVszN10pLyxcbiAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgbGVuZ3RoOiBbMTZdLFxuICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgIGx1aG46IHRydWUsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnZWxvJyxcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgcGF0dGVybjogL14oNDAxMSg3OHw3OSl8NDMoMTI3NHw4OTM1KXw0NSgxNDE2fDczOTN8NzYzKDF8MikpfDUwKDQxNzV8NjY5OXw2N1swLTddWzAtOV18OTAwMCl8NjI3NzgwfDYzKDYyOTd8NjM2OCl8NjUwKDAzKFteNF0pfDA0KFswLTldKXwwNSgwfDEpfDQoMFs1LTldfDNbMC05XXw4WzUtOV18OVswLTldKXw1KFswLTJdWzAtOV18M1swLThdKXw5KFsyLTZdWzAtOV18N1swLThdKXw1NDF8NzAwfDcyMHw5MDEpfDY1MTY1Mnw2NTUwMDB8NjU1MDIxKS8sXG4gICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgIGxlbmd0aDogWzE2XSxcbiAgICBjdmNMZW5ndGg6IFszXSxcbiAgICBsdWhuOiB0cnVlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ3Zpc2EnLFxuICAgIHBhdHRlcm46IC9eNC8sXG4gICAgZm9ybWF0OiBkZWZhdWx0Rm9ybWF0LFxuICAgIGxlbmd0aDogWzEzLCAxNiwgMTldLFxuICAgIGN2Y0xlbmd0aDogWzNdLFxuICAgIGx1aG46IHRydWUsXG4gIH0sXG5dO1xuXG5mdW5jdGlvbiBjYXJkRnJvbU51bWJlcihudW06IHN0cmluZyk6IGFueSB7XG4gIGxldCBjYXJkO1xuICBsZXQgaTtcbiAgbGV0IGxlbjtcbiAgY29uc3QgbnVtU3RyaW5nID0gKG51bSArICcnKS5yZXBsYWNlKC9cXEQvZywgJycpO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBjYXJkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGNhcmQgPSBjYXJkc1tpXTtcbiAgICBpZiAoY2FyZC5wYXR0ZXJuLnRlc3QobnVtU3RyaW5nKSkge1xuICAgICAgcmV0dXJuIGNhcmQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuO1xufVxuXG5mdW5jdGlvbiBjYXJkRnJvbVR5cGUodHlwZTogc3RyaW5nKTogYW55IHtcbiAgbGV0IGNhcmQ7XG4gIGxldCBpO1xuICBsZXQgbGVuO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBjYXJkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGNhcmQgPSBjYXJkc1tpXTtcbiAgICBpZiAoY2FyZC50eXBlID09PSB0eXBlKSB7XG4gICAgICByZXR1cm4gY2FyZDtcbiAgICB9XG4gIH1cblxuICByZXR1cm47XG59XG5cbmZ1bmN0aW9uIGx1aG5DaGVjayhudW06IHN0cmluZyk6IGJvb2xlYW4ge1xuICBsZXQgZGlnaXRzO1xuICBsZXQgb2RkID0gdHJ1ZTtcbiAgbGV0IHN1bSA9IDA7XG5cbiAgZGlnaXRzID0gKG51bSArICcnKS5zcGxpdCgnJykucmV2ZXJzZSgpO1xuXG4gIGRpZ2l0cy5mb3JFYWNoKChkaWdpdFN0cmluZykgPT4ge1xuICAgIGxldCBkaWdpdCA9IHBhcnNlSW50KGRpZ2l0U3RyaW5nLCAxMCk7XG4gICAgb2RkID0gIW9kZDtcbiAgICBpZiAob2RkKSB7XG4gICAgICBkaWdpdCAqPSAyO1xuICAgIH1cbiAgICBpZiAoZGlnaXQgPiA5KSB7XG4gICAgICBkaWdpdCAtPSA5O1xuICAgIH1cbiAgICByZXR1cm4gKHN1bSArPSBkaWdpdCk7XG4gIH0pO1xuXG4gIHJldHVybiBzdW0gJSAxMCA9PT0gMDtcbn1cblxuZnVuY3Rpb24gaGFzVGV4dFNlbGVjdGVkKHRhcmdldD86IEV2ZW50VGFyZ2V0KTogYm9vbGVhbiB7XG4gIGxldCBlO1xuICB0cnkge1xuICAgIC8vIElmIHNvbWUgdGV4dCBpcyBzZWxlY3RlZFxuICAgIGlmIChcbiAgICAgIHRhcmdldCAmJlxuICAgICAgKHRhcmdldCBhcyBhbnkpLnNlbGVjdGlvblN0YXJ0ICE9IG51bGwgJiZcbiAgICAgICh0YXJnZXQgYXMgYW55KS5zZWxlY3Rpb25TdGFydCAhPT0gKHRhcmdldCBhcyBhbnkpLnNlbGVjdGlvbkVuZFxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gcWpvbihcbiAgZWxlbWVudDogRWxlbWVudCB8IGFueSxcbiAgZXZlbnROYW1lOiBzdHJpbmcsXG4gIGNhbGxiYWNrOiAoZTogRXZlbnQpID0+IHZvaWRcbik6IGFueSB7XG4gIGlmIChlbGVtZW50Lmxlbmd0aCkge1xuICAgIC8vIGhhbmRsZSBtdWx0aXBsZSBlbGVtZW50c1xuICAgIGZvciAoY29uc3QgZWwgb2YgQXJyYXkuZnJvbShlbGVtZW50KSkge1xuICAgICAgcWpvbihlbCwgZXZlbnROYW1lLCBjYWxsYmFjayk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChldmVudE5hbWUubWF0Y2goJyAnKSkge1xuICAgIC8vIGhhbmRsZSBtdWx0aXBsZSBldmVudCBhdHRhY2htZW50XG4gICAgZm9yIChjb25zdCBtdWx0aUV2ZW50TmFtZSBvZiBBcnJheS5mcm9tKGV2ZW50TmFtZS5zcGxpdCgnICcpKSkge1xuICAgICAgcWpvbihlbGVtZW50LCBtdWx0aUV2ZW50TmFtZSwgY2FsbGJhY2spO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrLCBmYWxzZSk7XG4gIH1cblxuICBpZiAoZWxlbWVudC5hdHRhY2hFdmVudCkge1xuICAgIGV2ZW50TmFtZSA9ICdvbicgKyBldmVudE5hbWU7XG4gICAgcmV0dXJuIGVsZW1lbnQuYXR0YWNoRXZlbnQoZXZlbnROYW1lLCBjYWxsYmFjayk7XG4gIH1cblxuICBlbGVtZW50WydvbicgKyBldmVudE5hbWVdID0gY2FsbGJhY2s7XG59XG5cbmZ1bmN0aW9uIHRyaWdnZXIoZWw6IEVsZW1lbnQsIG5hbWU6IHN0cmluZywgZGF0YT86IGFueSk6IGJvb2xlYW4ge1xuICBsZXQgZXY7XG5cbiAgdHJ5IHtcbiAgICBldiA9IG5ldyBDdXN0b21FdmVudChuYW1lLCB7IGRldGFpbDogZGF0YSB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGV2ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gICAgLy8ganNkb20gZG9lc24ndCBoYXZlIGluaXRDdXN0b21FdmVudCwgc28gd2UgbmVlZCB0aGlzIGNoZWNrIGZvclxuICAgIC8vIHRlc3RpbmdcbiAgICBpZiAoZXYuaW5pdEN1c3RvbUV2ZW50KSB7XG4gICAgICBldi5pbml0Q3VzdG9tRXZlbnQobmFtZSwgdHJ1ZSwgdHJ1ZSwgZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIChldiBhcyBhbnkpLmluaXRFdmVudChuYW1lLCB0cnVlLCB0cnVlLCBkYXRhKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZWwuZGlzcGF0Y2hFdmVudChldik7XG59XG5cbi8vIFB1YmxpY1xuLy8gQGR5bmFtaWNcbmV4cG9ydCBjbGFzcyBQYXltZW50IHtcbiAgcHVibGljIHN0YXRpYyBmbnMgPSB7XG4gICAgY2FyZEV4cGlyeVZhbDogKHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgIGxldCBtb250aDtcbiAgICAgIGxldCBwcmVmaXg7XG4gICAgICBsZXQgeWVhcjtcbiAgICAgIGxldCByZWY7XG5cbiAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxzL2csICcnKTtcbiAgICAgIChyZWYgPSB2YWx1ZS5zcGxpdCgnLycsIDIpKSwgKG1vbnRoID0gcmVmWzBdKSwgKHllYXIgPSByZWZbMV0pO1xuXG4gICAgICAvLyBBbGxvdyBmb3IgeWVhciBzaG9ydGN1dFxuICAgICAgaWYgKCh5ZWFyICE9IG51bGwgPyB5ZWFyLmxlbmd0aCA6IHZvaWQgMCkgPT09IDIgJiYgL15cXGQrJC8udGVzdCh5ZWFyKSkge1xuICAgICAgICBwcmVmaXggPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIHByZWZpeCA9IHByZWZpeC50b1N0cmluZygpLnNsaWNlKDAsIDIpO1xuICAgICAgICB5ZWFyID0gcHJlZml4ICsgeWVhcjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbW9udGgsXG4gICAgICAgIHllYXIsXG4gICAgICB9O1xuICAgIH0sXG4gICAgdmFsaWRhdGVDYXJkTnVtYmVyOiAobnVtOiBzdHJpbmcpID0+IHtcbiAgICAgIGxldCBjYXJkO1xuICAgICAgbGV0IHJlZjtcblxuICAgICAgbnVtID0gKG51bSArICcnKS5yZXBsYWNlKC9cXHMrfC0vZywgJycpO1xuICAgICAgaWYgKCEvXlxcZCskLy50ZXN0KG51bSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBjYXJkID0gY2FyZEZyb21OdW1iZXIobnVtKTtcbiAgICAgIGlmICghY2FyZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgICgocmVmID0gbnVtLmxlbmd0aCksIGluZGV4T2YuY2FsbChjYXJkLmxlbmd0aCwgcmVmKSA+PSAwKSAmJlxuICAgICAgICAoY2FyZC5sdWhuID09PSBmYWxzZSB8fCBsdWhuQ2hlY2sobnVtKSlcbiAgICAgICk7XG4gICAgfSxcbiAgICB2YWxpZGF0ZUNhcmRFeHBpcnk6IChtb250aDogc3RyaW5nLCB5ZWFyOiBzdHJpbmcpID0+IHtcbiAgICAgIC8vIEFsbG93IHBhc3NpbmcgYW4gb2JqZWN0XG4gICAgICBsZXQgY3VycmVudFRpbWU7XG4gICAgICBsZXQgZXhwaXJ5O1xuICAgICAgbGV0IHByZWZpeDtcbiAgICAgIGxldCByZWYxO1xuXG4gICAgICBpZiAodHlwZW9mIG1vbnRoID09PSAnc3RyaW5nJyAmJiBpbmRleE9mLmNhbGwobW9udGgsICcvJykgPj0gMCkge1xuICAgICAgICAocmVmMSA9IFBheW1lbnQuZm5zLmNhcmRFeHBpcnlWYWwobW9udGgpKSxcbiAgICAgICAgICAobW9udGggPSByZWYxLm1vbnRoKSxcbiAgICAgICAgICAoeWVhciA9IHJlZjEueWVhcik7XG4gICAgICB9XG5cbiAgICAgIGlmICghKG1vbnRoICYmIHllYXIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgbW9udGggPSBtb250aC50cmltKCk7XG4gICAgICB5ZWFyID0geWVhci50cmltKCk7XG5cbiAgICAgIGlmICghL15cXGQrJC8udGVzdChtb250aCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKCEvXlxcZCskLy50ZXN0KHllYXIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbW9udGhJbnQgPSBwYXJzZUludChtb250aCwgMTApO1xuXG4gICAgICBpZiAoIShtb250aEludCAmJiBtb250aEludCA8PSAxMikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoeWVhci5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgcHJlZml4ID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICAgICAgICBwcmVmaXggPSBwcmVmaXgudG9TdHJpbmcoKS5zbGljZSgwLCAyKTtcbiAgICAgICAgeWVhciA9IHByZWZpeCArIHllYXI7XG4gICAgICB9XG5cbiAgICAgIGV4cGlyeSA9IG5ldyBEYXRlKHBhcnNlSW50KHllYXIsIDEwKSwgbW9udGhJbnQpO1xuICAgICAgY3VycmVudFRpbWUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAvLyBNb250aHMgc3RhcnQgZnJvbSAwIGluIEphdmFTY3JpcHRcbiAgICAgIGV4cGlyeS5zZXRNb250aChleHBpcnkuZ2V0TW9udGgoKSAtIDEpO1xuXG4gICAgICAvLyBUaGUgY2MgZXhwaXJlcyBhdCB0aGUgZW5kIG9mIHRoZSBtb250aCxcbiAgICAgIC8vIHNvIHdlIG5lZWQgdG8gbWFrZSB0aGUgZXhwaXJ5IHRoZSBmaXJzdCBkYXlcbiAgICAgIC8vIG9mIHRoZSBtb250aCBhZnRlclxuICAgICAgZXhwaXJ5LnNldE1vbnRoKGV4cGlyeS5nZXRNb250aCgpICsgMSwgMSk7XG5cbiAgICAgIHJldHVybiBleHBpcnkgPiBjdXJyZW50VGltZTtcbiAgICB9LFxuICAgIHZhbGlkYXRlQ2FyZENWQzogKGN2Yzogc3RyaW5nLCB0eXBlPzogc3RyaW5nKSA9PiB7XG4gICAgICBsZXQgcmVmO1xuICAgICAgbGV0IHJlZjE7XG5cbiAgICAgIGN2YyA9IGN2Yy50cmltKCk7XG4gICAgICBpZiAoIS9eXFxkKyQvLnRlc3QoY3ZjKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlICYmIGNhcmRGcm9tVHlwZSh0eXBlKSkge1xuICAgICAgICAvLyBDaGVjayBhZ2FpbnN0IGEgZXhwbGljaXQgY2FyZCB0eXBlXG4gICAgICAgIHJlZjEgPSBjYXJkRnJvbVR5cGUodHlwZSk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgKHJlZiA9IGN2Yy5sZW5ndGgpLFxuICAgICAgICAgIGluZGV4T2YuY2FsbChyZWYxICE9IG51bGwgPyByZWYxLmN2Y0xlbmd0aCA6IHZvaWQgMCwgcmVmKSA+PSAwXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDaGVjayBhZ2FpbnN0IGFsbCB0eXBlc1xuICAgICAgICByZXR1cm4gY3ZjLmxlbmd0aCA+PSAzICYmIGN2Yy5sZW5ndGggPD0gNDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNhcmRUeXBlOiAobnVtOiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICghbnVtKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgY29uc3QgcmVmID0gY2FyZEZyb21OdW1iZXIobnVtKTtcbiAgICAgIHJldHVybiAocmVmICE9IG51bGwgPyByZWYudHlwZSA6IHZvaWQgMCkgfHwgbnVsbDtcbiAgICB9LFxuICAgIGZvcm1hdENhcmROdW1iZXI6IChudW06IHN0cmluZykgPT4ge1xuICAgICAgbGV0IGNhcmQ7XG4gICAgICBsZXQgZ3JvdXBzO1xuICAgICAgbGV0IHVwcGVyTGVuZ3RoO1xuXG4gICAgICBjYXJkID0gY2FyZEZyb21OdW1iZXIobnVtKTtcbiAgICAgIGlmICghY2FyZCkge1xuICAgICAgICByZXR1cm4gbnVtO1xuICAgICAgfVxuXG4gICAgICB1cHBlckxlbmd0aCA9IGNhcmQubGVuZ3RoW2NhcmQubGVuZ3RoLmxlbmd0aCAtIDFdO1xuXG4gICAgICBudW0gPSBudW0ucmVwbGFjZSgvXFxEL2csICcnKTtcbiAgICAgIG51bSA9IG51bS5zbGljZSgwLCB1cHBlckxlbmd0aCk7XG5cbiAgICAgIGlmIChjYXJkLmZvcm1hdC5nbG9iYWwpIHtcbiAgICAgICAgY29uc3QgcmVmID0gbnVtLm1hdGNoKGNhcmQuZm9ybWF0KTtcbiAgICAgICAgcmV0dXJuIHJlZiAhPSBudWxsID8gcmVmLmpvaW4oJyAnKSA6IHZvaWQgMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdyb3VwcyA9IGNhcmQuZm9ybWF0LmV4ZWMobnVtKTtcbiAgICAgICAgaWYgKGdyb3VwcyA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGdyb3Vwcy5zaGlmdCgpO1xuICAgICAgICBncm91cHMgPSBncm91cHMuZmlsdGVyKChuKSA9PiBuKTsgLy8gRmlsdGVyIGVtcHR5IGdyb3Vwc1xuICAgICAgICByZXR1cm4gZ3JvdXBzLmpvaW4oJyAnKTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xuXG4gIHB1YmxpYyBzdGF0aWMgcmVzdHJpY3ROdW1lcmljKGVsOiBFbGVtZW50KTogYW55IHtcbiAgICByZXR1cm4gcWpvbihlbCwgJ2tleXByZXNzJywgcmVzdHJpY3ROdW1lcmljKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZm9ybWF0Q2FyZENWQyhlbDogRWxlbWVudCk6IEVsZW1lbnQge1xuICAgIFBheW1lbnQucmVzdHJpY3ROdW1lcmljKGVsKTtcbiAgICBxam9uKGVsLCAna2V5cHJlc3MnLCByZXN0cmljdENWQyk7XG4gICAgcmV0dXJuIGVsO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBmb3JtYXRDYXJkRXhwaXJ5KGVsOiBFbGVtZW50KTogRWxlbWVudCB7XG4gICAgbGV0IG1vbnRoO1xuICAgIGxldCB5ZWFyO1xuXG4gICAgUGF5bWVudC5yZXN0cmljdE51bWVyaWMoZWwpO1xuICAgIGlmICgoZWwgYXMgYW55KS5sZW5ndGggJiYgKGVsIGFzIGFueSkubGVuZ3RoID09PSAyKSB7XG4gICAgICAobW9udGggPSAoZWwgYXMgYW55KVswXSksICh5ZWFyID0gKGVsIGFzIGFueSlbMV0pO1xuICAgICAgdGhpcy5mb3JtYXRDYXJkRXhwaXJ5TXVsdGlwbGUobW9udGgsIHllYXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBxam9uKGVsLCAna2V5cHJlc3MnLCByZXN0cmljdENvbWJpbmVkRXhwaXJ5KTtcbiAgICAgIHFqb24oZWwsICdrZXlwcmVzcycsIGZvcm1hdEV4cGlyeSk7XG4gICAgICBxam9uKGVsLCAna2V5cHJlc3MnLCBmb3JtYXRGb3J3YXJkU2xhc2gpO1xuICAgICAgcWpvbihlbCwgJ2tleXByZXNzJywgZm9ybWF0Rm9yd2FyZEV4cGlyeSk7XG4gICAgICBxam9uKGVsLCAna2V5ZG93bicsIGZvcm1hdEJhY2tFeHBpcnkpO1xuICAgIH1cbiAgICByZXR1cm4gZWw7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGZvcm1hdENhcmRFeHBpcnlNdWx0aXBsZShtb250aDogc3RyaW5nLCB5ZWFyOiBzdHJpbmcpOiBhbnkge1xuICAgIHFqb24obW9udGgsICdrZXlwcmVzcycsIHJlc3RyaWN0TW9udGhFeHBpcnkpO1xuICAgIHFqb24obW9udGgsICdrZXlwcmVzcycsIGZvcm1hdE1vbnRoRXhwaXJ5KTtcbiAgICByZXR1cm4gcWpvbih5ZWFyLCAna2V5cHJlc3MnLCByZXN0cmljdFllYXJFeHBpcnkpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBmb3JtYXRDYXJkTnVtYmVyKGVsOiBFbGVtZW50LCBtYXhMZW5ndGg/OiBudW1iZXIpOiBFbGVtZW50IHtcbiAgICBQYXltZW50LnJlc3RyaWN0TnVtZXJpYyhlbCk7XG4gICAgcWpvbihlbCwgJ2tleXByZXNzJywgcmVzdHJpY3RDYXJkTnVtYmVyKG1heExlbmd0aCkpO1xuICAgIHFqb24oZWwsICdrZXlwcmVzcycsIGZvcm1hdENhcmROdW1iZXIobWF4TGVuZ3RoKSk7XG4gICAgcWpvbihlbCwgJ2tleWRvd24nLCBmb3JtYXRCYWNrQ2FyZE51bWJlcik7XG4gICAgcWpvbihlbCwgJ2tleXVwIGJsdXInLCBzZXRDYXJkVHlwZSk7XG4gICAgcWpvbihlbCwgJ3Bhc3RlJywgcmVGb3JtYXRDYXJkTnVtYmVyKTtcbiAgICBxam9uKGVsLCAnaW5wdXQnLCByZUZvcm1hdENhcmROdW1iZXIpO1xuICAgIHJldHVybiBlbDtcbiAgfVxufVxuLy8gUHJpdmF0ZVxuXG4vLyBGb3JtYXQgQ2FyZCBOdW1iZXJcblxuZnVuY3Rpb24gcmVGb3JtYXRDYXJkTnVtYmVyKGU6IEV2ZW50KTogbnVtYmVyIHtcbiAgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGxldCB2YWx1ZTtcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRGF0YUVsZW1lbnQ7XG5cbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhbHVlID0gdGFyZ2V0LnZhbHVlO1xuICAgIHZhbHVlID0gUGF5bWVudC5mbnMuZm9ybWF0Q2FyZE51bWJlcih2YWx1ZSk7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0YXJnZXQudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRyaWdnZXIodGFyZ2V0LCAnY2hhbmdlJyk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRDYXJkTnVtYmVyKG1heExlbmd0aD86IG51bWJlcik6IChldmVudCkgPT4gYm9vbGVhbiB7XG4gIHJldHVybiAoZTogRXZlbnQpID0+IHtcbiAgICAvLyBPbmx5IGZvcm1hdCBpZiBpbnB1dCBpcyBhIG51bWJlclxuICAgIGxldCBjYXJkO1xuICAgIGxldCBkaWdpdDtcbiAgICBsZXQgaTtcbiAgICBsZXQgbGVuZ3RoO1xuICAgIGxldCByZTtcbiAgICBsZXQgdGFyZ2V0O1xuICAgIGxldCB1cHBlckxlbmd0aDtcbiAgICBsZXQgdXBwZXJMZW5ndGhzO1xuICAgIGxldCB2YWx1ZTtcbiAgICBsZXQgajtcbiAgICBsZXQgbGVuO1xuICAgIGRpZ2l0ID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoZSBhcyBhbnkpLndoaWNoKTtcbiAgICBpZiAoIS9eXFxkKyQvLnRlc3QoZGlnaXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTERhdGFFbGVtZW50O1xuICAgIHZhbHVlID0gdGFyZ2V0LnZhbHVlO1xuICAgIGNhcmQgPSBjYXJkRnJvbU51bWJlcih2YWx1ZSArIGRpZ2l0KTtcbiAgICBsZW5ndGggPSAodmFsdWUucmVwbGFjZSgvXFxEL2csICcnKSArIGRpZ2l0KS5sZW5ndGg7XG5cbiAgICB1cHBlckxlbmd0aHMgPSBbMTZdO1xuICAgIGlmIChjYXJkKSB7XG4gICAgICB1cHBlckxlbmd0aHMgPSBjYXJkLmxlbmd0aDtcbiAgICB9XG4gICAgaWYgKG1heExlbmd0aCkge1xuICAgICAgdXBwZXJMZW5ndGhzID0gdXBwZXJMZW5ndGhzLmZpbHRlcigoeCkgPT4geCA8PSBtYXhMZW5ndGgpO1xuICAgIH1cblxuICAgIC8vIFJldHVybiBpZiBhbiB1cHBlciBsZW5ndGggaGFzIGJlZW4gcmVhY2hlZFxuICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSB1cHBlckxlbmd0aHMubGVuZ3RoOyBqIDwgbGVuOyBpID0gKytqKSB7XG4gICAgICB1cHBlckxlbmd0aCA9IHVwcGVyTGVuZ3Roc1tpXTtcbiAgICAgIGlmIChsZW5ndGggPj0gdXBwZXJMZW5ndGggJiYgdXBwZXJMZW5ndGhzW2kgKyAxXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChsZW5ndGggPj0gdXBwZXJMZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBpZiBmb2N1cyBpc24ndCBhdCB0aGUgZW5kIG9mIHRoZSB0ZXh0XG4gICAgaWYgKGhhc1RleHRTZWxlY3RlZCh0YXJnZXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNhcmQgJiYgY2FyZC50eXBlID09PSAnYW1leCcpIHtcbiAgICAgIC8vIEFtZXggY2FyZHMgYXJlIGZvcm1hdHRlZCBkaWZmZXJlbnRseVxuICAgICAgcmUgPSAvXihcXGR7NH18XFxkezR9XFxzXFxkezZ9KSQvO1xuICAgIH0gZWxzZSB7XG4gICAgICByZSA9IC8oPzpefFxccykoXFxkezR9KSQvO1xuICAgIH1cblxuICAgIC8vIElmICc0MjQyJyArIDRcbiAgICBpZiAocmUudGVzdCh2YWx1ZSkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRhcmdldC52YWx1ZSA9IHZhbHVlICsgJyAnICsgZGlnaXQ7XG4gICAgICByZXR1cm4gdHJpZ2dlcih0YXJnZXQsICdjaGFuZ2UnKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH07XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEJhY2tDYXJkTnVtYmVyKGU6IEV2ZW50KTogYm9vbGVhbiB7XG4gIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxEYXRhRWxlbWVudDtcbiAgY29uc3QgdmFsdWUgPSB0YXJnZXQudmFsdWU7XG5cbiAgaWYgKChlIGFzIGFueSkubWV0YSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFJldHVybiB1bmxlc3MgYmFja3NwYWNpbmdcbiAgaWYgKChlIGFzIGFueSkud2hpY2ggIT09IDgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBSZXR1cm4gaWYgZm9jdXMgaXNuJ3QgYXQgdGhlIGVuZCBvZiB0aGUgdGV4dFxuICBpZiAoaGFzVGV4dFNlbGVjdGVkKHRhcmdldCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBSZW1vdmUgdGhlIHRyYWlsaW5nIHNwYWNlXG4gIGlmICgvXFxkXFxzJC8udGVzdCh2YWx1ZSkpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGFyZ2V0LnZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxkXFxzJC8sICcnKTtcbiAgICByZXR1cm4gdHJpZ2dlcih0YXJnZXQsICdjaGFuZ2UnKTtcbiAgfSBlbHNlIGlmICgvXFxzXFxkPyQvLnRlc3QodmFsdWUpKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRhcmdldC52YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xcc1xcZD8kLywgJycpO1xuICAgIHJldHVybiB0cmlnZ2VyKHRhcmdldCwgJ2NoYW5nZScpO1xuICB9XG5cbiAgcmV0dXJuO1xufVxuXG4vLyBGb3JtYXQgRXhwaXJ5XG5cbmZ1bmN0aW9uIGZvcm1hdEV4cGlyeShlOiBFdmVudCk6IGJvb2xlYW4ge1xuICAvLyBPbmx5IGZvcm1hdCBpZiBpbnB1dCBpcyBhIG51bWJlclxuICBjb25zdCBkaWdpdCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGUgYXMgYW55KS53aGljaCk7XG4gIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRGF0YUVsZW1lbnQ7XG4gIGNvbnN0IHZhbCA9IHRhcmdldC52YWx1ZSArIGRpZ2l0O1xuXG4gIGlmICgvXlxcZCQvLnRlc3QodmFsKSAmJiB2YWwgIT09ICcwJyAmJiB2YWwgIT09ICcxJykge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0YXJnZXQudmFsdWUgPSAnMCcgKyB2YWwgKyAnIC8gJztcbiAgICByZXR1cm4gdHJpZ2dlcih0YXJnZXQsICdjaGFuZ2UnKTtcbiAgfSBlbHNlIGlmICgvXlxcZFxcZCQvLnRlc3QodmFsKSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0YXJnZXQudmFsdWUgPSB2YWwgKyAnIC8gJztcbiAgICByZXR1cm4gdHJpZ2dlcih0YXJnZXQsICdjaGFuZ2UnKTtcbiAgfVxuXG4gIHJldHVybjtcbn1cblxuZnVuY3Rpb24gZm9ybWF0TW9udGhFeHBpcnkoZTogRXZlbnQpOiBib29sZWFuIHtcbiAgY29uc3QgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKChlIGFzIGFueSkud2hpY2gpO1xuICBpZiAoIS9eXFxkKyQvLnRlc3QoZGlnaXQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTERhdGFFbGVtZW50O1xuICBjb25zdCB2YWwgPSB0YXJnZXQudmFsdWUgKyBkaWdpdDtcblxuICBpZiAoL15cXGQkLy50ZXN0KHZhbCkgJiYgdmFsICE9PSAnMCcgJiYgdmFsICE9PSAnMScpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGFyZ2V0LnZhbHVlID0gJzAnICsgdmFsO1xuICAgIHJldHVybiB0cmlnZ2VyKHRhcmdldCwgJ2NoYW5nZScpO1xuICB9IGVsc2UgaWYgKC9eXFxkXFxkJC8udGVzdCh2YWwpKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRhcmdldC52YWx1ZSA9IHZhbDtcbiAgICByZXR1cm4gdHJpZ2dlcih0YXJnZXQsICdjaGFuZ2UnKTtcbiAgfVxuXG4gIHJldHVybjtcbn1cblxuZnVuY3Rpb24gZm9ybWF0Rm9yd2FyZEV4cGlyeShlOiBFdmVudCk6IGJvb2xlYW4ge1xuICBjb25zdCBkaWdpdCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGUgYXMgYW55KS53aGljaCk7XG4gIGlmICghL15cXGQrJC8udGVzdChkaWdpdCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRGF0YUVsZW1lbnQ7XG4gIGNvbnN0IHZhbCA9IHRhcmdldC52YWx1ZTtcblxuICBpZiAoL15cXGRcXGQkLy50ZXN0KHZhbCkpIHtcbiAgICB0YXJnZXQudmFsdWUgPSB2YWwgKyAnIC8gJztcbiAgICByZXR1cm4gdHJpZ2dlcih0YXJnZXQsICdjaGFuZ2UnKTtcbiAgfVxuXG4gIHJldHVybjtcbn1cblxuZnVuY3Rpb24gZm9ybWF0Rm9yd2FyZFNsYXNoKGU6IEV2ZW50KTogYm9vbGVhbiB7XG4gIGNvbnN0IHNsYXNoID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoZSBhcyBhbnkpLndoaWNoKTtcbiAgaWYgKHNsYXNoICE9PSAnLycpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRGF0YUVsZW1lbnQ7XG4gIGNvbnN0IHZhbCA9IHRhcmdldC52YWx1ZTtcblxuICBpZiAoL15cXGQkLy50ZXN0KHZhbCkgJiYgdmFsICE9PSAnMCcpIHtcbiAgICB0YXJnZXQudmFsdWUgPSAnMCcgKyB2YWwgKyAnIC8gJztcbiAgICByZXR1cm4gdHJpZ2dlcih0YXJnZXQsICdjaGFuZ2UnKTtcbiAgfVxuXG4gIHJldHVybjtcbn1cblxuZnVuY3Rpb24gZm9ybWF0QmFja0V4cGlyeShlOiBFdmVudCk6IGJvb2xlYW4ge1xuICAvLyBJZiBzaGlmdCtiYWNrc3BhY2UgaXMgcHJlc3NlZFxuICBpZiAoKGUgYXMgYW55KS5tZXRhS2V5KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTERhdGFFbGVtZW50O1xuICBjb25zdCB2YWx1ZSA9IHRhcmdldC52YWx1ZTtcblxuICAvLyBSZXR1cm4gdW5sZXNzIGJhY2tzcGFjaW5nXG4gIGlmICgoZSBhcyBhbnkpLndoaWNoICE9PSA4KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gUmV0dXJuIGlmIGZvY3VzIGlzbid0IGF0IHRoZSBlbmQgb2YgdGhlIHRleHRcbiAgaWYgKGhhc1RleHRTZWxlY3RlZCh0YXJnZXQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gUmVtb3ZlIHRoZSB0cmFpbGluZyBzcGFjZVxuICBpZiAoL1xcZChcXHN8XFwvKSskLy50ZXN0KHZhbHVlKSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0YXJnZXQudmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXGQoXFxzfFxcLykqJC8sICcnKTtcbiAgICByZXR1cm4gdHJpZ2dlcih0YXJnZXQsICdjaGFuZ2UnKTtcbiAgfSBlbHNlIGlmICgvXFxzXFwvXFxzP1xcZD8kLy50ZXN0KHZhbHVlKSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0YXJnZXQudmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXHNcXC9cXHM/XFxkPyQvLCAnJyk7XG4gICAgcmV0dXJuIHRyaWdnZXIodGFyZ2V0LCAnY2hhbmdlJyk7XG4gIH1cblxuICByZXR1cm47XG59XG5cbi8vICBSZXN0cmljdGlvbnNcblxuZnVuY3Rpb24gcmVzdHJpY3ROdW1lcmljKGU6IEV2ZW50KTogYm9vbGVhbiB7XG4gIC8vIEtleSBldmVudCBpcyBmb3IgYSBicm93c2VyIHNob3J0Y3V0XG4gIGxldCBpbnB1dDtcbiAgaWYgKChlIGFzIGFueSkubWV0YUtleSB8fCAoZSBhcyBhbnkpLmN0cmxLZXkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIElmIGtleWNvZGUgaXMgYSBzcGFjZVxuICBpZiAoKGUgYXMgYW55KS53aGljaCA9PT0gMzIpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gSWYga2V5Y29kZSBpcyBhIHNwZWNpYWwgY2hhciAoV2ViS2l0KVxuICBpZiAoKGUgYXMgYW55KS53aGljaCA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gSWYgY2hhciBpcyBhIHNwZWNpYWwgY2hhciAoRmlyZWZveClcbiAgaWYgKChlIGFzIGFueSkud2hpY2ggPCAzMykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaW5wdXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKChlIGFzIGFueSkud2hpY2gpO1xuXG4gIC8vIENoYXIgaXMgYSBudW1iZXIgb3IgYSBzcGFjZVxuICBpZiAoIS9bXFxkXFxzXS8udGVzdChpbnB1dCkpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc3RyaWN0Q2FyZE51bWJlcihtYXhMZW5ndGg/OiBudW1iZXIpOiAoRXZlbnQpID0+IHZvaWQge1xuICByZXR1cm4gKGU6IEV2ZW50KSA9PiB7XG4gICAgbGV0IGxlbmd0aDtcblxuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxEYXRhRWxlbWVudDtcbiAgICBjb25zdCBkaWdpdCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGUgYXMgYW55KS53aGljaCk7XG4gICAgaWYgKCEvXlxcZCskLy50ZXN0KGRpZ2l0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChoYXNUZXh0U2VsZWN0ZWQodGFyZ2V0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJlc3RyaWN0IG51bWJlciBvZiBkaWdpdHNcbiAgICBjb25zdCB2YWx1ZSA9ICh0YXJnZXQudmFsdWUgKyBkaWdpdCkucmVwbGFjZSgvXFxEL2csICcnKTtcbiAgICBjb25zdCBjYXJkID0gY2FyZEZyb21OdW1iZXIodmFsdWUpO1xuXG4gICAgbGVuZ3RoID0gMTY7XG4gICAgaWYgKGNhcmQpIHtcbiAgICAgIGxlbmd0aCA9IGNhcmQubGVuZ3RoW2NhcmQubGVuZ3RoLmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICBpZiAobWF4TGVuZ3RoKSB7XG4gICAgICBsZW5ndGggPSBNYXRoLm1pbihsZW5ndGgsIG1heExlbmd0aCk7XG4gICAgfVxuXG4gICAgaWYgKCEodmFsdWUubGVuZ3RoIDw9IGxlbmd0aCkpIHtcbiAgICAgIHJldHVybiBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiByZXN0cmljdEV4cGlyeShlOiBFdmVudCwgbGVuZ3RoOiBudW1iZXIpOiB2b2lkIHtcbiAgbGV0IHZhbHVlO1xuICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRGF0YUVsZW1lbnQ7XG4gIGNvbnN0IGRpZ2l0ID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoZSBhcyBhbnkpLndoaWNoKTtcbiAgaWYgKCEvXlxcZCskLy50ZXN0KGRpZ2l0KSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChoYXNUZXh0U2VsZWN0ZWQodGFyZ2V0KSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhbHVlID0gdGFyZ2V0LnZhbHVlICsgZGlnaXQ7XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxEL2csICcnKTtcblxuICBpZiAodmFsdWUubGVuZ3RoID4gbGVuZ3RoKSB7XG4gICAgcmV0dXJuIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZXN0cmljdENvbWJpbmVkRXhwaXJ5KGU6IEV2ZW50KTogdm9pZCB7XG4gIHJldHVybiByZXN0cmljdEV4cGlyeShlLCA2KTtcbn1cblxuZnVuY3Rpb24gcmVzdHJpY3RNb250aEV4cGlyeShlOiBFdmVudCk6IHZvaWQge1xuICByZXR1cm4gcmVzdHJpY3RFeHBpcnkoZSwgMik7XG59XG5cbmZ1bmN0aW9uIHJlc3RyaWN0WWVhckV4cGlyeShlOiBFdmVudCk6IHZvaWQge1xuICByZXR1cm4gcmVzdHJpY3RFeHBpcnkoZSwgNCk7XG59XG5cbmZ1bmN0aW9uIHJlc3RyaWN0Q1ZDKGU6IEV2ZW50KTogdm9pZCB7XG4gIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxEYXRhRWxlbWVudDtcbiAgY29uc3QgZGlnaXQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKChlIGFzIGFueSkud2hpY2gpO1xuICBpZiAoIS9eXFxkKyQvLnRlc3QoZGlnaXQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGhhc1RleHRTZWxlY3RlZCh0YXJnZXQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdmFsID0gdGFyZ2V0LnZhbHVlICsgZGlnaXQ7XG4gIGlmICghKHZhbC5sZW5ndGggPD0gNCkpIHtcbiAgICByZXR1cm4gZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldENhcmRUeXBlKGU6IEV2ZW50KTogYm9vbGVhbiB7XG4gIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxEYXRhRWxlbWVudDtcbiAgY29uc3QgdmFsID0gdGFyZ2V0LnZhbHVlO1xuICBjb25zdCBjYXJkVHlwZSA9IFBheW1lbnQuZm5zLmNhcmRUeXBlKHZhbCkgfHwgJ3Vua25vd24nO1xuXG4gIGlmICh0YXJnZXQgJiYgdGFyZ2V0LmNsYXNzTGlzdCAmJiAhdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhjYXJkVHlwZSkpIHtcbiAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgndW5rbm93bicpO1xuICAgIGNhcmRzLmZvckVhY2goKGNhcmQpID0+IHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKGNhcmQudHlwZSkpO1xuXG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoY2FyZFR5cGUpO1xuXG4gICAgaWYgKGNhcmRUeXBlICE9PSAndW5rbm93bicpIHtcbiAgICAgIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpZGVudGlmaWVkJykpIHtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2lkZW50aWZpZWQnKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2lkZW50aWZpZWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRyaWdnZXIodGFyZ2V0LCAncGF5bWVudC5jYXJkVHlwZScsIGNhcmRUeXBlKTtcbiAgfVxuXG4gIHJldHVybjtcbn1cbiJdfQ==