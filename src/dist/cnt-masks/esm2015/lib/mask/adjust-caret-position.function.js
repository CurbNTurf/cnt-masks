const defaultArray = [];
const emptyString = '';
export function adjustCaretPosition({ previousConformedValue = emptyString, previousPlaceholder = emptyString, currentCaretPosition = 0, conformedValue, rawValue, placeholderChar, placeholder, indexesOfPipedChars = defaultArray, caretTrapIndexes = defaultArray, }) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRqdXN0LWNhcmV0LXBvc2l0aW9uLmZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY250LW1hc2tzL3NyYy9saWIvbWFzay9hZGp1c3QtY2FyZXQtcG9zaXRpb24uZnVuY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUV2QixNQUFNLFVBQVUsbUJBQW1CLENBQUMsRUFDbEMsc0JBQXNCLEdBQUcsV0FBVyxFQUNwQyxtQkFBbUIsR0FBRyxXQUFXLEVBQ2pDLG9CQUFvQixHQUFHLENBQUMsRUFDeEIsY0FBYyxFQUNkLFFBQVEsRUFDUixlQUFlLEVBQ2YsV0FBVyxFQUNYLG1CQUFtQixHQUFHLFlBQVksRUFDbEMsZ0JBQWdCLEdBQUcsWUFBWSxHQUMzQjtJQUNKLElBQUksb0JBQW9CLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtRQUNsRCxPQUFPLENBQUMsQ0FBQztLQUNWO0lBRUQsd0NBQXdDO0lBQ3hDLE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7SUFDdkMsTUFBTSw0QkFBNEIsR0FBRyxzQkFBc0IsQ0FBQyxNQUFNLENBQUM7SUFDbkUsTUFBTSxpQkFBaUIsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO0lBQzdDLE1BQU0sb0JBQW9CLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQztJQUVuRCx3RkFBd0Y7SUFDeEYsMERBQTBEO0lBQzFELE1BQU0sVUFBVSxHQUFHLGNBQWMsR0FBRyw0QkFBNEIsQ0FBQztJQUVqRSwwRkFBMEY7SUFDMUYsTUFBTSxVQUFVLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQztJQUVsQyxrRkFBa0Y7SUFDbEYsTUFBTSxlQUFlLEdBQUcsNEJBQTRCLEtBQUssQ0FBQyxDQUFDO0lBRTNELDBGQUEwRjtJ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N0MsK0VBQStFO2dCQUMvRSxnRkFBZ0Y7Z0JBQ2hGLGlGQUFpRjtnQkFDakYsNEJBQTRCO2dCQUU1QjtnQkFDRSxzRkFBc0Y7Z0JBQ3RGLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssZUFBZTtvQkFDdEMsMkVBQTJFO29CQUMzRSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNsQyx3RUFBd0U7b0JBQ3hFLDZCQUE2QjtvQkFDN0IsQ0FBQyxLQUFLLENBQUMsRUFDUDtvQkFDQSxPQUFPLENBQUMsQ0FBQztpQkFDVjthQUNGO1NBQ0Y7S0FDRjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBkZWZhdWx0QXJyYXkgPSBbXTtcbmNvbnN0IGVtcHR5U3RyaW5nID0gJyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGp1c3RDYXJldFBvc2l0aW9uKHtcbiAgcHJldmlvdXNDb25mb3JtZWRWYWx1ZSA9IGVtcHR5U3RyaW5nLFxuICBwcmV2aW91c1BsYWNlaG9sZGVyID0gZW1wdHlTdHJpbmcsXG4gIGN1cnJlbnRDYXJldFBvc2l0aW9uID0gMCxcbiAgY29uZm9ybWVkVmFsdWUsXG4gIHJhd1ZhbHVlLFxuICBwbGFjZWhvbGRlckNoYXIsXG4gIHBsYWNlaG9sZGVyLFxuICBpbmRleGVzT2ZQaXBlZENoYXJzID0gZGVmYXVsdEFycmF5LFxuICBjYXJldFRyYXBJbmRleGVzID0gZGVmYXVsdEFycmF5LFxufTogYW55KTogbnVtYmVyIHtcbiAgaWYgKGN1cnJlbnRDYXJldFBvc2l0aW9uID09PSAwIHx8ICFyYXdWYWx1ZS5sZW5ndGgpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8vIFN0b3JlIGxlbmd0aHMgZm9yIGZhc3RlciBwZXJmb3JtYW5jZT9cbiAgY29uc3QgcmF3VmFsdWVMZW5ndGggPSByYXdWYWx1ZS5sZW5ndGg7XG4gIGNvbnN0IHByZXZpb3VzQ29uZm9ybWVkVmFsdWVMZW5ndGggPSBwcmV2aW91c0NvbmZvcm1lZFZhbHVlLmxlbmd0aDtcbiAgY29uc3QgcGxhY2Vob2xkZXJMZW5ndGggPSBwbGFjZWhvbGRlci5sZW5ndGg7XG4gIGNvbnN0IGNvbmZvcm1lZFZhbHVlTGVuZ3RoID0gY29uZm9ybWVkVmFsdWUubGVuZ3RoO1xuXG4gIC8vIFRoaXMgdGVsbHMgdXMgaG93IGxvbmcgdGhlIGVkaXQgaXMuIElmIHVzZXIgbW9kaWZpZWQgaW5wdXQgZnJvbSBgKDJfXylgIHRvIGAoMjQzX18pYCxcbiAgLy8gd2Uga25vdyB0aGUgdXNlciBpbiB0aGlzIGluc3RhbmNlIHBhc3RlZCB0d28gY2hhcmFjdGVyc1xuICBjb25zdCBlZGl0TGVuZ3RoID0gcmF3VmFsdWVMZW5ndGggLSBwcmV2aW91c0NvbmZvcm1lZFZhbHVlTGVuZ3RoO1xuXG4gIC8vIElmIHRoZSBlZGl0IGxlbmd0aCBpcyBwb3NpdGl2ZSwgdGhhdCBtZWFucyB0aGUgdXNlciBpcyBhZGRpbmcgY2hhcmFjdGVycywgbm90IGRlbGV0aW5nLlxuICBjb25zdCBpc0FkZGl0aW9uID0gZWRpdExlbmd0aCA+IDA7XG5cbiAgLy8gVGhpcyBpcyB0aGUgZmlyc3QgcmF3IHZhbHVlIHRoZSB1c2VyIGVudGVyZWQgdGhhdCBuZWVkcyB0byBiZSBjb25mb3JtZWQgdG8gbWFza1xuICBjb25zdCBpc0ZpcnN0UmF3VmFsdWUgPSBwcmV2aW91c0NvbmZvcm1lZFZhbHVlTGVuZ3RoID09PSAwO1xuXG4gIC8vIEEgcGFydGlhbCBtdWx0aS1jaGFyYWN0ZXIgZWRpdCBoYXBwZW5zIHdoZW4gdGhlIHVzZXIgbWFrZXMgYSBwYXJ0aWFsIHNlbGVjdGlvbiBpbiB0aGVpclxuICAvLyBpbnB1dCBhbmQgZWRpdHMgdGhhdCBzZWxlY3Rpb24uIFRoYXQgaXMgZ29pbmcgZnJvbSBgKDEyMykgNDMyLTQzNDhgIHRvIGAoKSA0MzItNDM0OGAgYnlcbiAgLy8gc2VsZWN0aW5nIHRoZSBmaXJzdCAzIGRpZ2l0cyBhbmQgcHJlc3NpbmcgYmFja3NwYWNlLlxuICAvL1xuICAvLyBTdWNoIGNhc2VzIGNhbiBhbHNvIGhhcHBlbiB3aGVuIHRoZSB1c2VyIHByZXNzZXMgdGhlIGJhY2tzcGFjZSB3aGlsZSBob2xkaW5nIGRvd24gdGhlIEFMVFxuICAvLyBrZXkuXG4gIGNvbnN0IGlzUGFydGlhbE11bHRpQ2hhckVkaXQgPVxuICAgIGVkaXRMZW5ndGggPiAxICYmICFpc0FkZGl0aW9uICYmICFpc0ZpcnN0UmF3VmFsdWU7XG5cbiAgLy8gVGhpcyBhbGdvcml0aG0gZG9lc24ndCBzdXBwb3J0IGFsbCBjYXNlcyBvZiBtdWx0aS1jaGFyYWN0ZXIgZWRpdHMsIHNvIHdlIGp1c3QgcmV0dXJuXG4gIC8vIHRoZSBjdXJyZW50IGNhcmV0IHBvc2l0aW9uLlxuICAvL1xuICAvLyBUaGlzIHdvcmtzIGZpbmUgZm9yIG1vc3QgY2FzZXMuXG4gIGlmIChpc1BhcnRpYWxNdWx0aUNoYXJFZGl0KSB7XG4gICAgcmV0dXJuIGN1cnJlbnRDYXJldFBvc2l0aW9uO1xuICB9XG5cbiAgLy8gRm9yIGEgbWFzayBsaWtlICgxMTEpLCBpZiB0aGUgYHByZXZpb3VzQ29uZm9ybWVkVmFsdWVgIGlzICgxX18pIGFuZCB1c2VyIGF0dGVtcHRzIHRvIGVudGVyXG4gIC8vIGBmYCBzbyB0aGUgYHJhd1ZhbHVlYCBiZWNvbWVzICgxZl9fKSwgdGhlIG5ldyBgY29uZm9ybWVkVmFsdWVgIHdvdWxkIGJlICgxX18pLCB3aGljaCBpcyB0aGVcbiAgLy8gc2FtZSBhcyB0aGUgb3JpZ2luYWwgYHByZXZpb3VzQ29uZm9ybWVkVmFsdWVgLiBXZSBoYW5kbGUgdGhpcyBjYXNlIGRpZmZlcmVudGx5IGZvciBjYXJldFxuICAvLyBwb3NpdGlvbmluZy5cbiAgY29uc3QgcG9zc2libHlIYXNSZWplY3RlZENoYXIgPVxuICAgIGlzQWRkaXRpb24gJiZcbiAgICAocHJldmlvdXNDb25mb3JtZWRWYWx1ZSA9PT0gY29uZm9ybWVkVmFsdWUgfHxcbiAgICAgIGNvbmZvcm1lZFZhbHVlID09PSBwbGFjZWhvbGRlcik7XG5cbiAgbGV0IHN0YXJ0aW5nU2VhcmNoSW5kZXggPSAwO1xuICBsZXQgdHJhY2tSaWdodENoYXJhY3RlcjtcbiAgbGV0IHRhcmdldENoYXI7XG5cbiAgaWYgKHBvc3NpYmx5SGFzUmVqZWN0ZWRDaGFyKSB7XG4gICAgc3RhcnRpbmdTZWFyY2hJbmRleCA9IGN1cnJlbnRDYXJldFBvc2l0aW9uIC0gZWRpdExlbmd0aDtcbiAgfSBlbHNlIHtcbiAgICAvLyBBdCB0aGlzIHBvaW50IGluIHRoZSBhbGdvcml0aG0sIHdlIHdhbnQgdG8ga25vdyB3aGVyZSB0aGUgY2FyZXQgaXMgcmlnaHQgYmVmb3JlIHRoZSByYXcgaW5wdXRcbiAgICAvLyBoYXMgYmVlbiBjb25mb3JtZWQsIGFuZCB0aGVuIHNlZSBpZiB3ZSBjYW4gZmluZCB0aGF0IHNhbWUgc3BvdCBpbiB0aGUgY29uZm9ybWVkIGlucHV0LlxuICAgIC8vXG4gICAgLy8gV2UgZG8gdGhhdCBieSBzZWVpbmcgd2hhdCBjaGFyYWN0ZXIgbGllcyBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGNhcmV0LCBhbmQgdGhlbiBsb29rIGZvciB0aGF0XG4gICAgLy8gc2FtZSBjaGFyYWN0ZXIgaW4gdGhlIGNvbmZvcm1lZCBpbnB1dCBhbmQgcGxhY2UgdGhlIGNhcmV0IHRoZXJlLlxuXG4gICAgLy8gRmlyc3QsIHdlIG5lZWQgdG8gbm9ybWFsaXplIHRoZSBpbnB1dHMgc28gdGhhdCBsZXR0ZXIgY2FwaXRhbGl6YXRpb24gYmV0d2VlbiByYXcgaW5wdXQgYW5kXG4gICAgLy8gY29uZm9ybWVkIGlucHV0IHdvdWxkbid0IG1hdHRlci5cbiAgICBjb25zdCBub3JtYWxpemVkQ29uZm9ybWVkVmFsdWUgPSBjb25mb3JtZWRWYWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRSYXdWYWx1ZSA9IHJhd1ZhbHVlLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAvLyBUaGVuIHdlIHRha2UgYWxsIGNoYXJhY3RlcnMgdGhhdCBjb21lIGJlZm9yZSB3aGVyZSB0aGUgY2FyZXQgY3VycmVudGx5IGlzLlxuICAgIGNvbnN0IGxlZnRIYWxmQ2hhcnMgPSBub3JtYWxpemVkUmF3VmFsdWVcbiAgICAgIC5zdWJzdHIoMCwgY3VycmVudENhcmV0UG9zaXRpb24pXG4gICAgICAuc3BsaXQoZW1wdHlTdHJpbmcpO1xuXG4gICAgLy8gTm93IHdlIGZpbmQgYWxsIHRoZSBjaGFyYWN0ZXJzIGluIHRoZSBsZWZ0IGhhbGYgdGhhdCBleGlzdCBpbiB0aGUgY29uZm9ybWVkIGlucHV0XG4gICAgLy8gVGhpcyBzdGVwIGVuc3VyZXMgdGhhdCB3ZSBkb24ndCBsb29rIGZvciBhIGNoYXJhY3RlciB0aGF0IHdhcyBmaWx0ZXJlZCBvdXQgb3IgcmVqZWN0ZWQgYnkgYGNvbmZvcm1Ub01hc2tgLlxuICAgIGNvbnN0IGludGVyc2VjdGlvbiA9IGxlZnRIYWxmQ2hhcnMuZmlsdGVyKFxuICAgICAgKGNoYXIpID0+IG5vcm1hbGl6ZWRDb25mb3JtZWRWYWx1ZS5pbmRleE9mKGNoYXIpICE9PSAtMSxcbiAgICApO1xuXG4gICAgLy8gVGhlIGxhc3QgY2hhcmFjdGVyIGluIHRoZSBpbnRlcnNlY3Rpb24gaXMgdGhlIGNoYXJhY3RlciB3ZSB3YW50IHRvIGxvb2sgZm9yIGluIHRoZSBjb25mb3JtZWRcbiAgICAvLyB2YWx1ZSBhbmQgdGhlIG9uZSB3ZSB3YW50IHRvIGFkanVzdCB0aGUgY2FyZXQgY2xvc2UgdG9cbiAgICB0YXJnZXRDaGFyID0gaW50ZXJzZWN0aW9uW2ludGVyc2VjdGlvbi5sZW5ndGggLSAxXTtcblxuICAgIC8vIENhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIG1hc2sgY2hhcmFjdGVycyBpbiB0aGUgcHJldmlvdXMgcGxhY2Vob2xkZXJcbiAgICAvLyBmcm9tIHRoZSBzdGFydCBvZiB0aGUgc3RyaW5nIHVwIHRvIHRoZSBwbGFjZSB3aGVyZSB0aGUgY2FyZXQgaXNcbiAgICBjb25zdCBwcmV2aW91c0xlZnRNYXNrQ2hhcnMgPSBwcmV2aW91c1BsYWNlaG9sZGVyXG4gICAgICAuc3Vic3RyKDAsIGludGVyc2VjdGlvbi5sZW5ndGgpXG4gICAgICAuc3BsaXQoZW1wdHlTdHJpbmcpXG4gICAgICAuZmlsdGVyKChjaGFyKSA9PiBjaGFyICE9PSBwbGFjZWhvbGRlckNoYXIpLmxlbmd0aDtcblxuICAgIC8vIENhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIG1hc2sgY2hhcmFjdGVycyBpbiB0aGUgY3VycmVudCBwbGFjZWhvbGRlclxuICAgIC8vIGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBzdHJpbmcgdXAgdG8gdGhlIHBsYWNlIHdoZXJlIHRoZSBjYXJldCBpc1xuICAgIGNvbnN0IGxlZnRNYXNrQ2hhcnMgPSBwbGFjZWhvbGRlclxuICAgICAgLnN1YnN0cigwLCBpbnRlcnNlY3Rpb24ubGVuZ3RoKVxuICAgICAgLnNwbGl0KGVtcHR5U3RyaW5nKVxuICAgICAgLmZpbHRlcigoY2hhcikgPT4gY2hhciAhPT0gcGxhY2Vob2xkZXJDaGFyKS5sZW5ndGg7XG5cbiAgICAvLyBIYXMgdGhlIG51bWJlciBvZiBtYXNrIGNoYXJhY3RlcnMgdXAgdG8gdGhlIGNhcmV0IGNoYW5nZWQ/XG4gICAgY29uc3QgbWFza2xlbmd0aENoYW5nZWQgPSBsZWZ0TWFza0NoYXJzICE9PSBwcmV2aW91c0xlZnRNYXNrQ2hhcnM7XG5cbiAgICAvLyBEZXRlY3QgaWYgYHRhcmdldENoYXJgIGlzIGEgbWFzayBjaGFyYWN0ZXIgYW5kIGhhcyBtb3ZlZCB0byB0aGUgbGVmdFxuICAgIGNvbnN0IHRhcmdldElzTWFza01vdmluZ0xlZnQgPVxuICAgICAgcHJldmlvdXNQbGFjZWhvbGRlcltpbnRlcnNlY3Rpb24ubGVuZ3RoIC0gMV0gIT09IHVuZGVmaW5lZCAmJlxuICAgICAgcGxhY2Vob2xkZXJbaW50ZXJzZWN0aW9uLmxlbmd0aCAtIDJdICE9PSB1bmRlZmluZWQgJiZcbiAgICAgIHByZXZpb3VzUGxhY2Vob2xkZXJbaW50ZXJzZWN0aW9uLmxlbmd0aCAtIDFdICE9PSBwbGFjZWhvbGRlckNoYXIgJiZcbiAgICAgIHByZXZpb3VzUGxhY2Vob2xkZXJbaW50ZXJzZWN0aW9uLmxlbmd0aCAtIDFdICE9PVxuICAgICAgICBwbGFjZWhvbGRlcltpbnRlcnNlY3Rpb24ubGVuZ3RoIC0gMV0gJiZcbiAgICAgIHByZXZpb3VzUGxhY2Vob2xkZXJbaW50ZXJzZWN0aW9uLmxlbmd0aCAtIDFdID09PVxuICAgICAgICBwbGFjZWhvbGRlcltpbnRlcnNlY3Rpb24ubGVuZ3RoIC0gMl07XG5cbiAgICAvLyBJZiBkZWxldGluZyBhbmQgdGhlIGB0YXJnZXRDaGFyYCBgaXMgYSBtYXNrIGNoYXJhY3RlciBhbmQgYG1hc2tsZW5ndGhDaGFuZ2VkYCBpcyB0cnVlXG4gICAgLy8gb3IgdGhlIG1hc2sgaXMgbW92aW5nIHRvIHRoZSBsZWZ0LCB3ZSBjYW4ndCB1c2UgdGhlIHNlbGVjdGVkIGB0YXJnZXRDaGFyYCBhbnkgbG9uZ2VyXG4gICAgLy8gaWYgd2UgYXJlIG5vdCBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcuXG4gICAgLy8gSW4gdGhpcyBjYXNlLCBjaGFuZ2UgdHJhY2tpbmcgc3RyYXRlZ3kgYW5kIHRyYWNrIHRoZSBjaGFyYWN0ZXIgdG8gdGhlIHJpZ2h0IG9mIHRoZSBjYXJldC5cbiAgICBpZiAoXG4gICAgICAhaXNBZGRpdGlvbiAmJlxuICAgICAgKG1hc2tsZW5ndGhDaGFuZ2VkIHx8IHRhcmdldElzTWFza01vdmluZ0xlZnQpICYmXG4gICAgICBwcmV2aW91c0xlZnRNYXNrQ2hhcnMgPiAwICYmXG4gICAgICBwbGFjZWhvbGRlci5pbmRleE9mKHRhcmdldENoYXIpID4gLTEgJiZcbiAgICAgIHJhd1ZhbHVlW2N1cnJlbnRDYXJldFBvc2l0aW9uXSAhPT0gdW5kZWZpbmVkXG4gICAgKSB7XG4gICAgICB0cmFja1JpZ2h0Q2hhcmFjdGVyID0gdHJ1ZTtcbiAgICAgIHRhcmdldENoYXIgPSByYXdWYWx1ZVtjdXJyZW50Q2FyZXRQb3NpdGlvbl07XG4gICAgfVxuXG4gICAgLy8gSXQgaXMgcG9zc2libGUgdGhhdCBgdGFyZ2V0Q2hhcmAgd2lsbCBhcHBlYXIgbXVsdGlwbGUgdGltZXMgaW4gdGhlIGNvbmZvcm1lZCB2YWx1ZS5cbiAgICAvLyBXZSBuZWVkIHRvIGtub3cgbm90IHRvIHNlbGVjdCBhIGNoYXJhY3RlciB0aGF0IGxvb2tzIGxpa2Ugb3VyIHRhcmdldCBjaGFyYWN0ZXIgZnJvbSB0aGUgcGxhY2Vob2xkZXIgb3JcbiAgICAvLyB0aGUgcGlwZWQgY2hhcmFjdGVycywgc28gd2UgaW5zcGVjdCB0aGUgcGlwZWQgY2hhcmFjdGVycyBhbmQgdGhlIHBsYWNlaG9sZGVyIHRvIHNlZSBpZiB0aGV5IGNvbnRhaW5cbiAgICAvLyBjaGFyYWN0ZXJzIHRoYXQgbWF0Y2ggb3VyIHRhcmdldCBjaGFyYWN0ZXIuXG5cbiAgICAvLyBJZiB0aGUgYGNvbmZvcm1lZFZhbHVlYCBnb3QgcGlwZWQsIHdlIG5lZWQgdG8ga25vdyB3aGljaCBjaGFyYWN0ZXJzIHdlcmUgcGlwZWQgaW4gc28gdGhhdCB3aGVuIHdlIGxvb2sgZm9yXG4gICAgLy8gb3VyIGB0YXJnZXRDaGFyYCwgd2UgZG9uJ3Qgc2VsZWN0IGEgcGlwZWQgY2hhciBieSBtaXN0YWtlXG4gICAgY29uc3QgcGlwZWRDaGFycyA9IGluZGV4ZXNPZlBpcGVkQ2hhcnMubWFwKFxuICAgICAgKGluZGV4KSA9PiBub3JtYWxpemVkQ29uZm9ybWVkVmFsdWVbaW5kZXhdLFxuICAgICk7XG5cbiAgICAvLyBXZSBuZWVkIHRvIGtub3cgaG93IG1hbnkgdGltZXMgdGhlIGB0YXJnZXRDaGFyYCBvY2N1cnMgaW4gdGhlIHBpcGVkIGNoYXJhY3RlcnMuXG4gICAgY29uc3QgY291bnRUYXJnZXRDaGFySW5QaXBlZENoYXJzID0gcGlwZWRDaGFycy5maWx0ZXIoXG4gICAgICAoY2hhcikgPT4gY2hhciA9PT0gdGFyZ2V0Q2hhcixcbiAgICApLmxlbmd0aDtcblxuICAgIC8vIFdlIG5lZWQgdG8ga25vdyBob3cgbWFueSB0aW1lcyBpdCBvY2N1cnMgaW4gdGhlIGludGVyc2VjdGlvblxuICAgIGNvbnN0IGNvdW50VGFyZ2V0Q2hhckluSW50ZXJzZWN0aW9uID0gaW50ZXJzZWN0aW9uLmZpbHRlcihcbiAgICAgIChjaGFyKSA9PiBjaGFyID09PSB0YXJnZXRDaGFyLFxuICAgICkubGVuZ3RoO1xuXG4gICAgLy8gV2UgbmVlZCB0byBrbm93IGlmIHRoZSBwbGFjZWhvbGRlciBjb250YWlucyBjaGFyYWN0ZXJzIHRoYXQgbG9vayBsaWtlXG4gICAgLy8gb3VyIGB0YXJnZXRDaGFyYCwgc28gd2UgZG9uJ3Qgc2VsZWN0IG9uZSBvZiB0aG9zZSBieSBtaXN0YWtlLlxuICAgIGNvbnN0IGNvdW50VGFyZ2V0Q2hhckluUGxhY2Vob2xkZXIgPSBwbGFjZWhvbGRlclxuICAgICAgLnN1YnN0cigwLCBwbGFjZWhvbGRlci5pbmRleE9mKHBsYWNlaG9sZGVyQ2hhcikpXG4gICAgICAuc3BsaXQoZW1wdHlTdHJpbmcpXG4gICAgICAuZmlsdGVyKFxuICAgICAgICAoY2hhciwgaW5kZXgpID0+XG4gICAgICAgICAgLy8gQ2hlY2sgaWYgYGNoYXJgIGlzIHRoZSBzYW1lIGFzIG91ciBgdGFyZ2V0Q2hhcmAsIHNvIHdlIGFjY291bnQgZm9yIGl0XG4gICAgICAgICAgY2hhciA9PT0gdGFyZ2V0Q2hhciAmJlxuICAgICAgICAgIC8vIGJ1dCBhbHNvIG1ha2Ugc3VyZSB0aGF0IGJvdGggdGhlIGByYXdWYWx1ZWAgYW5kIHBsYWNlaG9sZGVyIGRvbid0IGhhdmUgdGhlIHNhbWUgY2hhcmFjdGVyIGF0IHRoZSBzYW1lXG4gICAgICAgICAgLy8gaW5kZXggYmVjYXVzZSBpZiB0aGV5IGFyZSBlcXVhbCwgdGhhdCBtZWFucyB3ZSBhcmUgYWxyZWFkeSBjb3VudGluZyB0aG9zZSBjaGFyYWN0ZXJzIGluXG4gICAgICAgICAgLy8gYGNvdW50VGFyZ2V0Q2hhckluSW50ZXJzZWN0aW9uYFxuICAgICAgICAgIHJhd1ZhbHVlW2luZGV4XSAhPT0gY2hhcixcbiAgICAgICkubGVuZ3RoO1xuXG4gICAgLy8gVGhlIG51bWJlciBvZiB0aW1lcyB3ZSBuZWVkIHRvIHNlZSBvY2N1cnJlbmNlcyBvZiB0aGUgYHRhcmdldENoYXJgIGJlZm9yZSB3ZSBrbm93IGl0IGlzIHRoZSBvbmUgd2UncmUgbG9va2luZ1xuICAgIC8vIGZvciBpczpcbiAgICBjb25zdCByZXF1aXJlZE51bWJlck9mTWF0Y2hlcyA9XG4gICAgICBjb3VudFRhcmdldENoYXJJblBsYWNlaG9sZGVyICtcbiAgICAgIGNvdW50VGFyZ2V0Q2hhckluSW50ZXJzZWN0aW9uICtcbiAgICAgIGNvdW50VGFyZ2V0Q2hhckluUGlwZWRDaGFycyArXG4gICAgICAvLyBUaGUgY2hhcmFjdGVyIHRvIHRoZSByaWdodCBvZiB0aGUgY2FyZXQgaXNuJ3QgaW5jbHVkZWQgaW4gYGludGVyc2VjdGlvbmBcbiAgICAgIC8vIHNvIGFkZCBvbmUgaWYgd2UgYXJlIHRyYWNraW5nIHRoZSBjaGFyYWN0ZXIgdG8gdGhlIHJpZ2h0XG4gICAgICAodHJhY2tSaWdodENoYXJhY3RlciA/IDEgOiAwKTtcblxuICAgIC8vIE5vdyB3ZSBzdGFydCBsb29raW5nIGZvciB0aGUgbG9jYXRpb24gb2YgdGhlIGB0YXJnZXRDaGFyYC5cbiAgICAvLyBXZSBrZWVwIGxvb3BpbmcgZm9yd2FyZCBhbmQgc3RvcmUgdGhlIGluZGV4IGluIGV2ZXJ5IGl0ZXJhdGlvbi4gT25jZSB3ZSBoYXZlIGVuY291bnRlcmVkXG4gICAgLy8gZW5vdWdoIG9jY3VycmVuY2VzIG9mIHRoZSB0YXJnZXQgY2hhcmFjdGVyLCB3ZSBicmVhayBvdXQgb2YgdGhlIGxvb3BcbiAgICAvLyBJZiBhcmUgc2VhcmNoaW5nIGZvciB0aGUgc2Vjb25kIGAxYCBpbiBgMTIxNGAsIGBzdGFydGluZ1NlYXJjaEluZGV4YCB3aWxsIHBvaW50IGF0IGA0YC5cbiAgICBsZXQgbnVtYmVyT2ZFbmNvdW50ZXJlZE1hdGNoZXMgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29uZm9ybWVkVmFsdWVMZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY29uZm9ybWVkVmFsdWVDaGFyID0gbm9ybWFsaXplZENvbmZvcm1lZFZhbHVlW2ldO1xuXG4gICAgICBzdGFydGluZ1NlYXJjaEluZGV4ID0gaSArIDE7XG5cbiAgICAgIGlmIChjb25mb3JtZWRWYWx1ZUNoYXIgPT09IHRhcmdldENoYXIpIHtcbiAgICAgICAgbnVtYmVyT2ZFbmNvdW50ZXJlZE1hdGNoZXMrKztcbiAgICAgIH1cblxuICAgICAgaWYgKG51bWJlck9mRW5jb3VudGVyZWRNYXRjaGVzID49IHJlcXVpcmVkTnVtYmVyT2ZNYXRjaGVzKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEF0IHRoaXMgcG9pbnQsIGlmIHdlIHNpbXBseSByZXR1cm4gYHN0YXJ0aW5nU2VhcmNoSW5kZXhgIGFzIHRoZSBhZGp1c3RlZCBjYXJldCBwb3NpdGlvbixcbiAgLy8gbW9zdCBjYXNlcyB3b3VsZCBiZSBoYW5kbGVkLiBIb3dldmVyLCB3ZSB3YW50IHRvIGZhc3QgZm9yd2FyZCBvciByZXdpbmQgdGhlIGNhcmV0IHRvIHRoZVxuICAvLyBjbG9zZXN0IHBsYWNlaG9sZGVyIGNoYXJhY3RlciBpZiBpdCBoYXBwZW5zIHRvIGJlIGluIGEgbm9uLWVkaXRhYmxlIHNwb3QuIFRoYXQncyB3aGF0IHRoZSBuZXh0XG4gIC8vIGxvZ2ljIGlzIGZvci5cblxuICAvLyBJbiBjYXNlIG9mIGFkZGl0aW9uLCB3ZSBmYXN0IGZvcndhcmQuXG4gIGlmIChpc0FkZGl0aW9uKSB7XG4gICAgLy8gV2Ugd2FudCB0byByZW1lbWJlciB0aGUgbGFzdCBwbGFjZWhvbGRlciBjaGFyYWN0ZXIgZW5jb3VudGVyZWQgc28gdGhhdCBpZiB0aGUgbWFza1xuICAgIC8vIGNvbnRhaW5zIG1vcmUgY2hhcmFjdGVycyBhZnRlciB0aGUgbGFzdCBwbGFjZWhvbGRlciBjaGFyYWN0ZXIsIHdlIGRvbid0IGZvcndhcmQgdGhlIGNhcmV0XG4gICAgLy8gdGhhdCBmYXIgdG8gdGhlIHJpZ2h0LiBJbnN0ZWFkLCB3ZSBzdG9wIGl0IGF0IHRoZSBsYXN0IGVuY291bnRlcmVkIHBsYWNlaG9sZGVyIGNoYXJhY3Rlci5cbiAgICBsZXQgbGFzdFBsYWNlaG9sZGVyQ2hhciA9IHN0YXJ0aW5nU2VhcmNoSW5kZXg7XG5cbiAgICBmb3IgKGxldCBpID0gc3RhcnRpbmdTZWFyY2hJbmRleDsgaSA8PSBwbGFjZWhvbGRlckxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocGxhY2Vob2xkZXJbaV0gPT09IHBsYWNlaG9sZGVyQ2hhcikge1xuICAgICAgICBsYXN0UGxhY2Vob2xkZXJDaGFyID0gaTtcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICAvLyBJZiB3ZSdyZSBhZGRpbmcsIHdlIGNhbiBwb3NpdGlvbiB0aGUgY2FyZXQgYXQgdGhlIG5leHQgcGxhY2Vob2xkZXIgY2hhcmFjdGVyLlxuICAgICAgICBwbGFjZWhvbGRlcltpXSA9PT0gcGxhY2Vob2xkZXJDaGFyIHx8XG4gICAgICAgIC8vIElmIGEgY2FyZXQgdHJhcCB3YXMgc2V0IGJ5IGEgbWFzayBmdW5jdGlvbiwgd2UgbmVlZCB0byBzdG9wIGF0IHRoZSB0cmFwLlxuICAgICAgICBjYXJldFRyYXBJbmRleGVzLmluZGV4T2YoaSkgIT09IC0xIHx8XG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIGVuZCBvZiB0aGUgcGxhY2Vob2xkZXIuIFdlIGNhbm5vdCBtb3ZlIGFueSBmdXJ0aGVyLiBMZXQncyBwdXQgdGhlIGNhcmV0IHRoZXJlLlxuICAgICAgICBpID09PSBwbGFjZWhvbGRlckxlbmd0aFxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBsYXN0UGxhY2Vob2xkZXJDaGFyO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBJbiBjYXNlIG9mIGRlbGV0aW9uLCB3ZSByZXdpbmQuXG4gICAgaWYgKHRyYWNrUmlnaHRDaGFyYWN0ZXIpIHtcbiAgICAgIC8vIFNlYXJjaGluZyBmb3IgdGhlIGNoYXJhY3RlciB0aGF0IHdhcyB0byB0aGUgcmlnaHQgb2YgdGhlIGNhcmV0XG4gICAgICAvLyBXZSBzdGFydCBhdCBgc3RhcnRpbmdTZWFyY2hJbmRleGAgLSAxIGJlY2F1c2UgaXQgaW5jbHVkZXMgb25lIGNoYXJhY3RlciBleHRyYSB0byB0aGUgcmlnaHRcbiAgICAgIGZvciAobGV0IGkgPSBzdGFydGluZ1NlYXJjaEluZGV4IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgLy8gSWYgdHJhY2tpbmcgdGhlIGNoYXJhY3RlciB0byB0aGUgcmlnaHQgb2YgdGhlIGN1cnNvciwgd2UgbW92ZSB0byB0aGUgbGVmdCB1bnRpbFxuICAgICAgICAvLyB3ZSBmb3VuZCB0aGUgY2hhcmFjdGVyIGFuZCB0aGVuIHBsYWNlIHRoZSBjYXJldCByaWdodCBiZWZvcmUgaXRcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgLy8gYHRhcmdldENoYXJgIHNob3VsZCBiZSBpbiBgY29uZm9ybWVkVmFsdWVgLCBzaW5jZSBpdCB3YXMgaW4gYHJhd1ZhbHVlYCwganVzdFxuICAgICAgICAgIC8vIHRvIHRoZSByaWdodCBvZiB0aGUgY2FyZXRcbiAgICAgICAgICBjb25mb3JtZWRWYWx1ZVtpXSA9PT0gdGFyZ2V0Q2hhciB8fFxuICAgICAgICAgIC8vIElmIGEgY2FyZXQgdHJhcCB3YXMgc2V0IGJ5IGEgbWFzayBmdW5jdGlvbiwgd2UgbmVlZCB0byBzdG9wIGF0IHRoZSB0cmFwLlxuICAgICAgICAgIGNhcmV0VHJhcEluZGV4ZXMuaW5kZXhPZihpKSAhPT0gLTEgfHxcbiAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHBsYWNlaG9sZGVyLiBXZSBjYW5ub3QgbW92ZSBhbnkgZnVydGhlci5cbiAgICAgICAgICAvLyBMZXQncyBwdXQgdGhlIGNhcmV0IHRoZXJlLlxuICAgICAgICAgIGkgPT09IDBcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2VhcmNoaW5nIGZvciB0aGUgZmlyc3QgcGxhY2Vob2xkZXIgb3IgY2FyZXQgdHJhcCB0byB0aGUgbGVmdFxuXG4gICAgICBmb3IgKGxldCBpID0gc3RhcnRpbmdTZWFyY2hJbmRleDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgLy8gSWYgd2UncmUgZGVsZXRpbmcsIHdlIHN0b3AgdGhlIGNhcmV0IHJpZ2h0IGJlZm9yZSB0aGUgcGxhY2Vob2xkZXIgY2hhcmFjdGVyLlxuICAgICAgICAvLyBGb3IgZXhhbXBsZSwgZm9yIG1hc2sgYCgxMTEpIDExYCwgY3VycmVudCBjb25mb3JtZWQgaW5wdXQgYCg0NTYpIDg2YC4gSWYgdXNlclxuICAgICAgICAvLyBtb2RpZmllcyBpbnB1dCB0byBgKDQ1NiA4NmAuIFRoYXQgaXMsIHRoZXkgZGVsZXRlZCB0aGUgYClgLCB3ZSBwbGFjZSB0aGUgY2FyZXRcbiAgICAgICAgLy8gcmlnaHQgYWZ0ZXIgdGhlIGZpcnN0IGA2YFxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAvLyBJZiB3ZSdyZSBkZWxldGluZywgd2UgY2FuIHBvc2l0aW9uIHRoZSBjYXJldCByaWdodCBiZWZvcmUgdGhlIHBsYWNlaG9sZGVyIGNoYXJhY3RlclxuICAgICAgICAgIHBsYWNlaG9sZGVyW2kgLSAxXSA9PT0gcGxhY2Vob2xkZXJDaGFyIHx8XG4gICAgICAgICAgLy8gSWYgYSBjYXJldCB0cmFwIHdhcyBzZXQgYnkgYSBtYXNrIGZ1bmN0aW9uLCB3ZSBuZWVkIHRvIHN0b3AgYXQgdGhlIHRyYXAuXG4gICAgICAgICAgY2FyZXRUcmFwSW5kZXhlcy5pbmRleE9mKGkpICE9PSAtMSB8fFxuICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIGJlZ2lubmluZyBvZiB0aGUgcGxhY2Vob2xkZXIuIFdlIGNhbm5vdCBtb3ZlIGFueSBmdXJ0aGVyLlxuICAgICAgICAgIC8vIExldCdzIHB1dCB0aGUgY2FyZXQgdGhlcmUuXG4gICAgICAgICAgaSA9PT0gMFxuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19