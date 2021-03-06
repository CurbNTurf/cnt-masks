import { Directive, ElementRef } from '@angular/core';

import { Payment } from '../payment';

@Directive({
  selector: '[cntMaskCCExp]',
})
export class CCExpiryFormatDirective {
  constructor(private el: ElementRef) {
    const element = this.el.nativeElement;

    // call lib functions
    Payment.formatCardExpiry(element);
    Payment.restrictNumeric(element);
  }
}
