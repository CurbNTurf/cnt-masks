export const clean = (number: string) => {
  return number.toString().replace(/[^\d\^\+]/gm, '');
};

export const mask = (maxLength: number = 13) => (rawValue: string) => {
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
