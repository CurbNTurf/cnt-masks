import { NgModule } from '@angular/core';
import { TextMaskModule } from 'angular2-text-mask';
import { CardExpirationPipe } from './cc/card-expiration.pipe';
import { CCCvcFormatDirective } from './cc/directives/cc-cvc-format.directive';
import { CCExpiryFormatDirective } from './cc/directives/cc-expiry-format.directive';
import { CCNumberFormatDirective } from './cc/directives/cc-number-format.directive';
import { PhoneMaskDirective } from './phone/phone-mask.directive';
import { PhoneMaskPipe } from './phone/phone-mask.pipe';

@NgModule({
  imports: [TextMaskModule],
  declarations: [
    CCNumberFormatDirective,
    CCExpiryFormatDirective,
    CCCvcFormatDirective,
    CardExpirationPipe,
    PhoneMaskDirective,
    PhoneMaskPipe,
  ],
  exports: [
    CCNumberFormatDirective,
    CCExpiryFormatDirective,
    CCCvcFormatDirective,
    CardExpirationPipe,
    PhoneMaskDirective,
    PhoneMaskPipe,
  ],
  providers: [CardExpirationPipe, PhoneMaskPipe],
})
export class CntMasksModule {}
