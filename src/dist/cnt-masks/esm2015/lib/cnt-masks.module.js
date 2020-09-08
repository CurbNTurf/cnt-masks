import { NgModule } from '@angular/core';
import { TextMaskModule } from './angular-2-text-mask.module';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY250LW1hc2tzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2NudC1tYXNrcy9zcmMvbGliL2NudC1tYXNrcy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDOUQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDL0QsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDL0UsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDckYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDckYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDbEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBc0J4RCxNQUFNLE9BQU8sY0FBYzs7O1lBcEIxQixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDO2dCQUN6QixZQUFZLEVBQUU7b0JBQ1osdUJBQXVCO29CQUN2Qix1QkFBdUI7b0JBQ3ZCLG9CQUFvQjtvQkFDcEIsa0JBQWtCO29CQUNsQixrQkFBa0I7b0JBQ2xCLGFBQWE7aUJBQ2Q7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLHVCQUF1QjtvQkFDdkIsdUJBQXVCO29CQUN2QixvQkFBb0I7b0JBQ3BCLGtCQUFrQjtvQkFDbEIsa0JBQWtCO29CQUNsQixhQUFhO2lCQUNkO2dCQUNELFNBQVMsRUFBRSxDQUFDLGtCQUFrQixFQUFFLGFBQWEsQ0FBQzthQUMvQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBUZXh0TWFza01vZHVsZSB9IGZyb20gJy4vYW5ndWxhci0yLXRleHQtbWFzay5tb2R1bGUnO1xuaW1wb3J0IHsgQ2FyZEV4cGlyYXRpb25QaXBlIH0gZnJvbSAnLi9jYy9jYXJkLWV4cGlyYXRpb24ucGlwZSc7XG5pbXBvcnQgeyBDQ0N2Y0Zvcm1hdERpcmVjdGl2ZSB9IGZyb20gJy4vY2MvZGlyZWN0aXZlcy9jYy1jdmMtZm9ybWF0LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBDQ0V4cGlyeUZvcm1hdERpcmVjdGl2ZSB9IGZyb20gJy4vY2MvZGlyZWN0aXZlcy9jYy1leHBpcnktZm9ybWF0LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBDQ051bWJlckZvcm1hdERpcmVjdGl2ZSB9IGZyb20gJy4vY2MvZGlyZWN0aXZlcy9jYy1udW1iZXItZm9ybWF0LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBQaG9uZU1hc2tEaXJlY3RpdmUgfSBmcm9tICcuL3Bob25lL3Bob25lLW1hc2suZGlyZWN0aXZlJztcbmltcG9ydCB7IFBob25lTWFza1BpcGUgfSBmcm9tICcuL3Bob25lL3Bob25lLW1hc2sucGlwZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtUZXh0TWFza01vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIENDTnVtYmVyRm9ybWF0RGlyZWN0aXZlLFxuICAgIENDRXhwaXJ5Rm9ybWF0RGlyZWN0aXZlLFxuICAgIENDQ3ZjRm9ybWF0RGlyZWN0aXZlLFxuICAgIENhcmRFeHBpcmF0aW9uUGlwZSxcbiAgICBQaG9uZU1hc2tEaXJlY3RpdmUsXG4gICAgUGhvbmVNYXNrUGlwZSxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIENDTnVtYmVyRm9ybWF0RGlyZWN0aXZlLFxuICAgIENDRXhwaXJ5Rm9ybWF0RGlyZWN0aXZlLFxuICAgIENDQ3ZjRm9ybWF0RGlyZWN0aXZlLFxuICAgIENhcmRFeHBpcmF0aW9uUGlwZSxcbiAgICBQaG9uZU1hc2tEaXJlY3RpdmUsXG4gICAgUGhvbmVNYXNrUGlwZSxcbiAgXSxcbiAgcHJvdmlkZXJzOiBbQ2FyZEV4cGlyYXRpb25QaXBlLCBQaG9uZU1hc2tQaXBlXSxcbn0pXG5leHBvcnQgY2xhc3MgQ250TWFza3NNb2R1bGUge31cbiJdfQ==