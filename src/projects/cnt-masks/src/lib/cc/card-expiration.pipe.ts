import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardExpiration',
})
export class CardExpirationPipe implements PipeTransform {
  transform(value: string): string {
    if (typeof value !== 'number') {
      value = value + '';
    }

    if (typeof value !== 'string') {
      return value;
    }

    if (value.length === 3) {
      value = `0${value}`;
    }

    return `${value.substring(0, 2)}/${value.substring(2)}`;
  }
}
