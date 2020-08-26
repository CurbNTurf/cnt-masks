import { Directive, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

// @dynamic
@Directive({
  exportAs: 'cntMaskPhone',
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneMaskDirectiveMock),
    },
  ],
  selector: '[cntMaskPhone]',
})
export class PhoneMaskDirectiveMock {}
