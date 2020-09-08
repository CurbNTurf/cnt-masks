import { Pipe } from '@angular/core';
import { conformToMask } from '../mask/conform-to-mask.function';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhvbmUtbWFzay5waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY250LW1hc2tzL3NyYy9saWIvcGhvbmUvcGhvbmUtbWFzay5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBQ3BELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNqRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBSy9CLE1BQU0sT0FBTyxhQUFhO0lBQ3hCLFNBQVMsQ0FBQyxLQUFhO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBRUQsT0FBTyxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDO0lBQ3ZFLENBQUM7OztZQVZGLElBQUksU0FBQztnQkFDSixJQUFJLEVBQUUsY0FBYzthQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGNvbmZvcm1Ub01hc2sgfSBmcm9tICcuLi9tYXNrL2NvbmZvcm0tdG8tbWFzay5mdW5jdGlvbic7XG5pbXBvcnQgeyBtYXNrIH0gZnJvbSAnLi91dGlscyc7XG5cbkBQaXBlKHtcbiAgbmFtZTogJ2NudE1hc2tQaG9uZScsXG59KVxuZXhwb3J0IGNsYXNzIFBob25lTWFza1BpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgdHJhbnNmb3JtKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICByZXR1cm4gY29uZm9ybVRvTWFzayh2YWx1ZSwgbWFzaygpLCB7IGd1aWRlOiBmYWxzZSB9KS5jb25mb3JtZWRWYWx1ZTtcbiAgfVxufVxuIl19