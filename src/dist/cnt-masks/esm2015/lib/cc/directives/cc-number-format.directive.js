import { Directive, HostListener } from '@angular/core';
import { Payment } from '../payment';
import * as i0 from "@angular/core";
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
CCNumberFormatDirective.ɵfac = function CCNumberFormatDirective_Factory(t) { return new (t || CCNumberFormatDirective)(i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef)); };
CCNumberFormatDirective.ɵdir = i0.ɵɵdefineDirective({ type: CCNumberFormatDirective, selectors: [["", "cntMaskCCNum", ""]], hostBindings: function CCNumberFormatDirective_HostBindings(rf, ctx) { if (rf & 1) {
        i0.ɵɵlistener("keypress", function CCNumberFormatDirective_keypress_HostBindingHandler($event) { return ctx.onKeypress($event); });
    } } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(CCNumberFormatDirective, [{
        type: Directive,
        args: [{
                selector: '[cntMaskCCNum]',
            }]
    }], function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }]; }, { onKeypress: [{
            type: HostListener,
            args: ['keypress', ['$event']]
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2MtbnVtYmVyLWZvcm1hdC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jbnQtbWFza3Mvc3JjL2xpYi9jYy9kaXJlY3RpdmVzL2NjLW51bWJlci1mb3JtYXQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBQy9FLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7O0FBS3JDLE1BQU0sT0FBTyx1QkFBdUI7SUFHbEMsWUFBb0IsUUFBbUIsRUFBVSxFQUFjO1FBQTNDLGFBQVEsR0FBUixRQUFRLENBQVc7UUFBVSxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQzdELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBRW5CLHFCQUFxQjtRQUNyQixPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBR0QsVUFBVSxDQUFDLENBQVE7UUFDakIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUM7UUFDdEMsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUVuQyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRW5ELElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLEVBQUUsRUFBRTtZQUN6QyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ25EO2FBQU07WUFDTCxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztTQUNwQjtJQUNILENBQUM7OzhGQXhCVSx1QkFBdUI7NERBQXZCLHVCQUF1QjtnSEFBdkIsc0JBQWtCOztrREFBbEIsdUJBQXVCO2NBSG5DLFNBQVM7ZUFBQztnQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO2FBQzNCOztrQkFhRSxZQUFZO21CQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyLCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBheW1lbnQgfSBmcm9tICcuLi9wYXltZW50JztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NudE1hc2tDQ051bV0nLFxufSlcbmV4cG9ydCBjbGFzcyBDQ051bWJlckZvcm1hdERpcmVjdGl2ZSB7XG4gIGNhcmRUeXBlOiBzdHJpbmcgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHJpdmF0ZSBlbDogRWxlbWVudFJlZikge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5jYXJkVHlwZSA9ICcnO1xuXG4gICAgLy8gY2FsbCBsaWIgZnVuY3Rpb25zXG4gICAgUGF5bWVudC5mb3JtYXRDYXJkTnVtYmVyKGVsZW1lbnQpO1xuICAgIFBheW1lbnQucmVzdHJpY3ROdW1lcmljKGVsZW1lbnQpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcigna2V5cHJlc3MnLCBbJyRldmVudCddKVxuICBvbktleXByZXNzKGU6IEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBlbGVtZW50VmFsdWUgPSBlbGVtZW50LnZhbHVlO1xuXG4gICAgdGhpcy5jYXJkVHlwZSA9IFBheW1lbnQuZm5zLmNhcmRUeXBlKGVsZW1lbnRWYWx1ZSk7XG5cbiAgICBpZiAodGhpcy5jYXJkVHlwZSAmJiB0aGlzLmNhcmRUeXBlICE9PSAnJykge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyhlbGVtZW50LCB0aGlzLmNhcmRUeXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jYXJkVHlwZSA9ICcnO1xuICAgIH1cbiAgfVxufVxuIl19