export const clean = (number) => {
    return number.toString().replace(/[^\d\^\+]/gm, '');
};
export const mask = (maxLength = 13) => (rawValue) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jbnQtbWFza3Mvc3JjL2xpYi9waG9uZS91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxNQUFjLEVBQUUsRUFBRTtJQUN0QyxPQUFPLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3RELENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLFlBQW9CLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFnQixFQUFFLEVBQUU7SUFDbkUsMERBQTBEO0lBQzFELHVIQUF1SDtJQUN2SCxJQUFJO0lBRUosT0FBTztRQUNMLEdBQUc7UUFDSCxPQUFPO1FBQ1AsSUFBSTtRQUNKLElBQUk7UUFDSixHQUFHO1FBQ0gsR0FBRztRQUNILElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLEdBQUc7UUFDSCxJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO0tBQ0wsQ0FBQztBQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBjbGVhbiA9IChudW1iZXI6IHN0cmluZykgPT4ge1xuICByZXR1cm4gbnVtYmVyLnRvU3RyaW5nKCkucmVwbGFjZSgvW15cXGRcXF5cXCtdL2dtLCAnJyk7XG59O1xuXG5leHBvcnQgY29uc3QgbWFzayA9IChtYXhMZW5ndGg6IG51bWJlciA9IDEzKSA9PiAocmF3VmFsdWU6IHN0cmluZykgPT4ge1xuICAvLyBpZiAoY2xlYW4ocmF3VmFsdWUpLmxlbmd0aCA8PSAxMiB8fCBtYXhMZW5ndGggPT09IDEyKSB7XG4gIC8vIFx0cmV0dXJuIFsnKycsIC9bMS05XS8sICcgJywgJygnLCAvWzEtOV0vLCAvXFxkLywgL1xcZC8sICcpJywgJyAnLCAvXFxkLywgL1xcZC8sIC9cXGQvLCAnLScsIC9cXGQvLCAvXFxkLywgJy0nLCAvXFxkLywgL1xcZC9dO1xuICAvLyB9XG5cbiAgcmV0dXJuIFtcbiAgICAnKCcsXG4gICAgL1sxLTldLyxcbiAgICAvXFxkLyxcbiAgICAvXFxkLyxcbiAgICAnKScsXG4gICAgJyAnLFxuICAgIC9cXGQvLFxuICAgIC9cXGQvLFxuICAgIC9cXGQvLFxuICAgICctJyxcbiAgICAvXFxkLyxcbiAgICAvXFxkLyxcbiAgICAvXFxkLyxcbiAgICAvXFxkLyxcbiAgXTtcbn07XG4iXX0=