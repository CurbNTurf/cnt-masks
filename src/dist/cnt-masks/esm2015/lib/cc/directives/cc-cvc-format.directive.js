import { Directive } from '@angular/core';
import { Payment } from '../payment';
import * as i0 from "@angular/core";
export class CCCvcFormatDirective {
    constructor(el) {
        this.el = el;
        const element = this.el.nativeElement;
        // call lib functions
        Payment.formatCardCVC(element);
        Payment.restrictNumeric(element);
    }
}
CCCvcFormatDirective.ɵfac = function CCCvcFormatDirective_Factory(t) { return new (t || CCCvcFormatDirective)(i0.ɵɵdirectiveInject(i0.ElementRef)); };
CCCvcFormatDirective.ɵdir = i0.ɵɵdefineDirective({ type: CCCvcFormatDirective, selectors: [["", "cntMaskCCCvc", ""]] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(CCCvcFormatDirective, [{
        type: Directive,
        args: [{
                selector: '[cntMaskCCCvc]',
            }]
    }], function () { return [{ type: i0.ElementRef }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2MtY3ZjLWZvcm1hdC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jbnQtbWFza3Mvc3JjL2xpYi9jYy9kaXJlY3RpdmVzL2NjLWN2Yy1mb3JtYXQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWMsTUFBTSxlQUFlLENBQUM7QUFFdEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQzs7QUFLckMsTUFBTSxPQUFPLG9CQUFvQjtJQUMvQixZQUFvQixFQUFjO1FBQWQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNoQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQztRQUV0QyxxQkFBcUI7UUFDckIsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixPQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25DLENBQUM7O3dGQVBVLG9CQUFvQjt5REFBcEIsb0JBQW9CO2tEQUFwQixvQkFBb0I7Y0FIaEMsU0FBUztlQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0I7YUFDM0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgUGF5bWVudCB9IGZyb20gJy4uL3BheW1lbnQnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY250TWFza0NDQ3ZjXScsXG59KVxuZXhwb3J0IGNsYXNzIENDQ3ZjRm9ybWF0RGlyZWN0aXZlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZikge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAvLyBjYWxsIGxpYiBmdW5jdGlvbnNcbiAgICBQYXltZW50LmZvcm1hdENhcmRDVkMoZWxlbWVudCk7XG4gICAgUGF5bWVudC5yZXN0cmljdE51bWVyaWMoZWxlbWVudCk7XG4gIH1cbn1cbiJdfQ==