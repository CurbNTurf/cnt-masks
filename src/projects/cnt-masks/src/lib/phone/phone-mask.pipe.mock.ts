import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cntMaskPhone',
})
export class PhoneMaskPipeMock implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}
