import { NgModule } from '@angular/core';
import { TextMaskModule } from 'angular2-text-mask';
import { CardExpirationPipe } from './cc/card-expiration.pipe';
import { CCCvcFormatDirective } from './cc/directives/cc-cvc-format.directive';
import { CCExpiryFormatDirective } from './cc/directives/cc-expiry-format.directive';
import { CCNumberFormatDirective } from './cc/directives/cc-number-format.directive';
import { PhoneMaskDirective } from './phone/phone-mask.directive';
import { PhoneMaskPipe } from './phone/phone-mask.pipe';
import * as i0 from "@angular/core";
export class CntMasksModule {
}
CntMasksModule.ɵmod = i0.ɵɵdefineNgModule({ type: CntMasksModule });
CntMasksModule.ɵinj = i0.ɵɵdefineInjector({ factory: function CntMasksModule_Factory(t) { return new (t || CntMasksModule)(); }, providers: [CardExpirationPipe, PhoneMaskPipe], imports: [[TextMaskModule]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(CntMasksModule, { declarations: [CCNumberFormatDirective,
        CCExpiryFormatDirective,
        CCCvcFormatDirective,
        CardExpirationPipe,
        PhoneMaskDirective,
        PhoneMaskPipe], imports: [TextMaskModule], exports: [CCNumberFormatDirective,
        CCExpiryFormatDirective,
        CCCvcFormatDirective,
        CardExpirationPipe,
        PhoneMaskDirective,
        PhoneMaskPipe] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(CntMasksModule, [{
        type: NgModule,
        args: [{
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
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY250LW1hc2tzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2NudC1tYXNrcy9zcmMvbGliL2NudC1tYXNrcy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDcEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDL0QsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDL0UsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDckYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDckYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDbEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHlCQUF5QixDQUFDOztBQXNCeEQsTUFBTSxPQUFPLGNBQWM7O2tEQUFkLGNBQWM7MkdBQWQsY0FBYyxtQkFGZCxDQUFDLGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxZQWpCckMsQ0FBQyxjQUFjLENBQUM7d0ZBbUJkLGNBQWMsbUJBakJ2Qix1QkFBdUI7UUFDdkIsdUJBQXVCO1FBQ3ZCLG9CQUFvQjtRQUNwQixrQkFBa0I7UUFDbEIsa0JBQWtCO1FBQ2xCLGFBQWEsYUFQTCxjQUFjLGFBVXRCLHVCQUF1QjtRQUN2Qix1QkFBdUI7UUFDdkIsb0JBQW9CO1FBQ3BCLGtCQUFrQjtRQUNsQixrQkFBa0I7UUFDbEIsYUFBYTtrREFJSixjQUFjO2NBcEIxQixRQUFRO2VBQUM7Z0JBQ1IsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDO2dCQUN6QixZQUFZLEVBQUU7b0JBQ1osdUJBQXVCO29CQUN2Qix1QkFBdUI7b0JBQ3ZCLG9CQUFvQjtvQkFDcEIsa0JBQWtCO29CQUNsQixrQkFBa0I7b0JBQ2xCLGFBQWE7aUJBQ2Q7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLHVCQUF1QjtvQkFDdkIsdUJBQXVCO29CQUN2QixvQkFBb0I7b0JBQ3BCLGtCQUFrQjtvQkFDbEIsa0JBQWtCO29CQUNsQixhQUFhO2lCQUNkO2dCQUNELFNBQVMsRUFBRSxDQUFDLGtCQUFrQixFQUFFLGFBQWEsQ0FBQzthQUMvQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBUZXh0TWFza01vZHVsZSB9IGZyb20gJ2FuZ3VsYXIyLXRleHQtbWFzayc7XG5pbXBvcnQgeyBDYXJkRXhwaXJhdGlvblBpcGUgfSBmcm9tICcuL2NjL2NhcmQtZXhwaXJhdGlvbi5waXBlJztcbmltcG9ydCB7IENDQ3ZjRm9ybWF0RGlyZWN0aXZlIH0gZnJvbSAnLi9jYy9kaXJlY3RpdmVzL2NjLWN2Yy1mb3JtYXQuZGlyZWN0aXZlJztcbmltcG9ydCB7IENDRXhwaXJ5Rm9ybWF0RGlyZWN0aXZlIH0gZnJvbSAnLi9jYy9kaXJlY3RpdmVzL2NjLWV4cGlyeS1mb3JtYXQuZGlyZWN0aXZlJztcbmltcG9ydCB7IENDTnVtYmVyRm9ybWF0RGlyZWN0aXZlIH0gZnJvbSAnLi9jYy9kaXJlY3RpdmVzL2NjLW51bWJlci1mb3JtYXQuZGlyZWN0aXZlJztcbmltcG9ydCB7IFBob25lTWFza0RpcmVjdGl2ZSB9IGZyb20gJy4vcGhvbmUvcGhvbmUtbWFzay5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgUGhvbmVNYXNrUGlwZSB9IGZyb20gJy4vcGhvbmUvcGhvbmUtbWFzay5waXBlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1RleHRNYXNrTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgQ0NOdW1iZXJGb3JtYXREaXJlY3RpdmUsXG4gICAgQ0NFeHBpcnlGb3JtYXREaXJlY3RpdmUsXG4gICAgQ0NDdmNGb3JtYXREaXJlY3RpdmUsXG4gICAgQ2FyZEV4cGlyYXRpb25QaXBlLFxuICAgIFBob25lTWFza0RpcmVjdGl2ZSxcbiAgICBQaG9uZU1hc2tQaXBlLFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgQ0NOdW1iZXJGb3JtYXREaXJlY3RpdmUsXG4gICAgQ0NFeHBpcnlGb3JtYXREaXJlY3RpdmUsXG4gICAgQ0NDdmNGb3JtYXREaXJlY3RpdmUsXG4gICAgQ2FyZEV4cGlyYXRpb25QaXBlLFxuICAgIFBob25lTWFza0RpcmVjdGl2ZSxcbiAgICBQaG9uZU1hc2tQaXBlLFxuICBdLFxuICBwcm92aWRlcnM6IFtDYXJkRXhwaXJhdGlvblBpcGUsIFBob25lTWFza1BpcGVdLFxufSlcbmV4cG9ydCBjbGFzcyBDbnRNYXNrc01vZHVsZSB7fVxuIl19