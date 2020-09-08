import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { Payment } from '../payment';
export class CCNumberFormatDirective {
    constructor(renderer, el) {
        this.renderer = renderer;
        this.el = el;
        const element = this.el.nativeElement;
        this.cardType = '';
        // call lib functions
        Payment.formatCardNumber(element);
        Payment.restrictNumeric(element);
    }
    onKeypress(e) {
        const element = this.el.nativeElement;
        const elementValue = element.value;
        this.cardType = Payment.fns.cardType(elementValue);
        if (this.cardType && this.cardType !== '') {
            this.renderer.removeClass(element, this.cardType);
        }
        else {
            this.cardType = '';
        }
    }
}
CCNumberFormatDirective.decorators = [
    { type: Directive, args: [{
                selector: '[cntMaskCCNum]',
            },] }
];
CCNumberFormatDirective.ctorParameters = () => [
    { type: Renderer2 },
    { type: ElementRef }
];
CCNumberFormatDirective.propDecorators = {
    onKeypress: [{ type: HostListener, args: ['keypress', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2MtbnVtYmVyLWZvcm1hdC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jbnQtbWFza3Mvc3JjL2xpYi9jYy9kaXJlY3RpdmVzL2NjLW51bWJlci1mb3JtYXQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDL0UsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUtyQyxNQUFNLE9BQU8sdUJBQXVCO0lBR2xDLFlBQW9CLFFBQW1CLEVBQVUsRUFBYztRQUEzQyxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQVUsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUM3RCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQztRQUN0QyxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUVuQixxQkFBcUI7UUFDckIsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLE9BQU8sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUdELFVBQVUsQ0FBQyxDQUFRO1FBQ2pCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDO1FBQ3RDLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFFbkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVuRCxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxFQUFFLEVBQUU7WUFDekMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNuRDthQUFNO1lBQ0wsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7U0FDcEI7SUFDSCxDQUFDOzs7WUEzQkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0I7YUFDM0I7OztZQUw2QyxTQUFTO1lBQW5DLFVBQVU7Ozt5QkFrQjNCLFlBQVksU0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQYXltZW50IH0gZnJvbSAnLi4vcGF5bWVudCc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjbnRNYXNrQ0NOdW1dJyxcbn0pXG5leHBvcnQgY2xhc3MgQ0NOdW1iZXJGb3JtYXREaXJlY3RpdmUge1xuICBjYXJkVHlwZTogc3RyaW5nIHwgbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgZWw6IEVsZW1lbnRSZWYpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuY2FyZFR5cGUgPSAnJztcblxuICAgIC8vIGNhbGwgbGliIGZ1bmN0aW9uc1xuICAgIFBheW1lbnQuZm9ybWF0Q2FyZE51bWJlcihlbGVtZW50KTtcbiAgICBQYXltZW50LnJlc3RyaWN0TnVtZXJpYyhlbGVtZW50KTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2tleXByZXNzJywgWyckZXZlbnQnXSlcbiAgb25LZXlwcmVzcyhlOiBFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgZWxlbWVudFZhbHVlID0gZWxlbWVudC52YWx1ZTtcblxuICAgIHRoaXMuY2FyZFR5cGUgPSBQYXltZW50LmZucy5jYXJkVHlwZShlbGVtZW50VmFsdWUpO1xuXG4gICAgaWYgKHRoaXMuY2FyZFR5cGUgJiYgdGhpcy5jYXJkVHlwZSAhPT0gJycpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3MoZWxlbWVudCwgdGhpcy5jYXJkVHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2FyZFR5cGUgPSAnJztcbiAgICB9XG4gIH1cbn1cbiJdfQ==