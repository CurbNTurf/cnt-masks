import { Directive, ElementRef } from '@angular/core';

import { Payment } from '../payment';

@Directive({
  selector: '[cntMaskCCCvc]',
})
export class CCCvcFormatDirective {
  constructor(private el: ElementRef) {
    const element = this.el.nativeElement;

    // call lib functions
    Payment.formatCardCVC(element);
    Payment.restrictNumeric(element);
  }
}
