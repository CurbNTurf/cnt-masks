import { Directive, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
// @dynamic
export class PhoneMaskDirectiveMock {
}
PhoneMaskDirectiveMock.decorators = [
    { type: Directive, args: [{
                exportAs: 'cntMaskPhone',
                providers: [
                    {
                        multi: true,
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => PhoneMaskDirectiveMock),
                    },
                ],
                selector: '[cntMaskPhone]',
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhvbmUtbWFzay5kaXJlY3RpdmUubW9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NudC1tYXNrcy9zcmMvbGliL3Bob25lL3Bob25lLW1hc2suZGlyZWN0aXZlLm1vY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdEQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkQsV0FBVztBQVlYLE1BQU0sT0FBTyxzQkFBc0I7OztZQVhsQyxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxLQUFLLEVBQUUsSUFBSTt3QkFDWCxPQUFPLEVBQUUsaUJBQWlCO3dCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHNCQUFzQixDQUFDO3FCQUN0RDtpQkFDRjtnQkFDRCxRQUFRLEVBQUUsZ0JBQWdCO2FBQzNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBmb3J3YXJkUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuLy8gQGR5bmFtaWNcbkBEaXJlY3RpdmUoe1xuICBleHBvcnRBczogJ2NudE1hc2tQaG9uZScsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBQaG9uZU1hc2tEaXJlY3RpdmVNb2NrKSxcbiAgICB9LFxuICBdLFxuICBzZWxlY3RvcjogJ1tjbnRNYXNrUGhvbmVdJyxcbn0pXG5leHBvcnQgY2xhc3MgUGhvbmVNYXNrRGlyZWN0aXZlTW9jayB7fVxuIl19