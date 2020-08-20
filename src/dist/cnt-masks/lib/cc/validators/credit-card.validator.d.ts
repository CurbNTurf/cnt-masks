import { FormControl, ValidationErrors } from '@angular/forms';
export declare class CreditCardValidator {
    /**
     * Validates a cc number
     */
    static validateCardNumber(control: FormControl): ValidationErrors;
    /**
     * Validates the expiry date.
     * Breaks exp by "/" string and assumes that first array entry is month and second year
     * Also removes any spaces
     */
    static validateCardExpiry(control: FormControl): ValidationErrors;
    /**
     * Validates cards CVC
     * Also removes any spaces
     */
    static validateCardCvc(control: FormControl): ValidationErrors;
}
