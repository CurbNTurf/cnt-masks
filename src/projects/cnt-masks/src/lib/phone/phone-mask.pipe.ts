import { Pipe, PipeTransform } from '@angular/core';
import { conformToMask } from '../mask/conform-to-mask.function';
import { mask } from './utils';

@Pipe({
  name: 'cntMaskPhone',
})
export class PhoneMaskPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    return conformToMask(value, mask(), { guide: false }).conformedValue;
  }
}
