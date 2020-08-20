import { Directive } from '@angular/core';
import { Payment } from '../payment';
import * as i0 from "@angular/core";
export class CCExpiryFormatDirective {
    constructor(el) {
        this.el = el;
        const element = this.el.nativeElement;
        // call lib functions
        Payment.formatCardExpiry(element);
        Payment.restrictNumeric(element);
    }
}
CCExpiryFormatDirective.ɵfac = function CCExpiryFormatDirective_Factory(t) { return new (t || CCExpiryFormatDirective)(i0.ɵɵdirectiveInject(i0.ElementRef)); };
CCExpiryFormatDirective.ɵdir = i0.ɵɵdefineDirective({ type: CCExpiryFormatDirective, selectors: [["", "cntMaskCCExp", ""]] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(CCExpiryFormatDirective, [{
        type: Directive,
        args: [{
                selector: '[cntMaskCCExp]',
            }]
    }], function () { return [{ type: i0.ElementRef }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2MtZXhwaXJ5LWZvcm1hdC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jbnQtbWFza3Mvc3JjL2xpYi9jYy9kaXJlY3RpdmVzL2NjLWV4cGlyeS1mb3JtYXQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWMsTUFBTSxlQUFlLENBQUM7QUFFdEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQzs7QUFLckMsTUFBTSxPQUFPLHVCQUF1QjtJQUNsQyxZQUFvQixFQUFjO1FBQWQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNoQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQztRQUV0QyxxQkFBcUI7UUFDckIsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLE9BQU8sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkMsQ0FBQzs7OEZBUFUsdUJBQXVCOzREQUF2Qix1QkFBdUI7a0RBQXZCLHVCQUF1QjtjQUhuQyxTQUFTO2VBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjthQUMzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBQYXltZW50IH0gZnJvbSAnLi4vcGF5bWVudCc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjbnRNYXNrQ0NFeHBdJyxcbn0pXG5leHBvcnQgY2xhc3MgQ0NFeHBpcnlGb3JtYXREaXJlY3RpdmUge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcblxuICAgIC8vIGNhbGwgbGliIGZ1bmN0aW9uc1xuICAgIFBheW1lbnQuZm9ybWF0Q2FyZEV4cGlyeShlbGVtZW50KTtcbiAgICBQYXltZW50LnJlc3RyaWN0TnVtZXJpYyhlbGVtZW50KTtcbiAgfVxufVxuIl19