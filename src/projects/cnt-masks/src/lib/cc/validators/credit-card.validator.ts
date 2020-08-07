import { FormControl, ValidationErrors } from '@angular/forms';
import { Payment } from '../payment';

export class CreditCardValidator {
  /**
   * Validates a cc number
   */
  static validateCardNumber(control: FormControl): ValidationErrors {
    if (control) {
      const isValid = Payment.fns.validateCardNumber(control.value);

      if (!isValid) {
        return {
          cardNumber: true,
        };
      }
    }

    return null;
  }

  /**
   * Validates the expiry date.
   * Breaks exp by "/" string and assumes that first array entry is month and second year
   * Also removes any spaces
   */
  static validateCardExpiry(control: FormControl): ValidationErrors {
    if (control) {
      const controlValue = control.value.split('/');
      let isValid = false;

      if (controlValue.length > 1) {
        const month = controlValue[0].replace(/^\s+|\s+$/g, '');
        const year = controlValue[1].replace(/^\s+|\s+$/g, '');

        isValid = Payment.fns.validateCardExpiry(month, year);
      }

      if (!isValid) {
        return {
          cardExpiry: true,
        };
      }
    }

    return null;
  }

  /**
   * Validates cards CVC
   * Also removes any spaces
   */
  static validateCardCvc(control: FormControl): ValidationErrors {
    if (control) {
      const isValid = Payment.fns.validateCardCVC(control.value);

      if (!isValid) {
        return {
          cardCvc: true,
        };
      }
    }

    return null;
  }
}
