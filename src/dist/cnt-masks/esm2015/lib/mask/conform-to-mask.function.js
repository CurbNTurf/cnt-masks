export const defaultPlaceholderChar = '_';
const emptyArray = [];
const emptyString = '';
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
export function processCaretTraps(mask) {
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
export function conformToMask(rawValue = emptyString, mask = emptyArray, config = {}) {
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
    const { guide = true, previousConformedValue = emptyString, placeholderChar = defaultPlaceholderChar, placeholder = convertMaskToPlaceholder(mask, placeholderChar), currentCaretPosition, keepCharPositions, } = config;
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
        let compensatingPlaceholderChars = emptyString;
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
    const rawValueArr = rawValue.split(emptyString).map((char, i) => ({
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
    let conformedValue = emptyString;
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
                            previousConformedValue === emptyString ||
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
            conformedValue = emptyString;
        }
    }
    return { conformedValue, meta: { someCharsRejected } };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZm9ybS10by1tYXNrLmZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY250LW1hc2tzL3NyYy9saWIvbWFzay9jb25mb3JtLXRvLW1hc2suZnVuY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQUcsR0FBRyxDQUFDO0FBRTFDLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFFdkIsU0FBUyx3QkFBd0IsQ0FDL0IsT0FBYyxVQUFVLEVBQ3hCLGtCQUEwQixzQkFBc0I7SUFFaEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FDYix5RUFBeUUsQ0FDMUUsQ0FBQztLQUNIO0lBRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1FBQ3hDLE1BQU0sSUFBSSxLQUFLLENBQ2IseUZBQXlGO1lBQ3ZGLHFFQUFxRTtZQUNyRSxtREFBbUQsSUFBSSxDQUFDLFNBQVMsQ0FDL0QsZUFBZSxDQUNoQixNQUFNO1lBQ1Asa0NBQWtDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FDM0QsQ0FBQztLQUNIO0lBRUQsT0FBTyxJQUFJO1NBQ1IsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDWixPQUFPLElBQUksWUFBWSxNQUFNLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3pELENBQUMsQ0FBQztTQUNELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNkLENBQUM7QUFFRCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDMUIsTUFBTSxVQUFVLGlCQUFpQixDQUMvQixJQUFXO0lBRVgs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c0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGRlZmF1bHRQbGFjZWhvbGRlckNoYXIgPSAnXyc7XG5cbmNvbnN0IGVtcHR5QXJyYXkgPSBbXTtcbmNvbnN0IGVtcHR5U3RyaW5nID0gJyc7XG5cbmZ1bmN0aW9uIGNvbnZlcnRNYXNrVG9QbGFjZWhvbGRlcihcbiAgbWFzazogYW55W10gPSBlbXB0eUFycmF5LFxuICBwbGFjZWhvbGRlckNoYXI6IHN0cmluZyA9IGRlZmF1bHRQbGFjZWhvbGRlckNoYXIsXG4pOiBzdHJpbmcge1xuICBpZiAoIUFycmF5LmlzQXJyYXkobWFzaykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnVGV4dC1tYXNrOmNvbnZlcnRNYXNrVG9QbGFjZWhvbGRlcjsgVGhlIG1hc2sgcHJvcGVydHkgbXVzdCBiZSBhbiBhcnJheS4nLFxuICAgICk7XG4gIH1cblxuICBpZiAobWFzay5pbmRleE9mKHBsYWNlaG9sZGVyQ2hhcikgIT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ1BsYWNlaG9sZGVyIGNoYXJhY3RlciBtdXN0IG5vdCBiZSB1c2VkIGFzIHBhcnQgb2YgdGhlIG1hc2suIFBsZWFzZSBzcGVjaWZ5IGEgY2hhcmFjdGVyICcgK1xuICAgICAgICAndGhhdCBpcyBub3QgcHJlc2VudCBpbiB5b3VyIG1hc2sgYXMgeW91ciBwbGFjZWhvbGRlciBjaGFyYWN0ZXIuXFxuXFxuJyArXG4gICAgICAgIGBUaGUgcGxhY2Vob2xkZXIgY2hhcmFjdGVyIHRoYXQgd2FzIHJlY2VpdmVkIGlzOiAke0pTT04uc3RyaW5naWZ5KFxuICAgICAgICAgIHBsYWNlaG9sZGVyQ2hhcixcbiAgICAgICAgKX1cXG5cXG5gICtcbiAgICAgICAgYFRoZSBtYXNrIHRoYXQgd2FzIHJlY2VpdmVkIGlzOiAke0pTT04uc3RyaW5naWZ5KG1hc2spfWAsXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBtYXNrXG4gICAgLm1hcCgoY2hhcikgPT4ge1xuICAgICAgcmV0dXJuIGNoYXIgaW5zdGFuY2VvZiBSZWdFeHAgPyBwbGFjZWhvbGRlckNoYXIgOiBjaGFyO1xuICAgIH0pXG4gICAgLmpvaW4oJycpO1xufVxuXG5jb25zdCBzdHJDYXJldFRyYXAgPSAnW10nO1xuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NDYXJldFRyYXBzKFxuICBtYXNrOiBhbnlbXSxcbik6IHsgbWFza1dpdGhvdXRDYXJldFRyYXBzOiBhbnk7IGluZGV4ZXM6IGFueVtdIH0ge1xuICBjb25zdCBpbmRleGVzID0gW107XG5cbiAgbGV0IGluZGV4T2ZDYXJldFRyYXA7XG4gIHdoaWxlIChcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLWNvbmRpdGlvbmFsLWFzc2lnbm1lbnRcbiAgICAoKGluZGV4T2ZDYXJldFRyYXAgPSBtYXNrLmluZGV4T2Yoc3RyQ2FyZXRUcmFwKSksIGluZGV4T2ZDYXJldFRyYXAgIT09IC0xKVxuICApIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgaW5kZXhlcy5wdXNoKGluZGV4T2ZDYXJldFRyYXApO1xuXG4gICAgbWFzay5zcGxpY2UoaW5kZXhPZkNhcmV0VHJhcCwgMSk7XG4gIH1cblxuICByZXR1cm4geyBtYXNrV2l0aG91dENhcmV0VHJhcHM6IG1hc2ssIGluZGV4ZXMgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbmZvcm1Ub01hc2soXG4gIHJhd1ZhbHVlOiBzdHJpbmcgPSBlbXB0eVN0cmluZyxcbiAgbWFzazogYW55W10gfCBhbnkgPSBlbXB0eUFycmF5LFxuICBjb25maWc6IGFueSA9IHt9LFxuKTogeyBjb25mb3JtZWRWYWx1ZTogc3RyaW5nOyBtZXRhOiB7IHNvbWVDaGFyc1JlamVjdGVkOiBib29sZWFuIH0gfSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShtYXNrKSkge1xuICAgIC8vIElmIHNvbWVvbmUgcGFzc2VzIGEgZnVuY3Rpb24gYXMgdGhlIG1hc2sgcHJvcGVydHksIHdlIHNob3VsZCBjYWxsIHRoZVxuICAgIC8vIGZ1bmN0aW9uIHRvIGdldCB0aGUgbWFzayBhcnJheSAtIE5vcm1hbGx5IHRoaXMgaXMgaGFuZGxlZCBieSB0aGVcbiAgICAvLyBgY3JlYXRlVGV4dE1hc2tJbnB1dEVsZW1lbnQ6dXBkYXRlYCBmdW5jdGlvbiAtIHRoaXMgYWxsb3dzIG1hc2sgZnVuY3Rpb25zXG4gICAgLy8gdG8gYmUgdXNlZCBkaXJlY3RseSB3aXRoIGBjb25mb3JtVG9NYXNrYFxuICAgIGlmICh0eXBlb2YgbWFzayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gY2FsbCB0aGUgbWFzayBmdW5jdGlvbiB0byBnZXQgdGhlIG1hc2sgYXJyYXlcbiAgICAgIG1hc2sgPSBtYXNrKHJhd1ZhbHVlLCBjb25maWcpO1xuXG4gICAgICAvLyBtYXNrIGZ1bmN0aW9ucyBjYW4gc2V0dXAgY2FyZXQgdHJhcHMgdG8gaGF2ZSBzb21lIGNvbnRyb2wgb3ZlciBob3cgdGhlIGNhcmV0IG1vdmVzLiBXZSBuZWVkIHRvIHByb2Nlc3NcbiAgICAgIC8vIHRoZSBtYXNrIGZvciBhbnkgY2FyZXQgdHJhcHMuIGBwcm9jZXNzQ2FyZXRUcmFwc2Agd2lsbCByZW1vdmUgdGhlIGNhcmV0IHRyYXBzIGZyb20gdGhlIG1hc2tcbiAgICAgIG1hc2sgPSBwcm9jZXNzQ2FyZXRUcmFwcyhtYXNrKS5tYXNrV2l0aG91dENhcmV0VHJhcHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ1RleHQtbWFzazpjb25mb3JtVG9NYXNrOyBUaGUgbWFzayBwcm9wZXJ0eSBtdXN0IGJlIGFuIGFycmF5LicsXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8vIFRoZXNlIGNvbmZpZ3VyYXRpb25zIHRlbGwgdXMgaG93IHRvIGNvbmZvcm0gdGhlIG1hc2tcbiAgY29uc3Qge1xuICAgIGd1aWRlID0gdHJ1ZSxcbiAgICBwcmV2aW91c0NvbmZvcm1lZFZhbHVlID0gZW1wdHlTdHJpbmcsXG4gICAgcGxhY2Vob2xkZXJDaGFyID0gZGVmYXVsdFBsYWNlaG9sZGVyQ2hhcixcbiAgICBwbGFjZWhvbGRlciA9IGNvbnZlcnRNYXNrVG9QbGFjZWhvbGRlcihtYXNrLCBwbGFjZWhvbGRlckNoYXIpLFxuICAgIGN1cnJlbnRDYXJldFBvc2l0aW9uLFxuICAgIGtlZXBDaGFyUG9zaXRpb25zLFxuICB9ID0gY29uZmlnO1xuXG4gIC8vIFRoZSBjb25maWdzIGJlbG93IGluZGljYXRlIHRoYXQgdGhlIHVzZXIgd2FudHMgdGhlIGFsZ29yaXRobSB0byB3b3JrIGluICpubyBndWlkZSogbW9kZVxuICBjb25zdCBzdXBwcmVzc0d1aWRlID0gZ3VpZGUgPT09IGZhbHNlICYmIHByZXZpb3VzQ29uZm9ybWVkVmFsdWUgIT09IHVuZGVmaW5lZDtcblxuICAvLyBDYWxjdWxhdGUgbGVuZ3RocyBvbmNlIGZvciBwZXJmb3JtYW5jZVxuICBjb25zdCByYXdWYWx1ZUxlbmd0aCA9IHJhd1ZhbHVlLmxlbmd0aDtcbiAgY29uc3QgcHJldmlvdXNDb25mb3JtZWRWYWx1ZUxlbmd0aCA9IHByZXZpb3VzQ29uZm9ybWVkVmFsdWUubGVuZ3RoO1xuICBjb25zdCBwbGFjZWhvbGRlckxlbmd0aCA9IHBsYWNlaG9sZGVyLmxlbmd0aDtcbiAgY29uc3QgbWFza0xlbmd0aCA9IG1hc2subGVuZ3RoO1xuXG4gIC8vIFRoaXMgdGVsbHMgdXMgdGhlIG51bWJlciBvZiBlZGl0ZWQgY2hhcmFjdGVycyBhbmQgdGhlIGRpcmVjdGlvbiBpbiB3aGljaCB0aGV5IHdlcmUgZWRpdGVkICgrLy0pXG4gIGNvbnN0IGVkaXREaXN0YW5jZSA9IHJhd1ZhbHVlTGVuZ3RoIC0gcHJldmlvdXNDb25mb3JtZWRWYWx1ZUxlbmd0aDtcblxuICAvLyBJbiAqbm8gZ3VpZGUqIG1vZGUsIHdlIG5lZWQgdG8ga25vdyBpZiB0aGUgdXNlciBpcyB0cnlpbmcgdG8gYWRkIGEgY2hhcmFjdGVyIG9yIG5vdFxuICBjb25zdCBpc0FkZGl0aW9uID0gZWRpdERpc3RhbmNlID4gMDtcblxuICAvLyBUZWxscyB1cyB0aGUgaW5kZXggb2YgdGhlIGZpcnN0IGNoYW5nZS4gRm9yICg0MzgpIDM5NC00OTM4IHRvICgzOCkgMzk0LTQ5MzgsIHRoYXQgd291bGQgYmUgMVxuICBjb25zdCBpbmRleE9mRmlyc3RDaGFuZ2UgPVxuICAgIGN1cnJlbnRDYXJldFBvc2l0aW9uICsgKGlzQWRkaXRpb24gPyAtZWRpdERpc3RhbmNlIDogMCk7XG5cbiAgLy8gV2UncmUgYWxzbyBnb25uYSBuZWVkIHRoZSBpbmRleCBvZiBsYXN0IGNoYW5nZSwgd2hpY2ggd2UgY2FuIGRlcml2ZSBhcyBmb2xsb3dzLi4uXG4gIGNvbnN0IGluZGV4T2ZMYXN0Q2hhbmdlID0gaW5kZXhPZkZpcnN0Q2hhbmdlICsgTWF0aC5hYnMoZWRpdERpc3RhbmNlKTtcblxuICAvLyBJZiBgY29uZm9ybVRvTWFza2AgaXMgY29uZmlndXJlZCB0byBrZWVwIGNoYXJhY3RlciBwb3NpdGlvbnMsIHRoYXQgaXMsIGZvciBtYXNrIDExMSwgcHJldmlvdXMgdmFsdWVcbiAgLy8gXzJfIGFuZCByYXcgdmFsdWUgM18yXywgdGhlIG5ldyBjb25mb3JtZWQgdmFsdWUgc2hvdWxkIGJlIDMyXywgbm90IDNfMiAoZGVmYXVsdCBiZWhhdmlvcikuIFRoYXQncyBpbiB0aGUgY2FzZSBvZlxuICAvLyBhZGRpdGlvbi4gQW5kIGluIHRoZSBjYXNlIG9mIGRlbGV0aW9uLCBwcmV2aW91cyB2YWx1ZSBfMjMsIHJhdyB2YWx1ZSBfMywgdGhlIG5ldyBjb25mb3JtZWQgc3RyaW5nIHNob3VsZCBiZVxuICAvLyBfXzMsIG5vdCBfM18gKGRlZmF1bHQgYmVoYXZpb3IpXG4gIC8vXG4gIC8vIFRoZSBuZXh0IGJsb2NrIG9mIGxvZ2ljIGhhbmRsZXMga2VlcGluZyBjaGFyYWN0ZXIgcG9zaXRpb25zIGZvciB0aGUgY2FzZSBvZiBkZWxldGlvbi4gKEtlZXBpbmdcbiAgLy8gY2hhcmFjdGVyIHBvc2l0aW9ucyBmb3IgdGhlIGNhc2Ugb2YgYWRkaXRpb24gaXMgZnVydGhlciBkb3duIHNpbmNlIGl0IGlzIGhhbmRsZWQgZGlmZmVyZW50bHkuKVxuICAvLyBUbyBkbyB0aGlzLCB3ZSB3YW50IHRvIGNvbXBlbnNhdGUgZm9yIGFsbCBjaGFyYWN0ZXJzIHRoYXQgd2VyZSBkZWxldGVkXG4gIGlmIChrZWVwQ2hhclBvc2l0aW9ucyA9PT0gdHJ1ZSAmJiAhaXNBZGRpdGlvbikge1xuICAgIC8vIFdlIHdpbGwgYmUgc3RvcmluZyB0aGUgbmV3IHBsYWNlaG9sZGVyIGNoYXJhY3RlcnMgaW4gdGhpcyB2YXJpYWJsZS5cbiAgICBsZXQgY29tcGVuc2F0aW5nUGxhY2Vob2xkZXJDaGFycyA9IGVtcHR5U3RyaW5nO1xuXG4gICAgLy8gRm9yIGV2ZXJ5IGNoYXJhY3RlciB0aGF0IHdhcyBkZWxldGVkIGZyb20gYSBwbGFjZWhvbGRlciBwb3NpdGlvbiwgd2UgYWRkIGEgcGxhY2Vob2xkZXIgY2hhclxuICAgIGZvciAobGV0IGkgPSBpbmRleE9mRmlyc3RDaGFuZ2U7IGkgPCBpbmRleE9mTGFzdENoYW5nZTsgaSsrKSB7XG4gICAgICBpZiAocGxhY2Vob2xkZXJbaV0gPT09IHBsYWNlaG9sZGVyQ2hhcikge1xuICAgICAgICBjb21wZW5zYXRpbmdQbGFjZWhvbGRlckNoYXJzICs9IHBsYWNlaG9sZGVyQ2hhcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOb3cgd2UgdHJpY2sgb3VyIGFsZ29yaXRobSBieSBtb2RpZnlpbmcgdGhlIHJhdyB2YWx1ZSB0byBtYWtlIGl0IGNvbnRhaW4gYWRkaXRpb25hbCBwbGFjZWhvbGRlciBjaGFyYWN0ZXJzXG4gICAgLy8gVGhhdCB3YXkgd2hlbiB0aGUgd2Ugc3RhcnQgbGF5aW5nIHRoZSBjaGFyYWN0ZXJzIGFnYWluIG9uIHRoZSBtYXNrLCBpdCB3aWxsIGtlZXAgdGhlIG5vbi1kZWxldGVkIGNoYXJhY3RlcnNcbiAgICAvLyBpbiB0aGVpciBwb3NpdGlvbnMuXG4gICAgcmF3VmFsdWUgPVxuICAgICAgcmF3VmFsdWUuc2xpY2UoMCwgaW5kZXhPZkZpcnN0Q2hhbmdlKSArXG4gICAgICBjb21wZW5zYXRpbmdQbGFjZWhvbGRlckNoYXJzICtcbiAgICAgIHJhd1ZhbHVlLnNsaWNlKGluZGV4T2ZGaXJzdENoYW5nZSwgcmF3VmFsdWVMZW5ndGgpO1xuICB9XG5cbiAgLy8gQ29udmVydCBgcmF3VmFsdWVgIHN0cmluZyB0byBhbiBhcnJheSwgYW5kIG1hcmsgY2hhcmFjdGVycyBiYXNlZCBvbiB3aGV0aGVyIHRoZXkgYXJlIG5ld2x5IGFkZGVkIG9yIGhhdmVcbiAgLy8gZXhpc3RlZCBpbiB0aGUgcHJldmlvdXMgY29uZm9ybWVkIHZhbHVlLiBJZGVudGlmeWluZyBuZXcgYW5kIG9sZCBjaGFyYWN0ZXJzIGlzIG5lZWRlZCBmb3IgYGNvbmZvcm1Ub01hc2tgXG4gIC8vIHRvIHdvcmsgaWYgaXQgaXMgY29uZmlndXJlZCB0byBrZWVwIGNoYXJhY3RlciBwb3NpdGlvbnMuXG4gIGNvbnN0IHJhd1ZhbHVlQXJyID0gcmF3VmFsdWUuc3BsaXQoZW1wdHlTdHJpbmcpLm1hcCgoY2hhciwgaSkgPT4gKHtcbiAgICBjaGFyLFxuICAgIGlzTmV3OiBpID49IGluZGV4T2ZGaXJzdENoYW5nZSAmJiBpIDwgaW5kZXhPZkxhc3RDaGFuZ2UsXG4gIH0pKTtcblxuICAvLyBUaGUgbG9vcCBiZWxvdyByZW1vdmVzIG1hc2tpbmcgY2hhcmFjdGVycyBmcm9tIHVzZXIgaW5wdXQuIEZvciBleGFtcGxlLCBmb3IgbWFza1xuICAvLyBgMDAgKDExMSlgLCB0aGUgcGxhY2Vob2xkZXIgd291bGQgYmUgYDAwIChfX18pYC4gSWYgdXNlciBpbnB1dCBpcyBgMDAgKDIzNClgLCB0aGUgbG9vcCBiZWxvd1xuICAvLyB3b3VsZCByZW1vdmUgYWxsIGNoYXJhY3RlcnMgYnV0IGAyMzRgIGZyb20gdGhlIGByYXdWYWx1ZUFycmAuIFRoZSByZXN0IG9mIHRoZSBhbGdvcml0aG1cbiAgLy8gdGhlbiB3b3VsZCBsYXkgYDIzNGAgb24gdG9wIG9mIHRoZSBhdmFpbGFibGUgcGxhY2Vob2xkZXIgcG9zaXRpb25zIGluIHRoZSBtYXNrLlxuICBmb3IgKGxldCBpID0gcmF3VmFsdWVMZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGNvbnN0IHsgY2hhciB9ID0gcmF3VmFsdWVBcnJbaV07XG5cbiAgICBpZiAoY2hhciAhPT0gcGxhY2Vob2xkZXJDaGFyKSB7XG4gICAgICBjb25zdCBzaG91bGRPZmZzZXQgPVxuICAgICAgICBpID49IGluZGV4T2ZGaXJzdENoYW5nZSAmJiBwcmV2aW91c0NvbmZvcm1lZFZhbHVlTGVuZ3RoID09PSBtYXNrTGVuZ3RoO1xuXG4gICAgICBpZiAoY2hhciA9PT0gcGxhY2Vob2xkZXJbc2hvdWxkT2Zmc2V0ID8gaSAtIGVkaXREaXN0YW5jZSA6IGldKSB7XG4gICAgICAgIHJhd1ZhbHVlQXJyLnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBUaGlzIGlzIHRoZSB2YXJpYWJsZSB0aGF0IHdlIHdpbGwgYmUgZmlsbGluZyB3aXRoIGNoYXJhY3RlcnMgYXMgd2UgZmlndXJlIHRoZW0gb3V0XG4gIC8vIGluIHRoZSBhbGdvcml0aG0gYmVsb3dcbiAgbGV0IGNvbmZvcm1lZFZhbHVlID0gZW1wdHlTdHJpbmc7XG4gIGxldCBzb21lQ2hhcnNSZWplY3RlZCA9IGZhbHNlO1xuXG4gIC8vIE9rLCBzbyBmaXJzdCB3ZSBsb29wIHRocm91Z2ggdGhlIHBsYWNlaG9sZGVyIGxvb2tpbmcgZm9yIHBsYWNlaG9sZGVyIGNoYXJhY3RlcnMgdG8gZmlsbCB1cC5cbiAgcGxhY2Vob2xkZXJMb29wOiBmb3IgKGxldCBpID0gMDsgaSA8IHBsYWNlaG9sZGVyTGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjaGFySW5QbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyW2ldO1xuXG4gICAgLy8gV2Ugc2VlIG9uZS4gTGV0J3MgZmluZCBvdXQgd2hhdCB3ZSBjYW4gcHV0IGluIGl0LlxuICAgIGlmIChjaGFySW5QbGFjZWhvbGRlciA9PT0gcGxhY2Vob2xkZXJDaGFyKSB7XG4gICAgICAvLyBCdXQgYmVmb3JlIHRoYXQsIGRvIHdlIGFjdHVhbGx5IGhhdmUgYW55IHVzZXIgY2hhcmFjdGVycyB0aGF0IG5lZWQgYSBwbGFjZT9cbiAgICAgIGlmIChyYXdWYWx1ZUFyci5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIFdlIHdpbGwga2VlcCBjaGlwcGluZyBhd2F5IGF0IHVzZXIgaW5wdXQgdW50aWwgZWl0aGVyIHdlIHJ1biBvdXQgb2YgY2hhcmFjdGVyc1xuICAgICAgICAvLyBvciB3ZSBmaW5kIGF0IGxlYXN0IG9uZSBjaGFyYWN0ZXIgdGhhdCB3ZSBjYW4gbWFwLlxuICAgICAgICB3aGlsZSAocmF3VmFsdWVBcnIubGVuZ3RoID4gMCkge1xuICAgICAgICAgIC8vIExldCdzIHJldHJpZXZlIHRoZSBmaXJzdCB1c2VyIGNoYXJhY3RlciBpbiB0aGUgcXVldWUgb2YgY2hhcmFjdGVycyB3ZSBoYXZlIGxlZnRcbiAgICAgICAgICBjb25zdCB7IGNoYXI6IHJhd1ZhbHVlQ2hhciwgaXNOZXcgfSA9IHJhd1ZhbHVlQXJyLnNoaWZ0KCk7XG5cbiAgICAgICAgICAvLyBJZiB0aGUgY2hhcmFjdGVyIHdlIGdvdCBmcm9tIHRoZSB1c2VyIGlucHV0IGlzIGEgcGxhY2Vob2xkZXIgY2hhcmFjdGVyICh3aGljaCBoYXBwZW5zXG4gICAgICAgICAgLy8gcmVndWxhcmx5IGJlY2F1c2UgdXNlciBpbnB1dCBjb3VsZCBiZSBzb21ldGhpbmcgbGlrZSAoNTQwKSA5MF8tX19fXywgd2hpY2ggaW5jbHVkZXNcbiAgICAgICAgICAvLyBhIGJ1bmNoIG9mIGBfYCB3aGljaCBhcmUgcGxhY2Vob2xkZXIgY2hhcmFjdGVycykgYW5kIHdlIGFyZSBub3QgaW4gKm5vIGd1aWRlKiBtb2RlLFxuICAgICAgICAgIC8vIHRoZW4gd2UgbWFwIHRoaXMgcGxhY2Vob2xkZXIgY2hhcmFjdGVyIHRvIHRoZSBjdXJyZW50IHNwb3QgaW4gdGhlIHBsYWNlaG9sZGVyXG4gICAgICAgICAgaWYgKHJhd1ZhbHVlQ2hhciA9PT0gcGxhY2Vob2xkZXJDaGFyICYmIHN1cHByZXNzR3VpZGUgIT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbmZvcm1lZFZhbHVlICs9IHBsYWNlaG9sZGVyQ2hhcjtcblxuICAgICAgICAgICAgLy8gQW5kIHdlIGdvIHRvIGZpbmQgdGhlIG5leHQgcGxhY2Vob2xkZXIgY2hhcmFjdGVyIHRoYXQgbmVlZHMgZmlsbGluZ1xuICAgICAgICAgICAgY29udGludWUgcGxhY2Vob2xkZXJMb29wO1xuXG4gICAgICAgICAgICAvLyBFbHNlIGlmLCB0aGUgY2hhcmFjdGVyIHdlIGdvdCBmcm9tIHRoZSB1c2VyIGlucHV0IGlzIG5vdCBhIHBsYWNlaG9sZGVyLCBsZXQncyBzZWVcbiAgICAgICAgICAgIC8vIGlmIHRoZSBjdXJyZW50IHBvc2l0aW9uIGluIHRoZSBtYXNrIGNhbiBhY2NlcHQgaXQuXG4gICAgICAgICAgfSBlbHNlIGlmIChtYXNrW2ldLnRlc3QocmF3VmFsdWVDaGFyKSkge1xuICAgICAgICAgICAgLy8gd2UgbWFwIHRoZSBjaGFyYWN0ZXIgZGlmZmVyZW50bHkgYmFzZWQgb24gd2hldGhlciB3ZSBhcmUga2VlcGluZyBjaGFyYWN0ZXIgcG9zaXRpb25zIG9yIG5vdC5cbiAgICAgICAgICAgIC8vIElmIGFueSBvZiB0aGUgY29uZGl0aW9ucyBiZWxvdyBhcmUgbWV0LCB3ZSBzaW1wbHkgbWFwIHRoZSByYXcgdmFsdWUgY2hhcmFjdGVyIHRvIHRoZVxuICAgICAgICAgICAgLy8gcGxhY2Vob2xkZXIgcG9zaXRpb24uXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGtlZXBDaGFyUG9zaXRpb25zICE9PSB0cnVlIHx8XG4gICAgICAgICAgICAgIGlzTmV3ID09PSBmYWxzZSB8fFxuICAgICAgICAgICAgICBwcmV2aW91c0NvbmZvcm1lZFZhbHVlID09PSBlbXB0eVN0cmluZyB8fFxuICAgICAgICAgICAgICBndWlkZSA9PT0gZmFsc2UgfHxcbiAgICAgICAgICAgICAgIWlzQWRkaXRpb25cbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBjb25mb3JtZWRWYWx1ZSArPSByYXdWYWx1ZUNoYXI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBXZSBlbnRlciB0aGlzIGJsb2NrIG9mIGNvZGUgaWYgd2UgYXJlIHRyeWluZyB0byBrZWVwIGNoYXJhY3RlciBwb3NpdGlvbnMgYW5kIG5vbmUgb2YgdGhlIGNvbmRpdGlvbnNcbiAgICAgICAgICAgICAgLy8gYWJvdmUgaXMgbWV0LiBJbiB0aGlzIGNhc2UsIHdlIG5lZWQgdG8gc2VlIGlmIHRoZXJlJ3MgYW4gYXZhaWxhYmxlIHNwb3QgZm9yIHRoZSByYXcgdmFsdWUgY2hhcmFjdGVyXG4gICAgICAgICAgICAgIC8vIHRvIGJlIG1hcHBlZCB0by4gSWYgd2UgY291bGRuJ3QgZmluZCBhIHNwb3QsIHdlIHdpbGwgZGlzY2FyZCB0aGUgY2hhcmFjdGVyLlxuICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAvLyBGb3IgZXhhbXBsZSwgZm9yIG1hc2sgYDExMTFgLCBwcmV2aW91cyBjb25mb3JtZWQgdmFsdWUgYF8yX19gLCByYXcgdmFsdWUgYDk0Ml8yX19gLiBXZSBjYW4gbWFwIHRoZVxuICAgICAgICAgICAgICAvLyBgOWAsIHRvIHRoZSBmaXJzdCBhdmFpbGFibGUgcGxhY2Vob2xkZXIgcG9zaXRpb24sIGJ1dCB0aGVuLCB0aGVyZSBhcmUgbm8gbW9yZSBzcG90cyBhdmFpbGFibGUgZm9yIHRoZVxuICAgICAgICAgICAgICAvLyBgNGAgYW5kIGAyYC4gU28sIHdlIGRpc2NhcmQgdGhlbSBhbmQgZW5kIHVwIHdpdGggYSBjb25mb3JtZWQgdmFsdWUgb2YgYDkyX19gLlxuICAgICAgICAgICAgICBjb25zdCByYXdWYWx1ZUFyckxlbmd0aCA9IHJhd1ZhbHVlQXJyLmxlbmd0aDtcbiAgICAgICAgICAgICAgbGV0IGluZGV4T2ZOZXh0QXZhaWxhYmxlUGxhY2Vob2xkZXJDaGFyID0gbnVsbDtcblxuICAgICAgICAgICAgICAvLyBMZXQncyBsb29wIHRocm91Z2ggdGhlIHJlbWFpbmluZyByYXcgdmFsdWUgY2hhcmFjdGVycy4gV2UgYXJlIGxvb2tpbmcgZm9yIGVpdGhlciBhIHN1aXRhYmxlIHNwb3QsIGllLFxuICAgICAgICAgICAgICAvLyBhIHBsYWNlaG9sZGVyIGNoYXJhY3RlciBvciBhIG5vbi1zdWl0YWJsZSBzcG90LCBpZSwgYSBub24tcGxhY2Vob2xkZXIgY2hhcmFjdGVyIHRoYXQgaXMgbm90IG5ldy5cbiAgICAgICAgICAgICAgLy8gSWYgd2Ugc2VlIGEgc3VpdGFibGUgc3BvdCBmaXJzdCwgd2Ugc3RvcmUgaXRzIHBvc2l0aW9uIGFuZCBleGl0IHRoZSBsb29wLiBJZiB3ZSBzZWUgYSBub24tc3VpdGFibGVcbiAgICAgICAgICAgICAgLy8gc3BvdCBmaXJzdCwgd2UgZXhpdCB0aGUgbG9vcCBhbmQgb3VyIGBpbmRleE9mTmV4dEF2YWlsYWJsZVBsYWNlaG9sZGVyQ2hhcmAgd2lsbCBzdGF5IGFzIGBudWxsYC5cbiAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCByYXdWYWx1ZUFyckxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hhckRhdGEgPSByYXdWYWx1ZUFycltqXTtcblxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgIGNoYXJEYXRhLmNoYXIgIT09IHBsYWNlaG9sZGVyQ2hhciAmJlxuICAgICAgICAgICAgICAgICAgY2hhckRhdGEuaXNOZXcgPT09IGZhbHNlXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoY2hhckRhdGEuY2hhciA9PT0gcGxhY2Vob2xkZXJDaGFyKSB7XG4gICAgICAgICAgICAgICAgICBpbmRleE9mTmV4dEF2YWlsYWJsZVBsYWNlaG9sZGVyQ2hhciA9IGo7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAvLyBJZiBgaW5kZXhPZk5leHRBdmFpbGFibGVQbGFjZWhvbGRlckNoYXJgIGlzIG5vdCBgbnVsbGAsIHRoYXQgbWVhbnMgdGhlIGNoYXJhY3RlciBpcyBub3QgYmxvY2tlZC5cbiAgICAgICAgICAgICAgLy8gV2UgY2FuIG1hcCBpdC4gQW5kIHRvIGtlZXAgdGhlIGNoYXJhY3RlciBwb3NpdGlvbnMsIHdlIHJlbW92ZSB0aGUgcGxhY2Vob2xkZXIgY2hhcmFjdGVyXG4gICAgICAgICAgICAgIC8vIGZyb20gdGhlIHJlbWFpbmluZyBjaGFyYWN0ZXJzXG4gICAgICAgICAgICAgIGlmIChpbmRleE9mTmV4dEF2YWlsYWJsZVBsYWNlaG9sZGVyQ2hhciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbmZvcm1lZFZhbHVlICs9IHJhd1ZhbHVlQ2hhcjtcbiAgICAgICAgICAgICAgICByYXdWYWx1ZUFyci5zcGxpY2UoaW5kZXhPZk5leHRBdmFpbGFibGVQbGFjZWhvbGRlckNoYXIsIDEpO1xuXG4gICAgICAgICAgICAgICAgLy8gSWYgYGluZGV4T2ZOZXh0QXZhaWxhYmxlUGxhY2Vob2xkZXJDaGFyYCBpcyBgbnVsbGAsIHRoYXQgbWVhbnMgdGhlIGNoYXJhY3RlciBpcyBibG9ja2VkLiBXZSBoYXZlIHRvXG4gICAgICAgICAgICAgICAgLy8gZGlzY2FyZCBpdC5cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2luY2Ugd2UndmUgbWFwcGVkIHRoaXMgcGxhY2Vob2xkZXIgcG9zaXRpb24uIFdlIG1vdmUgb24gdG8gdGhlIG5leHQgb25lLlxuICAgICAgICAgICAgY29udGludWUgcGxhY2Vob2xkZXJMb29wO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzb21lQ2hhcnNSZWplY3RlZCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFdlIHJlYWNoIHRoaXMgcG9pbnQgd2hlbiB3ZSd2ZSBtYXBwZWQgYWxsIHRoZSB1c2VyIGlucHV0IGNoYXJhY3RlcnMgdG8gcGxhY2Vob2xkZXJcbiAgICAgIC8vIHBvc2l0aW9ucyBpbiB0aGUgbWFzay4gSW4gKmd1aWRlKiBtb2RlLCB3ZSBhcHBlbmQgdGhlIGxlZnQgb3ZlciBjaGFyYWN0ZXJzIGluIHRoZVxuICAgICAgLy8gcGxhY2Vob2xkZXIgdG8gdGhlIGBjb25mb3JtZWRTdHJpbmdgLCBidXQgaW4gKm5vIGd1aWRlKiBtb2RlLCB3ZSBkb24ndCB3YW5uYSBkbyB0aGF0LlxuICAgICAgLy9cbiAgICAgIC8vIFRoYXQgaXMsIGZvciBtYXNrIGAoMTExKWAgYW5kIHVzZXIgaW5wdXQgYDJgLCB3ZSB3YW50IHRvIHJldHVybiBgKDJgLCBub3QgYCgyX18pYC5cbiAgICAgIGlmIChzdXBwcmVzc0d1aWRlID09PSBmYWxzZSkge1xuICAgICAgICBjb25mb3JtZWRWYWx1ZSArPSBwbGFjZWhvbGRlci5zdWJzdHIoaSwgcGxhY2Vob2xkZXJMZW5ndGgpO1xuICAgICAgfVxuXG4gICAgICAvLyBBbmQgd2UgYnJlYWtcbiAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBFbHNlLCB0aGUgY2hhckluUGxhY2Vob2xkZXIgaXMgbm90IGEgcGxhY2Vob2xkZXJDaGFyLiBUaGF0IGlzLCB3ZSBjYW5ub3QgZmlsbCBpdFxuICAgICAgLy8gd2l0aCB1c2VyIGlucHV0LiBTbyB3ZSBqdXN0IG1hcCBpdCB0byB0aGUgZmluYWwgb3V0cHV0XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbmZvcm1lZFZhbHVlICs9IGNoYXJJblBsYWNlaG9sZGVyO1xuICAgIH1cbiAgfVxuXG4gIC8vIFRoZSBmb2xsb3dpbmcgbG9naWMgaXMgbmVlZGVkIHRvIGRlYWwgd2l0aCB0aGUgY2FzZSBvZiBkZWxldGlvbiBpbiAqbm8gZ3VpZGUqIG1vZGUuXG4gIC8vXG4gIC8vIENvbnNpZGVyIHRoZSBzaWxseSBtYXNrIGAoMTExKSAvLy8gMWAuIFdoYXQgaWYgdXNlciB0cmllcyB0byBkZWxldGUgdGhlIGxhc3QgcGxhY2Vob2xkZXJcbiAgLy8gcG9zaXRpb24/IFNvbWV0aGluZyBsaWtlIGAoNTg5KSAvLy8gYC4gV2Ugd2FudCB0byBjb25mb3JtIHRoYXQgdG8gYCg1ODlgLiBOb3QgYCg1ODkpIC8vLyBgLlxuICAvLyBUaGF0J3Mgd2h5IHRoZSBsb2dpYyBiZWxvdyBmaW5kcyB0aGUgbGFzdCBmaWxsZWQgcGxhY2Vob2xkZXIgY2hhcmFjdGVyLCBhbmQgcmVtb3ZlcyBldmVyeXRoaW5nXG4gIC8vIGZyb20gdGhhdCBwb2ludCBvbi5cbiAgaWYgKHN1cHByZXNzR3VpZGUgJiYgaXNBZGRpdGlvbiA9PT0gZmFsc2UpIHtcbiAgICBsZXQgaW5kZXhPZkxhc3RGaWxsZWRQbGFjZWhvbGRlckNoYXIgPSBudWxsO1xuXG4gICAgLy8gRmluZCB0aGUgbGFzdCBmaWxsZWQgcGxhY2Vob2xkZXIgcG9zaXRpb24gYW5kIHN1YnN0cmluZyBmcm9tIHRoZXJlXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb25mb3JtZWRWYWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHBsYWNlaG9sZGVyW2ldID09PSBwbGFjZWhvbGRlckNoYXIpIHtcbiAgICAgICAgaW5kZXhPZkxhc3RGaWxsZWRQbGFjZWhvbGRlckNoYXIgPSBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpbmRleE9mTGFzdEZpbGxlZFBsYWNlaG9sZGVyQ2hhciAhPT0gbnVsbCkge1xuICAgICAgLy8gV2Ugc3Vic3RyaW5nIGZyb20gdGhlIGJlZ2lubmluZyB1bnRpbCB0aGUgcG9zaXRpb24gYWZ0ZXIgdGhlIGxhc3QgZmlsbGVkIHBsYWNlaG9sZGVyIGNoYXIuXG4gICAgICBjb25mb3JtZWRWYWx1ZSA9IGNvbmZvcm1lZFZhbHVlLnN1YnN0cihcbiAgICAgICAgMCxcbiAgICAgICAgaW5kZXhPZkxhc3RGaWxsZWRQbGFjZWhvbGRlckNoYXIgKyAxLFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgd2UgY291bGRuJ3QgZmluZCBgaW5kZXhPZkxhc3RGaWxsZWRQbGFjZWhvbGRlckNoYXJgIHRoYXQgbWVhbnMgdGhlIHVzZXIgZGVsZXRlZFxuICAgICAgLy8gdGhlIGZpcnN0IGNoYXJhY3RlciBpbiB0aGUgbWFzay4gU28gd2UgcmV0dXJuIGFuIGVtcHR5IHN0cmluZy5cbiAgICAgIGNvbmZvcm1lZFZhbHVlID0gZW1wdHlTdHJpbmc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHsgY29uZm9ybWVkVmFsdWUsIG1ldGE6IHsgc29tZUNoYXJzUmVqZWN0ZWQgfSB9O1xufVxuIl19