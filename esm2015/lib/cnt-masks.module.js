import { NgModule } from '@angular/core';
import { TextMaskModule } from 'angular2-text-mask';
import { CardExpirationPipe } from './cc/card-expiration.pipe';
import { CCCvcFormatDirective } from './cc/directives/cc-cvc-format.directive';
import { CCExpiryFormatDirective } from './cc/directives/cc-expiry-format.directive';
import { CCNumberFormatDirective } from './cc/directives/cc-number-format.directive';
import { PhoneMaskDirective } from './phone/phone-mask.directive';
import { PhoneMaskPipe } from './phone/phone-mask.pipe';
export class CntMasksModule {
}
CntMasksModule.decorators = [
    { type: NgModule, args: [{
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
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY250LW1hc2tzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2NudC1tYXNrcy9zcmMvbGliL2NudC1tYXNrcy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDcEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDL0QsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDL0UsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDckYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDckYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDbEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBc0J4RCxNQUFNLE9BQU8sY0FBYzs7O1lBcEIxQixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDO2dCQUN6QixZQUFZLEVBQUU7b0JBQ1osdUJBQXVCO29CQUN2Qix1QkFBdUI7b0JBQ3ZCLG9CQUFvQjtvQkFDcEIsa0JBQWtCO29CQUNsQixrQkFBa0I7b0JBQ2xCLGFBQWE7aUJBQ2Q7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLHVCQUF1QjtvQkFDdkIsdUJBQXVCO29CQUN2QixvQkFBb0I7b0JBQ3BCLGtCQUFrQjtvQkFDbEIsa0JBQWtCO29CQUNsQixhQUFhO2lCQUNkO2dCQUNELFNBQVMsRUFBRSxDQUFDLGtCQUFrQixFQUFFLGFBQWEsQ0FBQzthQUMvQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBUZXh0TWFza01vZHVsZSB9IGZyb20gJ2FuZ3VsYXIyLXRleHQtbWFzayc7XG5pbXBvcnQgeyBDYXJkRXhwaXJhdGlvblBpcGUgfSBmcm9tICcuL2NjL2NhcmQtZXhwaXJhdGlvbi5waXBlJztcbmltcG9ydCB7IENDQ3ZjRm9ybWF0RGlyZWN0aXZlIH0gZnJvbSAnLi9jYy9kaXJlY3RpdmVzL2NjLWN2Yy1mb3JtYXQuZGlyZWN0aXZlJztcbmltcG9ydCB7IENDRXhwaXJ5Rm9ybWF0RGlyZWN0aXZlIH0gZnJvbSAnLi9jYy9kaXJlY3RpdmVzL2NjLWV4cGlyeS1mb3JtYXQuZGlyZWN0aXZlJztcbmltcG9ydCB7IENDTnVtYmVyRm9ybWF0RGlyZWN0aXZlIH0gZnJvbSAnLi9jYy9kaXJlY3RpdmVzL2NjLW51bWJlci1mb3JtYXQuZGlyZWN0aXZlJztcbmltcG9ydCB7IFBob25lTWFza0RpcmVjdGl2ZSB9IGZyb20gJy4vcGhvbmUvcGhvbmUtbWFzay5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgUGhvbmVNYXNrUGlwZSB9IGZyb20gJy4vcGhvbmUvcGhvbmUtbWFzay5waXBlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1RleHRNYXNrTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgQ0NOdW1iZXJGb3JtYXREaXJlY3RpdmUsXG4gICAgQ0NFeHBpcnlGb3JtYXREaXJlY3RpdmUsXG4gICAgQ0NDdmNGb3JtYXREaXJlY3RpdmUsXG4gICAgQ2FyZEV4cGlyYXRpb25QaXBlLFxuICAgIFBob25lTWFza0RpcmVjdGl2ZSxcbiAgICBQaG9uZU1hc2tQaXBlLFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgQ0NOdW1iZXJGb3JtYXREaXJlY3RpdmUsXG4gICAgQ0NFeHBpcnlGb3JtYXREaXJlY3RpdmUsXG4gICAgQ0NDdmNGb3JtYXREaXJlY3RpdmUsXG4gICAgQ2FyZEV4cGlyYXRpb25QaXBlLFxuICAgIFBob25lTWFza0RpcmVjdGl2ZSxcbiAgICBQaG9uZU1hc2tQaXBlLFxuICBdLFxuICBwcm92aWRlcnM6IFtDYXJkRXhwaXJhdGlvblBpcGUsIFBob25lTWFza1BpcGVdLFxufSlcbmV4cG9ydCBjbGFzcyBDbnRNYXNrc01vZHVsZSB7fVxuIl19