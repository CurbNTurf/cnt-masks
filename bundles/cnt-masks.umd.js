(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('angular2-text-mask'), require('@angular/common'), require('@angular/forms'), require('text-mask-core/dist/textMaskCore')) :
    typeof define === 'function' && define.amd ? define('cnt-masks', ['exports', '@angular/core', 'angular2-text-mask', '@angular/common', '@angular/forms', 'text-mask-core/dist/textMaskCore'], factory) :
    (global = global || self, factory(global['cnt-masks'] = {}, global.ng.core, global.angular2TextMask, global.ng.common, global.ng.forms, global.textMaskCore));
}(this, (function (exports, core, angular2TextMask, common, forms, textMaskCore) { 'use strict';

    var CardExpirationPipe = /** @class */ (function () {
        function CardExpirationPipe() {
        }
        CardExpirationPipe.prototype.transform = function (value) {
            if (typeof value !== 'number') {
                value = value + '';
            }
            if (typeof value !== 'string') {
                return value;
            }
            if (value.length === 3) {
                value = "0" + value;
            }
            return value.substring(0, 2) + "/" + value.substring(2);
        };
        return CardExpirationPipe;
    }());
    CardExpirationPipe.decorators = [
        { type: core.Pipe, args: [{
                    name: 'cardExpiration',
                },] }
    ];

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, exports) {
        for (var p in m)
            if (p !== "default" && !exports.hasOwnProperty(p))
                __createBinding(exports, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    ;
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (Object.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    var cards;
    var defaultFormat;
    var ɵ0 = function (item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === item) {
                return i;
            }
        }
        return -1;
    };
    var indexOf = [].indexOf || ɵ0;
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
        var card;
        var i;
        var len;
        var numString = (num + '').replace(/\D/g, '');
        for (i = 0, len = cards.length; i < len; i++) {
            card = cards[i];
            if (card.pattern.test(numString)) {
                return card;
            }
        }
        return;
    }
    function cardFromType(type) {
        var card;
        var i;
        var len;
        for (i = 0, len = cards.length; i < len; i++) {
            card = cards[i];
            if (card.type === type) {
                return card;
            }
        }
        return;
    }
    function luhnCheck(num) {
        var digits;
        var odd = true;
        var sum = 0;
        digits = (num + '').split('').reverse();
        digits.forEach(function (digitString) {
            var digit = parseInt(digitString, 10);
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
        var e;
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
        var e_1, _a, e_2, _b;
        if (element.length) {
            try {
                // handle multiple elements
                for (var _c = __values(Array.from(element)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var el = _d.value;
                    qjon(el, eventName, callback);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return;
        }
        if (eventName.match(' ')) {
            try {
                // handle multiple event attachment
                for (var _e = __values(Array.from(eventName.split(' '))), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var multiEventName = _f.value;
                    qjon(element, multiEventName, callback);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
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
        var ev;
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
    var Payment = /** @class */ (function () {
        function Payment() {
        }
        Payment.restrictNumeric = function (el) {
            return qjon(el, 'keypress', restrictNumeric);
        };
        Payment.formatCardCVC = function (el) {
            Payment.restrictNumeric(el);
            qjon(el, 'keypress', restrictCVC);
            return el;
        };
        Payment.formatCardExpiry = function (el) {
            var month;
            var year;
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
        };
        Payment.formatCardExpiryMultiple = function (month, year) {
            qjon(month, 'keypress', restrictMonthExpiry);
            qjon(month, 'keypress', formatMonthExpiry);
            return qjon(year, 'keypress', restrictYearExpiry);
        };
        Payment.formatCardNumber = function (el, maxLength) {
            Payment.restrictNumeric(el);
            qjon(el, 'keypress', restrictCardNumber(maxLength));
            qjon(el, 'keypress', formatCardNumber(maxLength));
            qjon(el, 'keydown', formatBackCardNumber);
            qjon(el, 'keyup blur', setCardType);
            qjon(el, 'paste', reFormatCardNumber);
            qjon(el, 'input', reFormatCardNumber);
            return el;
        };
        return Payment;
    }());
    Payment.fns = {
        cardExpiryVal: function (value) {
            var month;
            var prefix;
            var year;
            var ref;
            value = value.replace(/\s/g, '');
            (ref = value.split('/', 2)), (month = ref[0]), (year = ref[1]);
            // Allow for year shortcut
            if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
                prefix = new Date().getFullYear();
                prefix = prefix.toString().slice(0, 2);
                year = prefix + year;
            }
            return {
                month: month,
                year: year,
            };
        },
        validateCardNumber: function (num) {
            var card;
            var ref;
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
        validateCardExpiry: function (month, year) {
            // Allow passing an object
            var currentTime;
            var expiry;
            var prefix;
            var ref1;
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
            var monthInt = parseInt(month, 10);
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
        validateCardCVC: function (cvc, type) {
            var ref;
            var ref1;
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
        cardType: function (num) {
            if (!num) {
                return null;
            }
            var ref = cardFromNumber(num);
            return (ref != null ? ref.type : void 0) || null;
        },
        formatCardNumber: function (num) {
            var card;
            var groups;
            var upperLength;
            card = cardFromNumber(num);
            if (!card) {
                return num;
            }
            upperLength = card.length[card.length.length - 1];
            num = num.replace(/\D/g, '');
            num = num.slice(0, upperLength);
            if (card.format.global) {
                var ref = num.match(card.format);
                return ref != null ? ref.join(' ') : void 0;
            }
            else {
                groups = card.format.exec(num);
                if (groups == null) {
                    return;
                }
                groups.shift();
                groups = groups.filter(function (n) { return n; }); // Filter empty groups
                return groups.join(' ');
            }
        },
    };
    // Private
    // Format Card Number
    function reFormatCardNumber(e) {
        return setTimeout(function () {
            var value;
            var target = e.target;
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
        return function (e) {
            // Only format if input is a number
            var card;
            var digit;
            var i;
            var length;
            var re;
            var target;
            var upperLength;
            var upperLengths;
            var value;
            var j;
            var len;
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
                upperLengths = upperLengths.filter(function (x) { return x <= maxLength; });
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
        var target = e.target;
        var value = target.value;
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
        var digit = String.fromCharCode(e.which);
        if (!/^\d+$/.test(digit)) {
            return;
        }
        var target = e.target;
        var val = target.value + digit;
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
        var digit = String.fromCharCode(e.which);
        if (!/^\d+$/.test(digit)) {
            return;
        }
        var target = e.target;
        var val = target.value + digit;
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
        var digit = String.fromCharCode(e.which);
        if (!/^\d+$/.test(digit)) {
            return;
        }
        var target = e.target;
        var val = target.value;
        if (/^\d\d$/.test(val)) {
            target.value = val + ' / ';
            return trigger(target, 'change');
        }
        return;
    }
    function formatForwardSlash(e) {
        var slash = String.fromCharCode(e.which);
        if (slash !== '/') {
            return;
        }
        var target = e.target;
        var val = target.value;
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
        var target = e.target;
        var value = target.value;
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
        var input;
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
        return function (e) {
            var length;
            var target = e.target;
            var digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return;
            }
            if (hasTextSelected(target)) {
                return;
            }
            // Restrict number of digits
            var value = (target.value + digit).replace(/\D/g, '');
            var card = cardFromNumber(value);
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
        var value;
        var target = e.target;
        var digit = String.fromCharCode(e.which);
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
        var target = e.target;
        var digit = String.fromCharCode(e.which);
        if (!/^\d+$/.test(digit)) {
            return;
        }
        if (hasTextSelected(target)) {
            return;
        }
        var val = target.value + digit;
        if (!(val.length <= 4)) {
            return e.preventDefault();
        }
    }
    function setCardType(e) {
        var target = e.target;
        var val = target.value;
        var cardType = Payment.fns.cardType(val) || 'unknown';
        if (target && target.classList && !target.classList.contains(cardType)) {
            target.classList.add('unknown');
            cards.forEach(function (card) { return target.classList.remove(card.type); });
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

    var CCCvcFormatDirective = /** @class */ (function () {
        function CCCvcFormatDirective(el) {
            this.el = el;
            var element = this.el.nativeElement;
            // call lib functions
            Payment.formatCardCVC(element);
            Payment.restrictNumeric(element);
        }
        return CCCvcFormatDirective;
    }());
    CCCvcFormatDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[cntMaskCCCvc]',
                },] }
    ];
    CCCvcFormatDirective.ctorParameters = function () { return [
        { type: core.ElementRef }
    ]; };

    var CCExpiryFormatDirective = /** @class */ (function () {
        function CCExpiryFormatDirective(el) {
            this.el = el;
            var element = this.el.nativeElement;
            // call lib functions
            Payment.formatCardExpiry(element);
            Payment.restrictNumeric(element);
        }
        return CCExpiryFormatDirective;
    }());
    CCExpiryFormatDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[cntMaskCCExp]',
                },] }
    ];
    CCExpiryFormatDirective.ctorParameters = function () { return [
        { type: core.ElementRef }
    ]; };

    var CCNumberFormatDirective = /** @class */ (function () {
        function CCNumberFormatDirective(renderer, el) {
            this.renderer = renderer;
            this.el = el;
            var element = this.el.nativeElement;
            this.cardType = '';
            // call lib functions
            Payment.formatCardNumber(element);
            Payment.restrictNumeric(element);
        }
        CCNumberFormatDirective.prototype.onKeypress = function (e) {
            var element = this.el.nativeElement;
            var elementValue = element.value;
            this.cardType = Payment.fns.cardType(elementValue);
            if (this.cardType && this.cardType !== '') {
                this.renderer.removeClass(element, this.cardType);
            }
            else {
                this.cardType = '';
            }
        };
        return CCNumberFormatDirective;
    }());
    CCNumberFormatDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[cntMaskCCNum]',
                },] }
    ];
    CCNumberFormatDirective.ctorParameters = function () { return [
        { type: core.Renderer2 },
        { type: core.ElementRef }
    ]; };
    CCNumberFormatDirective.propDecorators = {
        onKeypress: [{ type: core.HostListener, args: ['keypress', ['$event'],] }]
    };

    var CreditCardValidator = /** @class */ (function () {
        function CreditCardValidator() {
        }
        /**
         * Validates a cc number
         */
        CreditCardValidator.validateCardNumber = function (control) {
            if (control) {
                var isValid = Payment.fns.validateCardNumber(control.value);
                if (!isValid) {
                    return {
                        cardNumber: true,
                    };
                }
            }
            return null;
        };
        /**
         * Validates the expiry date.
         * Breaks exp by "/" string and assumes that first array entry is month and second year
         * Also removes any spaces
         */
        CreditCardValidator.validateCardExpiry = function (control) {
            if (control) {
                var controlValue = control.value.split('/');
                var isValid = false;
                if (controlValue.length > 1) {
                    var month = controlValue[0].replace(/^\s+|\s+$/g, '');
                    var year = controlValue[1].replace(/^\s+|\s+$/g, '');
                    isValid = Payment.fns.validateCardExpiry(month, year);
                }
                if (!isValid) {
                    return {
                        cardExpiry: true,
                    };
                }
            }
            return null;
        };
        /**
         * Validates cards CVC
         * Also removes any spaces
         */
        CreditCardValidator.validateCardCvc = function (control) {
            if (control) {
                var isValid = Payment.fns.validateCardCVC(control.value);
                if (!isValid) {
                    return {
                        cardCvc: true,
                    };
                }
            }
            return null;
        };
        return CreditCardValidator;
    }());

    var clean = function (number) {
        return number.toString().replace(/[^\d\^\+]/gm, '');
    };
    var mask = function (maxLength) {
        if (maxLength === void 0) { maxLength = 13; }
        return function (rawValue) {
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
    };

    var TextMaskConfig = /** @class */ (function () {
        function TextMaskConfig() {
        }
        return TextMaskConfig;
    }());
    // @dynamic
    var PhoneMaskDirective = /** @class */ (function () {
        function PhoneMaskDirective(renderer, elementRef, platformId, compositionMode) {
            this.renderer = renderer;
            this.elementRef = elementRef;
            this.platformId = platformId;
            this.compositionMode = compositionMode;
            this.clean = true;
            this.maxNumberLength = 13;
            /** Whether the user is creating a composition string (IME events). */
            this.composing = false;
            this.onChange = function (_) {
                // implement
            };
            this.onTouched = function () {
                // implement
            };
            if (this.compositionMode == null) {
                this.compositionMode = !this.isAndroid();
            }
        }
        PhoneMaskDirective.prototype.ngOnInit = function () {
            this.setupMask(true);
            if (this.textMaskInputElement !== undefined) {
                this.textMaskInputElement.update(this.inputElement.value);
            }
        };
        PhoneMaskDirective.prototype.ngOnChanges = function (changes) {
            this.setupMask(true);
            if (this.textMaskInputElement !== undefined) {
                this.textMaskInputElement.update(this.inputElement.value);
            }
        };
        PhoneMaskDirective.prototype.onBlur = function () {
            this.onTouched();
        };
        PhoneMaskDirective.prototype.writeValue = function (value) {
            this.setupMask();
            // set the initial value for cases where the mask is disabled
            var normalizedValue = value == null ? '' : value;
            this.renderer.setProperty(this.inputElement, 'value', normalizedValue);
            if (this.textMaskInputElement !== undefined) {
                this.textMaskInputElement.update(value);
            }
        };
        PhoneMaskDirective.prototype.registerOnChange = function (fn) {
            this.onChange = fn;
        };
        PhoneMaskDirective.prototype.registerOnTouched = function (fn) {
            this.onTouched = fn;
        };
        PhoneMaskDirective.prototype.setDisabledState = function (isDisabled) {
            this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
        };
        PhoneMaskDirective.prototype.handleInput = function (value) {
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
        };
        PhoneMaskDirective.prototype.setupMask = function (create) {
            if (create === void 0) { create = false; }
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
                this.textMaskInputElement = textMaskCore.createTextMaskInputElement(Object.assign({ inputElement: this.inputElement }, this.textMaskConfig));
            }
        };
        PhoneMaskDirective.prototype.compositionStart = function () {
            this.composing = true;
        };
        PhoneMaskDirective.prototype.compositionEnd = function (value) {
            this.composing = false;
            // tslint:disable-next-line: no-unused-expression
            this.compositionMode && this.handleInput(value);
        };
        /**
         * We must check whether the agent is Android because composition events
         * behave differently between iOS and Android.
         */
        PhoneMaskDirective.prototype.isAndroid = function () {
            if (common.isPlatformBrowser(this.platformId) &&
                window &&
                window.navigator) {
                var userAgent = window.navigator.userAgent;
                return /android (\d+)/.test(userAgent.toLowerCase());
            }
            return false;
        };
        return PhoneMaskDirective;
    }());
    PhoneMaskDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[cntMaskPhone]',
                    exportAs: 'cntMaskPhone',
                    providers: [
                        {
                            provide: forms.NG_VALUE_ACCESSOR,
                            useExisting: core.forwardRef(function () { return PhoneMaskDirective; }),
                            multi: true,
                        },
                    ],
                },] }
    ];
    PhoneMaskDirective.ctorParameters = function () { return [
        { type: core.Renderer2 },
        { type: core.ElementRef },
        { type: Object, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] }] },
        { type: Boolean, decorators: [{ type: core.Optional }, { type: core.Inject, args: [forms.COMPOSITION_BUFFER_MODE,] }] }
    ]; };
    PhoneMaskDirective.propDecorators = {
        clean: [{ type: core.Input }],
        maxNumberLength: [{ type: core.Input }],
        onBlur: [{ type: core.HostListener, args: ['blur',] }],
        handleInput: [{ type: core.HostListener, args: ['input', ['$event.target.value'],] }],
        compositionStart: [{ type: core.HostListener, args: ['compositionstart',] }],
        compositionEnd: [{ type: core.HostListener, args: ['compositionend', ['$event.target.value'],] }]
    };

    var PhoneMaskPipe = /** @class */ (function () {
        function PhoneMaskPipe() {
        }
        PhoneMaskPipe.prototype.transform = function (value) {
            if (!value) {
                return '';
            }
            return angular2TextMask.conformToMask(value, mask(), { guide: false }).conformedValue;
        };
        return PhoneMaskPipe;
    }());
    PhoneMaskPipe.decorators = [
        { type: core.Pipe, args: [{
                    name: 'cntMaskPhone',
                },] }
    ];

    var CntMasksModule = /** @class */ (function () {
        function CntMasksModule() {
        }
        return CntMasksModule;
    }());
    CntMasksModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [angular2TextMask.TextMaskModule],
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

    exports.CCCvcFormatDirective = CCCvcFormatDirective;
    exports.CCExpiryFormatDirective = CCExpiryFormatDirective;
    exports.CCNumberFormatDirective = CCNumberFormatDirective;
    exports.CardExpirationPipe = CardExpirationPipe;
    exports.CntMasksModule = CntMasksModule;
    exports.CreditCardValidator = CreditCardValidator;
    exports.PhoneMaskDirective = PhoneMaskDirective;
    exports.PhoneMaskPipe = PhoneMaskPipe;
    exports.TextMaskConfig = TextMaskConfig;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=cnt-masks.umd.js.map
