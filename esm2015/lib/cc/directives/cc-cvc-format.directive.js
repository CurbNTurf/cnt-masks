import { Directive, ElementRef } from '@angular/core';
import { Payment } from '../payment';
export class CCCvcFormatDirective {
    constructor(el) {
        this.el = el;
        const element = this.el.nativeElement;
        // call lib functions
        Payment.formatCardCVC(element);
        Payment.restrictNumeric(element);
    }
}
CCCvcFormatDirective.decorators = [
    { type: Directive, args: [{
                selector: '[cntMaskCCCvc]',
            },] }
];
CCCvcFormatDirective.ctorParameters = () => [
    { type: ElementRef }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2MtY3ZjLWZvcm1hdC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jbnQtbWFza3Mvc3JjL2xpYi9jYy9kaXJlY3RpdmVzL2NjLWN2Yy1mb3JtYXQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXRELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFLckMsTUFBTSxPQUFPLG9CQUFvQjtJQUMvQixZQUFvQixFQUFjO1FBQWQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNoQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQztRQUV0QyxxQkFBcUI7UUFDckIsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixPQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25DLENBQUM7OztZQVZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO2FBQzNCOzs7WUFObUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBQYXltZW50IH0gZnJvbSAnLi4vcGF5bWVudCc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjbnRNYXNrQ0NDdmNdJyxcbn0pXG5leHBvcnQgY2xhc3MgQ0NDdmNGb3JtYXREaXJlY3RpdmUge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcblxuICAgIC8vIGNhbGwgbGliIGZ1bmN0aW9uc1xuICAgIFBheW1lbnQuZm9ybWF0Q2FyZENWQyhlbGVtZW50KTtcbiAgICBQYXltZW50LnJlc3RyaWN0TnVtZXJpYyhlbGVtZW50KTtcbiAgfVxufVxuIl19