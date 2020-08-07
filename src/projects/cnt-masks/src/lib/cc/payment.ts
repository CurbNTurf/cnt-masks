/**
 * Copyright (c) 2014 Jesse Pollak
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH TH
 */
interface ICardObject {
  type: string;
  pattern: RegExp;
  format: RegExp;
  length: number[];
  cvcLength: number[];
  luhn: boolean;
}

let cards: ICardObject[];
let defaultFormat;

const indexOf =
  [].indexOf ||
  function (this: any[], item: any): number {
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

function cardFromNumber(num: string): any {
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

function cardFromType(type: string): any {
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

function luhnCheck(num: string): boolean {
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

function hasTextSelected(target?: EventTarget): boolean {
  let e;
  try {
    // If some text is selected
    if (
      target &&
      (target as any).selectionStart != null &&
      (target as any).selectionStart !== (target as any).selectionEnd
    ) {
      return true;
    }
  } catch (error) {
    e = error;
  }

  return false;
}

function qjon(
  element: Element | any,
  eventName: string,
  callback: (e: Event) => void
): any {
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

function trigger(el: Element, name: string, data?: any): boolean {
  let ev;

  try {
    ev = new CustomEvent(name, { detail: data });
  } catch (e) {
    ev = document.createEvent('CustomEvent');
    // jsdom doesn't have initCustomEvent, so we need this check for
    // testing
    if (ev.initCustomEvent) {
      ev.initCustomEvent(name, true, true, data);
    } else {
      (ev as any).initEvent(name, true, true, data);
    }
  }

  return el.dispatchEvent(ev);
}

// Public
// @dynamic
export class Payment {
  public static fns = {
    cardExpiryVal: (value: string) => {
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
    validateCardNumber: (num: string) => {
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

      return (
        ((ref = num.length), indexOf.call(card.length, ref) >= 0) &&
        (card.luhn === false || luhnCheck(num))
      );
    },
    validateCardExpiry: (month: string, year: string) => {
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
    validateCardCVC: (cvc: string, type?: string) => {
      let ref;
      let ref1;

      cvc = cvc.trim();
      if (!/^\d+$/.test(cvc)) {
        return false;
      }

      if (type && cardFromType(type)) {
        // Check against a explicit card type
        ref1 = cardFromType(type);
        return (
          (ref = cvc.length),
          indexOf.call(ref1 != null ? ref1.cvcLength : void 0, ref) >= 0
        );
      } else {
        // Check against all types
        return cvc.length >= 3 && cvc.length <= 4;
      }
    },
    cardType: (num: string) => {
      if (!num) {
        return null;
      }
      const ref = cardFromNumber(num);
      return (ref != null ? ref.type : void 0) || null;
    },
    formatCardNumber: (num: string) => {
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
      } else {
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

  public static restrictNumeric(el: Element): any {
    return qjon(el, 'keypress', restrictNumeric);
  }

  public static formatCardCVC(el: Element): Element {
    Payment.restrictNumeric(el);
    qjon(el, 'keypress', restrictCVC);
    return el;
  }

  public static formatCardExpiry(el: Element): Element {
    let month;
    let year;

    Payment.restrictNumeric(el);
    if ((el as any).length && (el as any).length === 2) {
      (month = (el as any)[0]), (year = (el as any)[1]);
      this.formatCardExpiryMultiple(month, year);
    } else {
      qjon(el, 'keypress', restrictCombinedExpiry);
      qjon(el, 'keypress', formatExpiry);
      qjon(el, 'keypress', formatForwardSlash);
      qjon(el, 'keypress', formatForwardExpiry);
      qjon(el, 'keydown', formatBackExpiry);
    }
    return el;
  }

  public static formatCardExpiryMultiple(month: string, year: string): any {
    qjon(month, 'keypress', restrictMonthExpiry);
    qjon(month, 'keypress', formatMonthExpiry);
    return qjon(year, 'keypress', restrictYearExpiry);
  }

  public static formatCardNumber(el: Element, maxLength?: number): Element {
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
// Private

// Format Card Number

function reFormatCardNumber(e: Event): number {
  return setTimeout(() => {
    let value;
    const target = e.target as HTMLDataElement;

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

function formatCardNumber(maxLength?: number): (event) => boolean {
  return (e: Event) => {
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
    digit = String.fromCharCode((e as any).which);
    if (!/^\d+$/.test(digit)) {
      return;
    }

    target = e.target as HTMLDataElement;
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
    } else {
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

function formatBackCardNumber(e: Event): boolean {
  const target = e.target as HTMLDataElement;
  const value = target.value;

  if ((e as any).meta) {
    return;
  }

  // Return unless backspacing
  if ((e as any).which !== 8) {
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
  } else if (/\s\d?$/.test(value)) {
    e.preventDefault();
    target.value = value.replace(/\s\d?$/, '');
    return trigger(target, 'change');
  }

  return;
}

// Format Expiry

function formatExpiry(e: Event): boolean {
  // Only format if input is a number
  const digit = String.fromCharCode((e as any).which);
  if (!/^\d+$/.test(digit)) {
    return;
  }

  const target = e.target as HTMLDataElement;
  const val = target.value + digit;

  if (/^\d$/.test(val) && val !== '0' && val !== '1') {
    e.preventDefault();
    target.value = '0' + val + ' / ';
    return trigger(target, 'change');
  } else if (/^\d\d$/.test(val)) {
    e.preventDefault();
    target.value = val + ' / ';
    return trigger(target, 'change');
  }

  return;
}

function formatMonthExpiry(e: Event): boolean {
  const digit = String.fromCharCode((e as any).which);
  if (!/^\d+$/.test(digit)) {
    return;
  }

  const target = e.target as HTMLDataElement;
  const val = target.value + digit;

  if (/^\d$/.test(val) && val !== '0' && val !== '1') {
    e.preventDefault();
    target.value = '0' + val;
    return trigger(target, 'change');
  } else if (/^\d\d$/.test(val)) {
    e.preventDefault();
    target.value = val;
    return trigger(target, 'change');
  }

  return;
}

function formatForwardExpiry(e: Event): boolean {
  const digit = String.fromCharCode((e as any).which);
  if (!/^\d+$/.test(digit)) {
    return;
  }

  const target = e.target as HTMLDataElement;
  const val = target.value;

  if (/^\d\d$/.test(val)) {
    target.value = val + ' / ';
    return trigger(target, 'change');
  }

  return;
}

function formatForwardSlash(e: Event): boolean {
  const slash = String.fromCharCode((e as any).which);
  if (slash !== '/') {
    return;
  }

  const target = e.target as HTMLDataElement;
  const val = target.value;

  if (/^\d$/.test(val) && val !== '0') {
    target.value = '0' + val + ' / ';
    return trigger(target, 'change');
  }

  return;
}

function formatBackExpiry(e: Event): boolean {
  // If shift+backspace is pressed
  if ((e as any).metaKey) {
    return;
  }

  const target = e.target as HTMLDataElement;
  const value = target.value;

  // Return unless backspacing
  if ((e as any).which !== 8) {
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
  } else if (/\s\/\s?\d?$/.test(value)) {
    e.preventDefault();
    target.value = value.replace(/\s\/\s?\d?$/, '');
    return trigger(target, 'change');
  }

  return;
}

//  Restrictions

function restrictNumeric(e: Event): boolean {
  // Key event is for a browser shortcut
  let input;
  if ((e as any).metaKey || (e as any).ctrlKey) {
    return true;
  }

  // If keycode is a space
  if ((e as any).which === 32) {
    e.preventDefault();
    return false;
  }

  // If keycode is a special char (WebKit)
  if ((e as any).which === 0) {
    return true;
  }

  // If char is a special char (Firefox)
  if ((e as any).which < 33) {
    return true;
  }

  input = String.fromCharCode((e as any).which);

  // Char is a number or a space
  if (!/[\d\s]/.test(input)) {
    e.preventDefault();
    return false;
  }
}

function restrictCardNumber(maxLength?: number): (Event) => void {
  return (e: Event) => {
    let length;

    const target = e.target as HTMLDataElement;
    const digit = String.fromCharCode((e as any).which);
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

function restrictExpiry(e: Event, length: number): void {
  let value;
  const target = e.target as HTMLDataElement;
  const digit = String.fromCharCode((e as any).which);
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

function restrictCombinedExpiry(e: Event): void {
  return restrictExpiry(e, 6);
}

function restrictMonthExpiry(e: Event): void {
  return restrictExpiry(e, 2);
}

function restrictYearExpiry(e: Event): void {
  return restrictExpiry(e, 4);
}

function restrictCVC(e: Event): void {
  const target = e.target as HTMLDataElement;
  const digit = String.fromCharCode((e as any).which);
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

function setCardType(e: Event): boolean {
  const target = e.target as HTMLDataElement;
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
    } else {
      target.classList.remove('identified');
    }
    return trigger(target, 'payment.cardType', cardType);
  }

  return;
}
