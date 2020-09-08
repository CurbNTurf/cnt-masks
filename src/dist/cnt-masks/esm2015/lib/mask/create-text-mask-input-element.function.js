import { adjustCaretPosition } from './adjust-caret-position.function';
import { conformToMask, defaultPlaceholderChar, processCaretTraps, } from './conform-to-mask.function';
const emptyArray = [];
const emptyString = '';
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
export function convertMaskToPlaceholder(mask = emptyArray, placeholderChar = defaultPlaceholderChar) {
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
export function createTextMaskInputElement(config) {
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
                placeholder = convertMaskToPlaceholder(providedMask, placeholderChar);
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
                placeholder = convertMaskToPlaceholder(mask, placeholderChar);
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
            const emptyValue = showMask ? placeholder : emptyString;
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
        return emptyString;
    }
    else {
        throw new Error("The 'value' provided to Text Mask needs to be a string or a number. The value " +
            `received was:\n\n ${JSON.stringify(inputValue)}`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXRleHQtbWFzay1pbnB1dC1lbGVtZW50LmZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY250LW1hc2tzL3NyYy9saWIvbWFzay9jcmVhdGUtdGV4dC1tYXNrLWlucHV0LWVsZW1lbnQuZnVuY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDdkUsT0FBTyxFQUNMLGFBQWEsRUFDYixzQkFBc0IsRUFDdEIsaUJBQWlCLEdBQ2xCLE1BQU0sNEJBQTRCLENBQUM7QUFFcEMsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUV2QixNQUFNLFNBQVMsR0FDYixPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDM0UsTUFBTSxLQUFLLEdBQ1QsT0FBTyxxQkFBcUIsS0FBSyxXQUFXO0lBQzFDLENBQUMsQ0FBQyxxQkFBcUI7SUFDdkIsQ0FBQyxDQUFDLFVBQVUsQ0FBQztBQUVqQixTQUFTLFFBQVEsQ0FBQyxLQUFVO0lBQzFCLE9BQU8sT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssWUFBWSxNQUFNLENBQUM7QUFDOUQsQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLEtBQVU7SUFDMUIsT0FBTyxDQUNMLE9BQU8sS0FBSyxLQUFLLFFBQVE7UUFDeEIsS0FBYSxDQUFDLE1BQU0sS0FBSyxTQUFTO1FBQ25DLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUNkLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxVQUFVLHdCQUF3QixDQUN0QyxPQUFZLFVBQVUsRUFDdEIsa0JBQTBCLHNCQUFzQjtJQUVoRCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJ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c0NvbnRlbnQiOlsiaW1wb3J0IHsgYWRqdXN0Q2FyZXRQb3NpdGlvbiB9IGZyb20gJy4vYWRqdXN0LWNhcmV0LXBvc2l0aW9uLmZ1bmN0aW9uJztcbmltcG9ydCB7XG4gIGNvbmZvcm1Ub01hc2ssXG4gIGRlZmF1bHRQbGFjZWhvbGRlckNoYXIsXG4gIHByb2Nlc3NDYXJldFRyYXBzLFxufSBmcm9tICcuL2NvbmZvcm0tdG8tbWFzay5mdW5jdGlvbic7XG5cbmNvbnN0IGVtcHR5QXJyYXkgPSBbXTtcbmNvbnN0IGVtcHR5U3RyaW5nID0gJyc7XG5cbmNvbnN0IGlzQW5kcm9pZCA9XG4gIHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIC9BbmRyb2lkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbmNvbnN0IGRlZmVyOiBhbnkgPVxuICB0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lICE9PSAndW5kZWZpbmVkJ1xuICAgID8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgOiBzZXRUaW1lb3V0O1xuXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcih2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJlxuICAgICh2YWx1ZSBhcyBhbnkpLmxlbmd0aCA9PT0gdW5kZWZpbmVkICYmXG4gICAgIWlzTmFOKHZhbHVlKVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydE1hc2tUb1BsYWNlaG9sZGVyKFxuICBtYXNrOiBhbnkgPSBlbXB0eUFycmF5LFxuICBwbGFjZWhvbGRlckNoYXI6IHN0cmluZyA9IGRlZmF1bHRQbGFjZWhvbGRlckNoYXIsXG4pOiBhbnkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkobWFzaykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnVGV4dC1tYXNrOmNvbnZlcnRNYXNrVG9QbGFjZWhvbGRlcjsgVGhlIG1hc2sgcHJvcGVydHkgbXVzdCBiZSBhbiBhcnJheS4nLFxuICAgICk7XG4gIH1cblxuICBpZiAobWFzay5pbmRleE9mKHBsYWNlaG9sZGVyQ2hhcikgIT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ1BsYWNlaG9sZGVyIGNoYXJhY3RlciBtdXN0IG5vdCBiZSB1c2VkIGFzIHBhcnQgb2YgdGhlIG1hc2suIFBsZWFzZSBzcGVjaWZ5IGEgY2hhcmFjdGVyICcgK1xuICAgICAgICAndGhhdCBpcyBub3QgcHJlc2VudCBpbiB5b3VyIG1hc2sgYXMgeW91ciBwbGFjZWhvbGRlciBjaGFyYWN0ZXIuXFxuXFxuJyArXG4gICAgICAgIGBUaGUgcGxhY2Vob2xkZXIgY2hhcmFjdGVyIHRoYXQgd2FzIHJlY2VpdmVkIGlzOiAke0pTT04uc3RyaW5naWZ5KFxuICAgICAgICAgIHBsYWNlaG9sZGVyQ2hhcixcbiAgICAgICAgKX1cXG5cXG5gICtcbiAgICAgICAgYFRoZSBtYXNrIHRoYXQgd2FzIHJlY2VpdmVkIGlzOiAke0pTT04uc3RyaW5naWZ5KG1hc2spfWAsXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBtYXNrXG4gICAgLm1hcCgoY2hhcikgPT4ge1xuICAgICAgcmV0dXJuIGNoYXIgaW5zdGFuY2VvZiBSZWdFeHAgPyBwbGFjZWhvbGRlckNoYXIgOiBjaGFyO1xuICAgIH0pXG4gICAgLmpvaW4oJycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVGV4dE1hc2tJbnB1dEVsZW1lbnQoXG4gIGNvbmZpZzogYW55LFxuKTogeyBzdGF0ZTogYW55OyB1cGRhdGU6IGFueSB9IHtcbiAgLy8gQW55dGhpbmcgdGhhdCB3ZSB3aWxsIG5lZWQgdG8ga2VlcCBiZXR3ZWVuIGB1cGRhdGVgIGNhbGxzLCB3ZSB3aWxsIHN0b3JlIGluIHRoaXMgYHN0YXRlYCBvYmplY3QuXG4gIGNvbnN0IHN0YXRlID0ge1xuICAgIHByZXZpb3VzQ29uZm9ybWVkVmFsdWU6IHVuZGVmaW5lZCxcbiAgICBwcmV2aW91c1BsYWNlaG9sZGVyOiB1bmRlZmluZWQsXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBzdGF0ZSxcblxuICAgIC8vIGB1cGRhdGVgIGlzIGNhbGxlZCBieSBmcmFtZXdvcmsgY29tcG9uZW50cyB3aGVuZXZlciB0aGV5IHdhbnQgdG8gdXBkYXRlIHRoZSBgdmFsdWVgIG9mIHRoZSBpbnB1dCBlbGVtZW50LlxuICAgIC8vIFRoZSBjYWxsZXIgY2FuIHNlbmQgYSBgcmF3VmFsdWVgIHRvIGJlIGNvbmZvcm1lZCBhbmQgc2V0IG9uIHRoZSBpbnB1dCBlbGVtZW50LiBIb3dldmVyLCB0aGUgZGVmYXVsdCB1c2UtY2FzZVxuICAgIC8vIGlzIGZvciB0aGlzIHRvIGJlIHJlYWQgZnJvbSB0aGUgYGlucHV0RWxlbWVudGAgZGlyZWN0bHkuXG4gICAgdXBkYXRlKFxuICAgICAgcmF3VmFsdWU6IGFueSxcbiAgICAgIHtcbiAgICAgICAgaW5wdXRFbGVtZW50LFxuICAgICAgICBtYXNrOiBwcm92aWRlZE1hc2ssXG4gICAgICAgIGd1aWRlLFxuICAgICAgICBwaXBlLFxuICAgICAgICBwbGFjZWhvbGRlckNoYXIgPSBkZWZhdWx0UGxhY2Vob2xkZXJDaGFyLFxuICAgICAgICBrZWVwQ2hhclBvc2l0aW9ucyA9IGZhbHNlLFxuICAgICAgICBzaG93TWFzayA9IGZhbHNlLFxuICAgICAgfTogYW55ID0gY29uZmlnLFxuICAgICk6IHZvaWQge1xuICAgICAgLy8gaWYgYHJhd1ZhbHVlYCBpcyBgdW5kZWZpbmVkYCwgcmVhZCBmcm9tIHRoZSBgaW5wdXRFbGVtZW50YFxuICAgICAgaWYgKHR5cGVvZiByYXdWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmF3VmFsdWUgPSBpbnB1dEVsZW1lbnQudmFsdWU7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGByYXdWYWx1ZWAgZXF1YWxzIGBzdGF0ZS5wcmV2aW91c0NvbmZvcm1lZFZhbHVlYCwgd2UgZG9uJ3QgbmVlZCB0byBjaGFuZ2UgYW55dGhpbmcuIFNvLCB3ZSByZXR1cm4uXG4gICAgICAvLyBUaGlzIGNoZWNrIGlzIGhlcmUgdG8gaGFuZGxlIGNvbnRyb2xsZWQgZnJhbWV3b3JrIGNvbXBvbmVudHMgdGhhdCByZXBlYXQgdGhlIGB1cGRhdGVgIGNhbGwgb24gZXZlcnkgcmVuZGVyLlxuICAgICAgaWYgKHJhd1ZhbHVlID09PSBzdGF0ZS5wcmV2aW91c0NvbmZvcm1lZFZhbHVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gVGV4dCBNYXNrIGFjY2VwdHMgbWFza3MgdGhhdCBhcmUgYSBjb21iaW5hdGlvbiBvZiBhIGBtYXNrYCBhbmQgYSBgcGlwZWAgdGhhdCB3b3JrIHRvZ2V0aGVyLiBJZiBzdWNoIGEgYG1hc2tgIGlzXG4gICAgICAvLyBwYXNzZWQsIHdlIGRlLXN0cnVjdHVyZSBpdCBiZWxvdywgc28gdGhlIHJlc3Qgb2YgdGhlIGNvZGUgY2FuIHdvcmsgbm9ybWFsbHkgYXMgaWYgYSBzZXBhcmF0ZSBgbWFza2AgYW5kIGEgYHBpcGVgXG4gICAgICAvLyB3ZXJlIHBhc3NlZC5cbiAgICAgIGlmIChcbiAgICAgICAgdHlwZW9mIHByb3ZpZGVkTWFzayA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgcHJvdmlkZWRNYXNrLnBpcGUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICBwcm92aWRlZE1hc2subWFzayAhPT0gdW5kZWZpbmVkXG4gICAgICApIHtcbiAgICAgICAgcGlwZSA9IHByb3ZpZGVkTWFzay5waXBlO1xuICAgICAgICBwcm92aWRlZE1hc2sgPSBwcm92aWRlZE1hc2subWFzaztcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGBwbGFjZWhvbGRlcmAgaXMgYW4gZXNzZW50aWFsIHBpZWNlIG9mIGhvdyBUZXh0IE1hc2sgd29ya3MuIEZvciBhIG1hc2sgbGlrZSBgKDExMSlgLCB0aGUgcGxhY2Vob2xkZXIgd291bGRcbiAgICAgIC8vIGJlIGAoX19fKWAgaWYgdGhlIGBwbGFjZWhvbGRlckNoYXJgIGlzIHNldCB0byBgX2AuXG4gICAgICBsZXQgcGxhY2Vob2xkZXI7XG5cbiAgICAgIC8vIFdlIGRvbid0IGtub3cgd2hhdCB0aGUgbWFzayB3b3VsZCBiZSB5ZXQuIElmIGl0IGlzIGFuIGFycmF5LCB3ZSB0YWtlIGl0IGFzIGlzLCBidXQgaWYgaXQncyBhIGZ1bmN0aW9uLCB3ZSB3aWxsXG4gICAgICAvLyBoYXZlIHRvIGNhbGwgdGhhdCBmdW5jdGlvbiB0byBnZXQgdGhlIG1hc2sgYXJyYXkuXG4gICAgICBsZXQgbWFzaztcblxuICAgICAgLy8gSWYgdGhlIHByb3ZpZGVkIG1hc2sgaXMgYW4gYXJyYXksIHdlIGNhbiBjYWxsIGBjb252ZXJ0TWFza1RvUGxhY2Vob2xkZXJgIGhlcmUgb25jZSBhbmQgd2UnbGwgYWx3YXlzIGhhdmUgdGhlXG4gICAgICAvLyBjb3JyZWN0IGBwbGFjZWhvbGRlcmAuXG4gICAgICBpZiAocHJvdmlkZWRNYXNrIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgcGxhY2Vob2xkZXIgPSBjb252ZXJ0TWFza1RvUGxhY2Vob2xkZXIocHJvdmlkZWRNYXNrLCBwbGFjZWhvbGRlckNoYXIpO1xuICAgICAgfVxuXG4gICAgICAvLyBJbiBmcmFtZXdvcmsgY29tcG9uZW50cyB0aGF0IHN1cHBvcnQgcmVhY3Rpdml0eSwgaXQncyBwb3NzaWJsZSB0byB0dXJuIG9mZiBtYXNraW5nIGJ5IHBhc3NpbmdcbiAgICAgIC8vIGBmYWxzZWAgZm9yIGBtYXNrYCBhZnRlciBpbml0aWFsaXphdGlvbi4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS90ZXh0LW1hc2svdGV4dC1tYXNrL3B1bGwvMzU5XG4gICAgICBpZiAocHJvdmlkZWRNYXNrID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFdlIGNoZWNrIHRoZSBwcm92aWRlZCBgcmF3VmFsdWVgIGJlZm9yZSBtb3ZpbmcgZnVydGhlci5cbiAgICAgIC8vIElmIGl0J3Mgc29tZXRoaW5nIHdlIGNhbid0IHdvcmsgd2l0aCBgZ2V0U2FmZVJhd1ZhbHVlYCB3aWxsIHRocm93LlxuICAgICAgY29uc3Qgc2FmZVJhd1ZhbHVlID0gZ2V0U2FmZVJhd1ZhbHVlKHJhd1ZhbHVlKTtcblxuICAgICAgLy8gYHNlbGVjdGlvbkVuZGAgaW5kaWNhdGVzIHRvIHVzIHdoZXJlIHRoZSBjYXJldCBwb3NpdGlvbiBpcyBhZnRlciB0aGUgdXNlciBoYXMgdHlwZWQgaW50byB0aGUgaW5wdXRcbiAgICAgIGNvbnN0IHsgc2VsZWN0aW9uRW5kOiBjdXJyZW50Q2FyZXRQb3NpdGlvbiB9ID0gaW5wdXRFbGVtZW50O1xuXG4gICAgICAvLyBXZSBuZWVkIHRvIGtub3cgd2hhdCB0aGUgYHByZXZpb3VzQ29uZm9ybWVkVmFsdWVgIGFuZCBgcHJldmlvdXNQbGFjZWhvbGRlcmAgaXMgZnJvbSB0aGUgcHJldmlvdXMgYHVwZGF0ZWAgY2FsbFxuICAgICAgY29uc3QgeyBwcmV2aW91c0NvbmZvcm1lZFZhbHVlLCBwcmV2aW91c1BsYWNlaG9sZGVyIH0gPSBzdGF0ZTtcblxuICAgICAgbGV0IGNhcmV0VHJhcEluZGV4ZXM7XG5cbiAgICAgIC8vIElmIHRoZSBgcHJvdmlkZWRNYXNrYCBpcyBhIGZ1bmN0aW9uLiBXZSBuZWVkIHRvIGNhbGwgaXQgYXQgZXZlcnkgYHVwZGF0ZWAgdG8gZ2V0IHRoZSBgbWFza2AgYXJyYXkuXG4gICAgICAvLyBUaGVuIHdlIGFsc28gbmVlZCB0byBnZXQgdGhlIGBwbGFjZWhvbGRlcmBcbiAgICAgIGlmICh0eXBlb2YgcHJvdmlkZWRNYXNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG1hc2sgPSBwcm92aWRlZE1hc2soc2FmZVJhd1ZhbHVlLCB7XG4gICAgICAgICAgY3VycmVudENhcmV0UG9zaXRpb24sXG4gICAgICAgICAgcHJldmlvdXNDb25mb3JtZWRWYWx1ZSxcbiAgICAgICAgICBwbGFjZWhvbGRlckNoYXIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGRpc2FibGUgbWFza2luZyBpZiBgbWFza2AgaXMgYGZhbHNlYFxuICAgICAgICBpZiAobWFzayA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYXNrIGZ1bmN0aW9ucyBjYW4gc2V0dXAgY2FyZXQgdHJhcHMgdG8gaGF2ZSBzb21lIGNvbnRyb2wgb3ZlciBob3cgdGhlIGNhcmV0IG1vdmVzLiBXZSBuZWVkIHRvIHByb2Nlc3NcbiAgICAgICAgLy8gdGhlIG1hc2sgZm9yIGFueSBjYXJldCB0cmFwcy4gYHByb2Nlc3NDYXJldFRyYXBzYCB3aWxsIHJlbW92ZSB0aGUgY2FyZXQgdHJhcHMgZnJvbSB0aGUgbWFzayBhbmQgcmV0dXJuXG4gICAgICAgIC8vIHRoZSBpbmRleGVzIG9mIHRoZSBjYXJldCB0cmFwcy5cbiAgICAgICAgY29uc3QgeyBtYXNrV2l0aG91dENhcmV0VHJhcHMsIGluZGV4ZXMgfSA9IHByb2Nlc3NDYXJldFRyYXBzKG1hc2spO1xuXG4gICAgICAgIG1hc2sgPSBtYXNrV2l0aG91dENhcmV0VHJhcHM7IC8vIFRoZSBwcm9jZXNzZWQgbWFzayBpcyB3aGF0IHdlJ3JlIGludGVyZXN0ZWQgaW5cbiAgICAgICAgY2FyZXRUcmFwSW5kZXhlcyA9IGluZGV4ZXM7IC8vIEFuZCB3ZSBuZWVkIHRvIHN0b3JlIHRoZXNlIGluZGV4ZXMgYmVjYXVzZSB0aGV5J3JlIG5lZWRlZCBieSBgYWRqdXN0Q2FyZXRQb3NpdGlvbmBcblxuICAgICAgICBwbGFjZWhvbGRlciA9IGNvbnZlcnRNYXNrVG9QbGFjZWhvbGRlcihtYXNrLCBwbGFjZWhvbGRlckNoYXIpO1xuXG4gICAgICAgIC8vIElmIHRoZSBgcHJvdmlkZWRNYXNrYCBpcyBub3QgYSBmdW5jdGlvbiwgd2UganVzdCB1c2UgaXQgYXMtaXMuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXNrID0gcHJvdmlkZWRNYXNrO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUgZm9sbG93aW5nIG9iamVjdCB3aWxsIGJlIHBhc3NlZCB0byBgY29uZm9ybVRvTWFza2AgdG8gZGV0ZXJtaW5lIGhvdyB0aGUgYHJhd1ZhbHVlYCB3aWxsIGJlIGNvbmZvcm1lZFxuICAgICAgY29uc3QgY29uZm9ybVRvTWFza0NvbmZpZyA9IHtcbiAgICAgICAgcHJldmlvdXNDb25mb3JtZWRWYWx1ZSxcbiAgICAgICAgZ3VpZGUsXG4gICAgICAgIHBsYWNlaG9sZGVyQ2hhcixcbiAgICAgICAgcGlwZSxcbiAgICAgICAgcGxhY2Vob2xkZXIsXG4gICAgICAgIGN1cnJlbnRDYXJldFBvc2l0aW9uLFxuICAgICAgICBrZWVwQ2hhclBvc2l0aW9ucyxcbiAgICAgIH07XG5cbiAgICAgIC8vIGBjb25mb3JtVG9NYXNrYCByZXR1cm5zIGBjb25mb3JtZWRWYWx1ZWAgYXMgcGFydCBvZiBhbiBvYmplY3QgZm9yIGZ1dHVyZSBBUEkgZmxleGliaWxpdHlcbiAgICAgIGNvbnN0IHsgY29uZm9ybWVkVmFsdWUgfSA9IGNvbmZvcm1Ub01hc2soXG4gICAgICAgIHNhZmVSYXdWYWx1ZSxcbiAgICAgICAgbWFzayxcbiAgICAgICAgY29uZm9ybVRvTWFza0NvbmZpZyxcbiAgICAgICk7XG5cbiAgICAgIC8vIFRoZSBmb2xsb3dpbmcgZmV3IGxpbmVzIGFyZSB0byBzdXBwb3J0IHRoZSBgcGlwZWAgZmVhdHVyZS5cbiAgICAgIGNvbnN0IHBpcGVkID0gdHlwZW9mIHBpcGUgPT09ICdmdW5jdGlvbic7XG5cbiAgICAgIGxldCBwaXBlUmVzdWx0cyA9IHt9O1xuXG4gICAgICAvLyBJZiBgcGlwZWAgaXMgYSBmdW5jdGlvbiwgd2UgY2FsbCBpdC5cbiAgICAgIGlmIChwaXBlZCkge1xuICAgICAgICAvLyBgcGlwZWAgcmVjZWl2ZXMgdGhlIGBjb25mb3JtZWRWYWx1ZWAgYW5kIHRoZSBjb25maWd1cmF0aW9ucyB3aXRoIHdoaWNoIGBjb25mb3JtVG9NYXNrYCB3YXMgY2FsbGVkLlxuICAgICAgICBwaXBlUmVzdWx0cyA9IHBpcGUoY29uZm9ybWVkVmFsdWUsIHtcbiAgICAgICAgICByYXdWYWx1ZTogc2FmZVJhd1ZhbHVlLFxuICAgICAgICAgIC4uLmNvbmZvcm1Ub01hc2tDb25maWcsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGBwaXBlUmVzdWx0c2Agc2hvdWxkIGJlIGFuIG9iamVjdC4gQnV0IGFzIGEgY29udmVuaWVuY2UsIHdlIGFsbG93IHRoZSBwaXBlIGF1dGhvciB0byBqdXN0IHJldHVybiBgZmFsc2VgIHRvXG4gICAgICAgIC8vIGluZGljYXRlIHJlamVjdGlvbi4gT3IgcmV0dXJuIGp1c3QgYSBzdHJpbmcgd2hlbiB0aGVyZSBhcmUgbm8gcGlwZWQgY2hhcmFjdGVycy5cbiAgICAgICAgLy8gSWYgdGhlIGBwaXBlYCByZXR1cm5zIGBmYWxzZWAgb3IgYSBzdHJpbmcsIHRoZSBibG9jayBiZWxvdyB0dXJucyBpdCBpbnRvIGFuIG9iamVjdCB0aGF0IHRoZSByZXN0XG4gICAgICAgIC8vIG9mIHRoZSBjb2RlIGNhbiB3b3JrIHdpdGguXG4gICAgICAgIGlmIChwaXBlUmVzdWx0cyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgYHBpcGVgIHJlamVjdHMgYGNvbmZvcm1lZFZhbHVlYCwgd2UgdXNlIHRoZSBgcHJldmlvdXNDb25mb3JtZWRWYWx1ZWAsIGFuZCBzZXQgYHJlamVjdGVkYCB0byBgdHJ1ZWAuXG4gICAgICAgICAgcGlwZVJlc3VsdHMgPSB7IHZhbHVlOiBwcmV2aW91c0NvbmZvcm1lZFZhbHVlLCByZWplY3RlZDogdHJ1ZSB9O1xuICAgICAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKHBpcGVSZXN1bHRzKSkge1xuICAgICAgICAgIHBpcGVSZXN1bHRzID0geyB2YWx1ZTogcGlwZVJlc3VsdHMgfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBCZWZvcmUgd2UgcHJvY2VlZCwgd2UgbmVlZCB0byBrbm93IHdoaWNoIGNvbmZvcm1lZCB2YWx1ZSB0byB1c2UsIHRoZSBvbmUgcmV0dXJuZWQgYnkgdGhlIHBpcGUgb3IgdGhlIG9uZVxuICAgICAgLy8gcmV0dXJuZWQgYnkgYGNvbmZvcm1Ub01hc2tgLlxuICAgICAgY29uc3QgZmluYWxDb25mb3JtZWRWYWx1ZSA9IHBpcGVkXG4gICAgICAgID8gKHBpcGVSZXN1bHRzIGFzIGFueSkudmFsdWVcbiAgICAgICAgOiBjb25mb3JtZWRWYWx1ZTtcblxuICAgICAgLy8gQWZ0ZXIgZGV0ZXJtaW5pbmcgdGhlIGNvbmZvcm1lZCB2YWx1ZSwgd2Ugd2lsbCBuZWVkIHRvIGtub3cgd2hlcmUgdG8gc2V0XG4gICAgICAvLyB0aGUgY2FyZXQgcG9zaXRpb24uIGBhZGp1c3RDYXJldFBvc2l0aW9uYCB3aWxsIHRlbGwgdXMuXG4gICAgICBjb25zdCBhZGp1c3RlZENhcmV0UG9zaXRpb24gPSBhZGp1c3RDYXJldFBvc2l0aW9uKHtcbiAgICAgICAgcHJldmlvdXNDb25mb3JtZWRWYWx1ZSxcbiAgICAgICAgcHJldmlvdXNQbGFjZWhvbGRlcixcbiAgICAgICAgY29uZm9ybWVkVmFsdWU6IGZpbmFsQ29uZm9ybWVkVmFsdWUsXG4gICAgICAgIHBsYWNlaG9sZGVyLFxuICAgICAgICByYXdWYWx1ZTogc2FmZVJhd1ZhbHVlLFxuICAgICAgICBjdXJyZW50Q2FyZXRQb3NpdGlvbixcbiAgICAgICAgcGxhY2Vob2xkZXJDaGFyLFxuICAgICAgICBpbmRleGVzT2ZQaXBlZENoYXJzOiAocGlwZVJlc3VsdHMgYXMgYW55KS5pbmRleGVzT2ZQaXBlZENoYXJzLFxuICAgICAgICBjYXJldFRyYXBJbmRleGVzLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRleHQgTWFzayBzZXRzIHRoZSBpbnB1dCB2YWx1ZSB0byBhbiBlbXB0eSBzdHJpbmcgd2hlbiB0aGUgY29uZGl0aW9uIGJlbG93IGlzIHNldC4gSXQgcHJvdmlkZXMgYSBiZXR0ZXIgVVguXG4gICAgICBjb25zdCBpbnB1dFZhbHVlU2hvdWxkQmVFbXB0eSA9XG4gICAgICAgIGZpbmFsQ29uZm9ybWVkVmFsdWUgPT09IHBsYWNlaG9sZGVyICYmIGFkanVzdGVkQ2FyZXRQb3NpdGlvbiA9PT0gMDtcbiAgICAgIGNvbnN0IGVtcHR5VmFsdWUgPSBzaG93TWFzayA/IHBsYWNlaG9sZGVyIDogZW1wdHlTdHJpbmc7XG4gICAgICBjb25zdCBpbnB1dEVsZW1lbnRWYWx1ZSA9IGlucHV0VmFsdWVTaG91bGRCZUVtcHR5XG4gICAgICAgID8gZW1wdHlWYWx1ZVxuICAgICAgICA6IGZpbmFsQ29uZm9ybWVkVmFsdWU7XG5cbiAgICAgIHN0YXRlLnByZXZpb3VzQ29uZm9ybWVkVmFsdWUgPSBpbnB1dEVsZW1lbnRWYWx1ZTsgLy8gc3RvcmUgdmFsdWUgZm9yIGFjY2VzcyBmb3IgbmV4dCB0aW1lXG4gICAgICBzdGF0ZS5wcmV2aW91c1BsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXI7XG5cbiAgICAgIC8vIEluIHNvbWUgY2FzZXMsIHRoaXMgYHVwZGF0ZWAgbWV0aG9kIHdpbGwgYmUgcmVwZWF0ZWRseSBjYWxsZWQgd2l0aCBhIHJhdyB2YWx1ZSB0aGF0IGhhcyBhbHJlYWR5IGJlZW4gY29uZm9ybWVkXG4gICAgICAvLyBhbmQgc2V0IHRvIGBpbnB1dEVsZW1lbnQudmFsdWVgLiBUaGUgYmVsb3cgY2hlY2sgZ3VhcmRzIGFnYWluc3QgbmVlZGxlc3NseSByZWFkanVzdGluZyB0aGUgaW5wdXQgc3RhdGUuXG4gICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3RleHQtbWFzay90ZXh0LW1hc2svaXNzdWVzLzIzMVxuICAgICAgaWYgKGlucHV0RWxlbWVudC52YWx1ZSA9PT0gaW5wdXRFbGVtZW50VmFsdWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpbnB1dEVsZW1lbnQudmFsdWUgPSBpbnB1dEVsZW1lbnRWYWx1ZTsgLy8gc2V0IHRoZSBpbnB1dCB2YWx1ZVxuICAgICAgc2FmZVNldFNlbGVjdGlvbihpbnB1dEVsZW1lbnQsIGFkanVzdGVkQ2FyZXRQb3NpdGlvbik7IC8vIGFkanVzdCBjYXJldCBwb3NpdGlvblxuICAgIH0sXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNhZmVTZXRTZWxlY3Rpb24oZWxlbWVudDogYW55LCBzZWxlY3Rpb25Qb3NpdGlvbjogYW55KTogYW55IHtcbiAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGVsZW1lbnQpIHtcbiAgICBpZiAoaXNBbmRyb2lkKSB7XG4gICAgICBkZWZlcihcbiAgICAgICAgKCkgPT5cbiAgICAgICAgICBlbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKFxuICAgICAgICAgICAgc2VsZWN0aW9uUG9zaXRpb24sXG4gICAgICAgICAgICBzZWxlY3Rpb25Qb3NpdGlvbixcbiAgICAgICAgICAgICdub25lJyxcbiAgICAgICAgICApLFxuICAgICAgICAwLFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5zZXRTZWxlY3Rpb25SYW5nZShzZWxlY3Rpb25Qb3NpdGlvbiwgc2VsZWN0aW9uUG9zaXRpb24sICdub25lJyk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFNhZmVSYXdWYWx1ZShpbnB1dFZhbHVlOiBhbnkpOiBhbnkge1xuICBpZiAoaXNTdHJpbmcoaW5wdXRWYWx1ZSkpIHtcbiAgICByZXR1cm4gaW5wdXRWYWx1ZTtcbiAgfSBlbHNlIGlmIChpc051bWJlcihpbnB1dFZhbHVlKSkge1xuICAgIHJldHVybiBTdHJpbmcoaW5wdXRWYWx1ZSk7XG4gIH0gZWxzZSBpZiAoaW5wdXRWYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IGlucHV0VmFsdWUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZW1wdHlTdHJpbmc7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgXCJUaGUgJ3ZhbHVlJyBwcm92aWRlZCB0byBUZXh0IE1hc2sgbmVlZHMgdG8gYmUgYSBzdHJpbmcgb3IgYSBudW1iZXIuIFRoZSB2YWx1ZSBcIiArXG4gICAgICAgIGByZWNlaXZlZCB3YXM6XFxuXFxuICR7SlNPTi5zdHJpbmdpZnkoaW5wdXRWYWx1ZSl9YCxcbiAgICApO1xuICB9XG59XG4iXX0=