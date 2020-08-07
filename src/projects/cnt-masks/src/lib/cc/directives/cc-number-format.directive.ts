import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { Payment } from '../payment';

@Directive({
  selector: '[cntMaskCCNum]',
})
export class CCNumberFormatDirective {
  cardType: string | null;

  constructor(private renderer: Renderer2, private el: ElementRef) {
    const element = this.el.nativeElement;
    this.cardType = '';

    // call lib functions
    Payment.formatCardNumber(element);
    Payment.restrictNumeric(element);
  }

  @HostListener('keypress', ['$event'])
  onKeypress(e: Event): void {
    const element = this.el.nativeElement;
    const elementValue = element.value;

    this.cardType = Payment.fns.cardType(elementValue);

    if (this.cardType && this.cardType !== '') {
      this.renderer.removeClass(element, this.cardType);
    } else {
      this.cardType = '';
    }
  }
}
