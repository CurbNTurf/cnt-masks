import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, forwardRef, HostListener, Inject, Input, Optional, PLATFORM_ID, Renderer2, } from '@angular/core';
import { COMPOSITION_BUFFER_MODE, NG_VALUE_ACCESSOR, } from '@angular/forms';
import { createTextMaskInputElement } from 'text-mask-core/dist/textMaskCore';
import { clean, mask } from './utils';
export class TextMaskConfig {
}
// @dynamic
export class PhoneMaskDirective {
    constructor(renderer, elementRef, platformId, compositionMode) {
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.platformId = platformId;
        this.compositionMode = compositionMode;
        this.clean = true;
        this.maxNumberLength = 13;
        /** Whether the user is creating a composition string (IME events). */
        this.composing = false;
        this.onChange = (_) => {
            // implement
        };
        this.onTouched = () => {
            // implement
        };
        if (this.compositionMode == null) {
            this.compositionMode = !this.isAndroid();
        }
    }
    ngOnInit() {
        this.setupMask(true);
        if (this.textMaskInputElement !== undefined) {
            this.textMaskInputElement.update(this.inputElement.value);
        }
    }
    ngOnChanges(changes) {
        this.setupMask(true);
        if (this.textMaskInputElement !== undefined) {
            this.textMaskInputElement.update(this.inputElement.value);
        }
    }
    onBlur() {
        this.onTouched();
    }
    writeValue(value) {
        this.setupMask();
        // set the initial value for cases where the mask is disabled
        const normalizedValue = value == null ? '' : value;
        this.renderer.setProperty(this.inputElement, 'value', normalizedValue);
        if (this.textMaskInputElement !== undefined) {
            this.textMaskInputElement.update(value);
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }
    handleInput(value) {
        if (!this.compositionMode || (this.compositionMode && !this.composing)) {
            this.setupMask();
            if (this.textMaskInputElement !== undefined) {
                this.textMaskInputElement.update(value);
                // get the updated value
                value = this.inputElement.value;
                if (this.clean) {
                    this.onChange(clean(value));
                }
                else {
                    this.onChange(value);
                }
            }
        }
    }
    setupMask(create = false) {
        this.textMaskConfig = {
            mask: mask(this.maxNumberLength),
            guide: false,
            placeholderChar: '_',
            pipe: undefined,
            keepCharPositions: false,
        };
        if (!this.inputElement) {
            if (this.elementRef.nativeElement.tagName.toUpperCase() === 'INPUT') {
                // `textMask` directive is used directly on an input element
                this.inputElement = this.elementRef.nativeElement;
            }
            else {
                // `textMask` directive is used on an abstracted input element, `md-input-container`, etc
                this.inputElement = this.elementRef.nativeElement.getElementsByTagName('INPUT')[0];
            }
        }
        if (this.inputElement && create) {
            this.textMaskInputElement = createTextMaskInputElement(Object.assign({ inputElement: this.inputElement }, this.textMaskConfig));
        }
    }
    compositionStart() {
        this.composing = true;
    }
    compositionEnd(value) {
        this.composing = false;
        // tslint:disable-next-line: no-unused-expression
        this.compositionMode && this.handleInput(value);
    }
    /**
     * We must check whether the agent is Android because composition events
     * behave differently between iOS and Android.
     */
    isAndroid() {
        if (isPlatformBrowser(this.platformId) &&
            window &&
            window.navigator) {
            const userAgent = window.navigator.userAgent;
            return /android (\d+)/.test(userAgent.toLowerCase());
        }
        return false;
    }
}
PhoneMaskDirective.decorators = [
    { type: Directive, args: [{
                selector: '[cntMaskPhone]',
                exportAs: 'cntMaskPhone',
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => PhoneMaskDirective),
                        multi: true,
                    },
                ],
            },] }
];
PhoneMaskDirective.ctorParameters = () => [
    { type: Renderer2 },
    { type: ElementRef },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: Boolean, decorators: [{ type: Optional }, { type: Inject, args: [COMPOSITION_BUFFER_MODE,] }] }
];
PhoneMaskDirective.propDecorators = {
    clean: [{ type: Input }],
    maxNumberLength: [{ type: Input }],
    onBlur: [{ type: HostListener, args: ['blur',] }],
    handleInput: [{ type: HostListener, args: ['input', ['$event.target.value'],] }],
    compositionStart: [{ type: HostListener, args: ['compositionstart',] }],
    compositionEnd: [{ type: HostListener, args: ['compositionend', ['$event.target.value'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhvbmUtbWFzay5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jbnQtbWFza3Mvc3JjL2xpYi9waG9uZS9waG9uZS1tYXNrLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBR0wsUUFBUSxFQUNSLFdBQVcsRUFDWCxTQUFTLEdBRVYsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLHVCQUF1QixFQUV2QixpQkFBaUIsR0FDbEIsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUM5RSxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUV0QyxNQUFNLE9BQU8sY0FBYztDQWExQjtBQUVELFdBQVc7QUFZWCxNQUFNLE9BQU8sa0JBQWtCO0lBYTdCLFlBQ1UsUUFBbUIsRUFDbkIsVUFBc0IsRUFDRCxVQUFrQixFQUd2QyxlQUF3QjtRQUx4QixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDRCxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBR3ZDLG9CQUFlLEdBQWYsZUFBZSxDQUFTO1FBakJ6QixVQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2Isb0JBQWUsR0FBRyxFQUFFLENBQUM7UUFPOUIsc0VBQXNFO1FBQzlELGNBQVMsR0FBRyxLQUFLLENBQUM7UUFlMUIsYUFBUSxHQUFHLENBQUMsQ0FBTSxFQUFFLEVBQUU7WUFDcEIsWUFBWTtRQUNkLENBQUMsQ0FBQTtRQUVELGNBQVMsR0FBRyxHQUFHLEVBQUU7WUFDZixZQUFZO1FBQ2Qs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QUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7U0FDdEQ7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7OztZQXRLRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxPQUFPLEVBQUUsaUJBQWlCO3dCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDO3dCQUNqRCxLQUFLLEVBQUUsSUFBSTtxQkFDWjtpQkFDRjthQUNGOzs7WUFyQ0MsU0FBUztZQVRULFVBQVU7eUNBK0RQLE1BQU0sU0FBQyxXQUFXOzBDQUNsQixRQUFRLFlBQ1IsTUFBTSxTQUFDLHVCQUF1Qjs7O29CQWhCaEMsS0FBSzs4QkFDTCxLQUFLO3FCQTZDTCxZQUFZLFNBQUMsTUFBTTswQkFpQ25CLFlBQVksU0FBQyxPQUFPLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQzsrQkErQzdDLFlBQVksU0FBQyxrQkFBa0I7NkJBSy9CLFlBQVksU0FBQyxnQkFBZ0IsRUFBRSxDQUFDLHFCQUFxQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0TGlzdGVuZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgUExBVEZPUk1fSUQsXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDT01QT1NJVElPTl9CVUZGRVJfTU9ERSxcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gIE5HX1ZBTFVFX0FDQ0VTU09SLFxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBjcmVhdGVUZXh0TWFza0lucHV0RWxlbWVudCB9IGZyb20gJ3RleHQtbWFzay1jb3JlL2Rpc3QvdGV4dE1hc2tDb3JlJztcbmltcG9ydCB7IGNsZWFuLCBtYXNrIH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBjbGFzcyBUZXh0TWFza0NvbmZpZyB7XG4gIG1hc2s6XG4gICAgfCBBcnJheTxzdHJpbmcgfCBSZWdFeHA+XG4gICAgfCAoKHJhdzogc3RyaW5nKSA9PiBBcnJheTxzdHJpbmcgfCBSZWdFeHA+KVxuICAgIHwgZmFsc2U7XG4gIGd1aWRlPzogYm9vbGVhbjtcbiAgcGxhY2Vob2xkZXJDaGFyPzogc3RyaW5nO1xuICBwaXBlPzogKFxuICAgIGNvbmZvcm1lZFZhbHVlOiBzdHJpbmcsXG4gICAgY29uZmlnOiBUZXh0TWFza0NvbmZpZ1xuICApID0+IGZhbHNlIHwgc3RyaW5nIHwgb2JqZWN0O1xuICBrZWVwQ2hhclBvc2l0aW9ucz86IGJvb2xlYW47XG4gIHNob3dNYXNrPzogYm9vbGVhbjtcbn1cblxuLy8gQGR5bmFtaWNcbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjbnRNYXNrUGhvbmVdJyxcbiAgZXhwb3J0QXM6ICdjbnRNYXNrUGhvbmUnLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFBob25lTWFza0RpcmVjdGl2ZSksXG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBQaG9uZU1hc2tEaXJlY3RpdmVcbiAgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25DaGFuZ2VzLCBPbkluaXQge1xuICBASW5wdXQoKSBjbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIG1heE51bWJlckxlbmd0aCA9IDEzO1xuXG4gIHRleHRNYXNrQ29uZmlnOiBUZXh0TWFza0NvbmZpZztcblxuICBwcml2YXRlIHRleHRNYXNrSW5wdXRFbGVtZW50OiBhbnk7XG4gIHByaXZhdGUgaW5wdXRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB1c2VyIGlzIGNyZWF0aW5nIGEgY29tcG9zaXRpb24gc3RyaW5nIChJTUUgZXZlbnRzKS4gKi9cbiAgcHJpdmF0ZSBjb21wb3NpbmcgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogb2JqZWN0LFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChDT01QT1NJVElPTl9CVUZGRVJfTU9ERSlcbiAgICBwcml2YXRlIGNvbXBvc2l0aW9uTW9kZTogYm9vbGVhblxuICApIHtcbiAgICBpZiAodGhpcy5jb21wb3NpdGlvbk1vZGUgPT0gbnVsbCkge1xuICAgICAgdGhpcy5jb21wb3NpdGlvbk1vZGUgPSAhdGhpcy5pc0FuZHJvaWQoKTtcbiAgICB9XG4gIH1cblxuICBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHtcbiAgICAvLyBpbXBsZW1lbnRcbiAgfVxuXG4gIG9uVG91Y2hlZCA9ICgpID0+IHtcbiAgICAvLyBpbXBsZW1lbnRcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuc2V0dXBNYXNrKHRydWUpO1xuICAgIGlmICh0aGlzLnRleHRNYXNrSW5wdXRFbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMudGV4dE1hc2tJbnB1dEVsZW1lbnQudXBkYXRlKHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgdGhpcy5zZXR1cE1hc2sodHJ1ZSk7XG4gICAgaWYgKHRoaXMudGV4dE1hc2tJbnB1dEVsZW1lbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy50ZXh0TWFza0lucHV0RWxlbWVudC51cGRhdGUodGhpcy5pbnB1dEVsZW1lbnQudmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2JsdXInKVxuICBvbkJsdXIoKTogdm9pZCB7XG4gICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc2V0dXBNYXNrKCk7XG5cbiAgICAvLyBzZXQgdGhlIGluaXRpYWwgdmFsdWUgZm9yIGNhc2VzIHdoZXJlIHRoZSBtYXNrIGlzIGRpc2FibGVkXG4gICAgY29uc3Qgbm9ybWFsaXplZFZhbHVlID0gdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWU7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLmlucHV0RWxlbWVudCwgJ3ZhbHVlJywgbm9ybWFsaXplZFZhbHVlKTtcblxuICAgIGlmICh0aGlzLnRleHRNYXNrSW5wdXRFbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMudGV4dE1hc2tJbnB1dEVsZW1lbnQudXBkYXRlKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogYW55KSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eShcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgJ2Rpc2FibGVkJyxcbiAgICAgIGlzRGlzYWJsZWRcbiAgICApO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignaW5wdXQnLCBbJyRldmVudC50YXJnZXQudmFsdWUnXSlcbiAgaGFuZGxlSW5wdXQodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICghdGhpcy5jb21wb3NpdGlvbk1vZGUgfHwgKHRoaXMuY29tcG9zaXRpb25Nb2RlICYmICF0aGlzLmNvbXBvc2luZykpIHtcbiAgICAgIHRoaXMuc2V0dXBNYXNrKCk7XG5cbiAgICAgIGlmICh0aGlzLnRleHRNYXNrSW5wdXRFbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy50ZXh0TWFza0lucHV0RWxlbWVudC51cGRhdGUodmFsdWUpO1xuXG4gICAgICAgIC8vIGdldCB0aGUgdXBkYXRlZCB2YWx1ZVxuICAgICAgICB2YWx1ZSA9IHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlO1xuXG4gICAgICAgIGlmICh0aGlzLmNsZWFuKSB7XG4gICAgICAgICAgdGhpcy5vbkNoYW5nZShjbGVhbih2YWx1ZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub25DaGFuZ2UodmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0dXBNYXNrKGNyZWF0ZSA9IGZhbHNlKTogdm9pZCB7XG4gICAgdGhpcy50ZXh0TWFza0NvbmZpZyA9IHtcbiAgICAgIG1hc2s6IG1hc2sodGhpcy5tYXhOdW1iZXJMZW5ndGgpLFxuICAgICAgZ3VpZGU6IGZhbHNlLFxuICAgICAgcGxhY2Vob2xkZXJDaGFyOiAnXycsXG4gICAgICBwaXBlOiB1bmRlZmluZWQsXG4gICAgICBrZWVwQ2hhclBvc2l0aW9uczogZmFsc2UsXG4gICAgfTtcbiAgICBpZiAoIXRoaXMuaW5wdXRFbGVtZW50KSB7XG4gICAgICBpZiAodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudGFnTmFtZS50b1VwcGVyQ2FzZSgpID09PSAnSU5QVVQnKSB7XG4gICAgICAgIC8vIGB0ZXh0TWFza2AgZGlyZWN0aXZlIGlzIHVzZWQgZGlyZWN0bHkgb24gYW4gaW5wdXQgZWxlbWVudFxuICAgICAgICB0aGlzLmlucHV0RWxlbWVudCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gYHRleHRNYXNrYCBkaXJlY3RpdmUgaXMgdXNlZCBvbiBhbiBhYnN0cmFjdGVkIGlucHV0IGVsZW1lbnQsIGBtZC1pbnB1dC1jb250YWluZXJgLCBldGNcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcbiAgICAgICAgICAnSU5QVVQnXG4gICAgICAgIClbMF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaW5wdXRFbGVtZW50ICYmIGNyZWF0ZSkge1xuICAgICAgdGhpcy50ZXh0TWFza0lucHV0RWxlbWVudCA9IGNyZWF0ZVRleHRNYXNrSW5wdXRFbGVtZW50KFxuICAgICAgICBPYmplY3QuYXNzaWduKHsgaW5wdXRFbGVtZW50OiB0aGlzLmlucHV0RWxlbWVudCB9LCB0aGlzLnRleHRNYXNrQ29uZmlnKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjb21wb3NpdGlvbnN0YXJ0JylcbiAgY29tcG9zaXRpb25TdGFydCgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbXBvc2luZyA9IHRydWU7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjb21wb3NpdGlvbmVuZCcsIFsnJGV2ZW50LnRhcmdldC52YWx1ZSddKVxuICBjb21wb3NpdGlvbkVuZCh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5jb21wb3NpbmcgPSBmYWxzZTtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVudXNlZC1leHByZXNzaW9uXG4gICAgdGhpcy5jb21wb3NpdGlvbk1vZGUgJiYgdGhpcy5oYW5kbGVJbnB1dCh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogV2UgbXVzdCBjaGVjayB3aGV0aGVyIHRoZSBhZ2VudCBpcyBBbmRyb2lkIGJlY2F1c2UgY29tcG9zaXRpb24gZXZlbnRzXG4gICAqIGJlaGF2ZSBkaWZmZXJlbnRseSBiZXR3ZWVuIGlPUyBhbmQgQW5kcm9pZC5cbiAgICovXG4gIHByaXZhdGUgaXNBbmRyb2lkKCk6IGJvb2xlYW4ge1xuICAgIGlmIChcbiAgICAgIGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkgJiZcbiAgICAgIHdpbmRvdyAmJlxuICAgICAgKHdpbmRvdyBhcyBhbnkpLm5hdmlnYXRvclxuICAgICkge1xuICAgICAgY29uc3QgdXNlckFnZW50ID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgICByZXR1cm4gL2FuZHJvaWQgKFxcZCspLy50ZXN0KHVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiJdfQ==