import { Pipe } from '@angular/core';
import { conformToMask } from 'angular2-text-mask';
import { mask } from './utils';
import * as i0 from "@angular/core";
export class PhoneMaskPipe {
    transform(value) {
        if (!value) {
            return '';
        }
        return conformToMask(value, mask(), { guide: false }).conformedValue;
    }
}
PhoneMaskPipe.ɵfac = function PhoneMaskPipe_Factory(t) { return new (t || PhoneMaskPipe)(); };
PhoneMaskPipe.ɵpipe = i0.ɵɵdefinePipe({ name: "cntMaskPhone", type: PhoneMaskPipe, pure: true });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(PhoneMaskPipe, [{
        type: Pipe,
        args: [{
                name: 'cntMaskPhone',
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhvbmUtbWFzay5waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY250LW1hc2tzL3NyYy9saWIvcGhvbmUvcGhvbmUtbWFzay5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBQ3BELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNuRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sU0FBUyxDQUFDOztBQUsvQixNQUFNLE9BQU8sYUFBYTtJQUN4QixTQUFTLENBQUMsS0FBYTtRQUNyQixJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUVELE9BQU8sYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQztJQUN2RSxDQUFDOzswRUFQVSxhQUFhO29FQUFiLGFBQWE7a0RBQWIsYUFBYTtjQUh6QixJQUFJO2VBQUM7Z0JBQ0osSUFBSSxFQUFFLGNBQWM7YUFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBjb25mb3JtVG9NYXNrIH0gZnJvbSAnYW5ndWxhcjItdGV4dC1tYXNrJztcbmltcG9ydCB7IG1hc2sgfSBmcm9tICcuL3V0aWxzJztcblxuQFBpcGUoe1xuICBuYW1lOiAnY250TWFza1Bob25lJyxcbn0pXG5leHBvcnQgY2xhc3MgUGhvbmVNYXNrUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0odmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHJldHVybiBjb25mb3JtVG9NYXNrKHZhbHVlLCBtYXNrKCksIHsgZ3VpZGU6IGZhbHNlIH0pLmNvbmZvcm1lZFZhbHVlO1xuICB9XG59XG4iXX0=