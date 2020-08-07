import { Directive, ElementRef } from '@angular/core';
import { Payment } from '../payment';
export class CCExpiryFormatDirective {
    constructor(el) {
        this.el = el;
        const element = this.el.nativeElement;
        // call lib functions
        Payment.formatCardExpiry(element);
        Payment.restrictNumeric(element);
    }
}
CCExpiryFormatDirective.decorators = [
    { type: Directive, args: [{
                selector: '[cntMaskCCExp]',
            },] }
];
CCExpiryFormatDirective.ctorParameters = () => [
    { type: ElementRef }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2MtZXhwaXJ5LWZvcm1hdC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jbnQtbWFza3Mvc3JjL2xpYi9jYy9kaXJlY3RpdmVzL2NjLWV4cGlyeS1mb3JtYXQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXRELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFLckMsTUFBTSxPQUFPLHVCQUF1QjtJQUNsQyxZQUFvQixFQUFjO1FBQWQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNoQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQztRQUV0QyxxQkFBcUI7UUFDckIsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLE9BQU8sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkMsQ0FBQzs7O1lBVkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0I7YUFDM0I7OztZQU5tQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFBheW1lbnQgfSBmcm9tICcuLi9wYXltZW50JztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NudE1hc2tDQ0V4cF0nLFxufSlcbmV4cG9ydCBjbGFzcyBDQ0V4cGlyeUZvcm1hdERpcmVjdGl2ZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWYpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuXG4gICAgLy8gY2FsbCBsaWIgZnVuY3Rpb25zXG4gICAgUGF5bWVudC5mb3JtYXRDYXJkRXhwaXJ5KGVsZW1lbnQpO1xuICAgIFBheW1lbnQucmVzdHJpY3ROdW1lcmljKGVsZW1lbnQpO1xuICB9XG59XG4iXX0=