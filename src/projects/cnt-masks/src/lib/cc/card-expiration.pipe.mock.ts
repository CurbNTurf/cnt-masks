import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardExpiration',
})
export class CardExpirationPipeMock implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}
