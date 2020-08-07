import { Pipe } from '@angular/core';
import { conformToMask } from 'angular2-text-mask';
import { mask } from './utils';
export class PhoneMaskPipe {
    transform(value) {
        if (!value) {
            return '';
        }
        return conformToMask(value, mask(), { guide: false }).conformedValue;
    }
}
PhoneMaskPipe.decorators = [
    { type: Pipe, args: [{
                name: 'cntMaskPhone',
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhvbmUtbWFzay5waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY250LW1hc2tzL3NyYy9saWIvcGhvbmUvcGhvbmUtbWFzay5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBQ3BELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNuRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBSy9CLE1BQU0sT0FBTyxhQUFhO0lBQ3hCLFNBQVMsQ0FBQyxLQUFhO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBRUQsT0FBTyxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDO0lBQ3ZFLENBQUM7OztZQVZGLElBQUksU0FBQztnQkFDSixJQUFJLEVBQUUsY0FBYzthQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGNvbmZvcm1Ub01hc2sgfSBmcm9tICdhbmd1bGFyMi10ZXh0LW1hc2snO1xuaW1wb3J0IHsgbWFzayB9IGZyb20gJy4vdXRpbHMnO1xuXG5AUGlwZSh7XG4gIG5hbWU6ICdjbnRNYXNrUGhvbmUnLFxufSlcbmV4cG9ydCBjbGFzcyBQaG9uZU1hc2tQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIHRyYW5zZm9ybSh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbmZvcm1Ub01hc2sodmFsdWUsIG1hc2soKSwgeyBndWlkZTogZmFsc2UgfSkuY29uZm9ybWVkVmFsdWU7XG4gIH1cbn1cbiJdfQ==