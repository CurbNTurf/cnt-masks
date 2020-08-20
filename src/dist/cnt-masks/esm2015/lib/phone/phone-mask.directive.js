import { isPlatformBrowser } from '@angular/common';
import { Directive, forwardRef, HostListener, Inject, Input, Optional, PLATFORM_ID, } from '@angular/core';
import { COMPOSITION_BUFFER_MODE, NG_VALUE_ACCESSOR, } from '@angular/forms';
import { createTextMaskInputElement } from 'text-mask-core/dist/textMaskCore';
import { clean, mask } from './utils';
import * as i0 from "@angular/core";
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
PhoneMaskDirective.ɵfac = function PhoneMaskDirective_Factory(t) { return new (t || PhoneMaskDirective)(i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(PLATFORM_ID), i0.ɵɵdirectiveInject(COMPOSITION_BUFFER_MODE, 8)); };
PhoneMaskDirective.ɵdir = i0.ɵɵdefineDirective({ type: PhoneMaskDirective, selectors: [["", "cntMaskPhone", ""]], hostBindings: function PhoneMaskDirective_HostBindings(rf, ctx) { if (rf & 1) {
        i0.ɵɵlistener("blur", function PhoneMaskDirective_blur_HostBindingHandler() { return ctx.onBlur(); })("input", function PhoneMaskDirective_input_HostBindingHandler($event) { return ctx.handleInput($event.target.value); })("compositionstart", function PhoneMaskDirective_compositionstart_HostBindingHandler() { return ctx.compositionStart(); })("compositionend", function PhoneMaskDirective_compositionend_HostBindingHandler($event) { return ctx.compositionEnd($event.target.value); });
    } }, inputs: { clean: "clean", maxNumberLength: "maxNumberLength" }, exportAs: ["cntMaskPhone"], features: [i0.ɵɵProvidersFeature([
            {
                multi: true,
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PhoneMaskDirective),
            },
        ]), i0.ɵɵNgOnChangesFeature] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(PhoneMaskDirective, [{
        type: Directive,
        args: [{
                exportAs: 'cntMaskPhone',
                providers: [
                    {
                        multi: true,
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => PhoneMaskDirective),
                    },
                ],
                selector: '[cntMaskPhone]',
            }]
    }], function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                type: Inject,
                args: [PLATFORM_ID]
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [COMPOSITION_BUFFER_MODE]
            }] }]; }, { clean: [{
            type: Input
        }], maxNumberLength: [{
            type: Input
        }], onBlur: [{
            type: HostListener,
            args: ['blur']
        }], handleInput: [{
            type: HostListener,
            args: ['input', ['$event.target.value']]
        }], compositionStart: [{
            type: HostListener,
            args: ['compositionstart']
        }], compositionEnd: [{
            type: HostListener,
            args: ['compositionend', ['$event.target.value']]
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhvbmUtbWFzay5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jbnQtbWFza3Mvc3JjL2xpYi9waG9uZS9waG9uZS1tYXNrLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQ0wsU0FBUyxFQUVULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFHTCxRQUFRLEVBQ1IsV0FBVyxHQUdaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCx1QkFBdUIsRUFFdkIsaUJBQWlCLEdBQ2xCLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEIsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDOUUsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxTQUFTLENBQUM7O0FBRXRDLE1BQU0sT0FBTyxjQUFjO0NBYTFCO0FBRUQsV0FBVztBQVlYLE1BQU0sT0FBTyxrQkFBa0I7SUFhN0IsWUFDVSxRQUFtQixFQUNuQixVQUFzQixFQUNELFVBQWtCLEVBR3ZDLGVBQXdCO1FBTHhCLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUNELGVBQVUsR0FBVixVQUFVLENBQVE7UUFHdkMsb0JBQWUsR0FBZixlQUFlLENBQVM7UUFqQmxCLFVBQUssR0FBRyxJQUFJLENBQUM7UUFDYixvQkFBZSxHQUFHLEVBQUUsQ0FBQztRQU9yQyxzRUFBc0U7UUFDOUQsY0FBUyxHQUFHLEtBQUssQ0FBQztRQWVuQixhQUFRLEdBQUcsQ0FBQyxDQUFNLEVBQUUsRUFBRTtZQUMzQixZQUFZO1FBQ2QsQ0FBQyxDQUFDO1FBRUssY0FBUyxHQUFHLEdBQUcsRUFBRTtZQUN0QixZQUFZO1FBQ2QsQ0FBQyxDQUFDO1FBWEEsSUFB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RUFBRSxDQUFDLENBQUM7U0FDdEQ7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7O29GQTNKVSxrQkFBa0IsZ0dBZ0JuQixXQUFXLHdCQUVYLHVCQUF1Qjt1REFsQnRCLGtCQUFrQjs2RkFBbEIsWUFBUSxvRkFBUixvQ0FDQSxvR0FEQSxzQkFBa0Isc0dBQWxCLHVDQUNHO3NJQVZIO1lBQ1Q7Z0JBQ0UsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsT0FBTyxFQUFFLGlCQUFpQjtnQkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQzthQUNsRDtTQUNGO2tEQUdVLGtCQUFrQjtjQVg5QixTQUFTO2VBQUM7Z0JBQ1QsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxLQUFLLEVBQUUsSUFBSTt3QkFDWCxPQUFPLEVBQUUsaUJBQWlCO3dCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDO3FCQUNsRDtpQkFDRjtnQkFDRCxRQUFRLEVBQUUsZ0JBQWdCO2FBQzNCOztzQkFpQkksTUFBTTt1QkFBQyxXQUFXOztzQkFDbEIsUUFBUTs7c0JBQ1IsTUFBTTt1QkFBQyx1QkFBdUI7O2tCQWhCaEMsS0FBSzs7a0JBQ0wsS0FBSzs7a0JBNkNMLFlBQVk7bUJBQUMsTUFBTTs7a0JBaUNuQixZQUFZO21CQUFDLE9BQU8sRUFBRSxDQUFDLHFCQUFxQixDQUFDOztrQkErQzdDLFlBQVk7bUJBQUMsa0JBQWtCOztrQkFLL0IsWUFBWTttQkFBQyxnQkFBZ0IsRUFBRSxDQUFDLHFCQUFxQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0TGlzdGVuZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgUExBVEZPUk1fSUQsXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDT01QT1NJVElPTl9CVUZGRVJfTU9ERSxcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gIE5HX1ZBTFVFX0FDQ0VTU09SLFxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBjcmVhdGVUZXh0TWFza0lucHV0RWxlbWVudCB9IGZyb20gJ3RleHQtbWFzay1jb3JlL2Rpc3QvdGV4dE1hc2tDb3JlJztcbmltcG9ydCB7IGNsZWFuLCBtYXNrIH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBjbGFzcyBUZXh0TWFza0NvbmZpZyB7XG4gIHB1YmxpYyBtYXNrOlxuICAgIHwgQXJyYXk8c3RyaW5nIHwgUmVnRXhwPlxuICAgIHwgKChyYXc6IHN0cmluZykgPT4gQXJyYXk8c3RyaW5nIHwgUmVnRXhwPilcbiAgICB8IGZhbHNlO1xuICBwdWJsaWMgZ3VpZGU/OiBib29sZWFuO1xuICBwdWJsaWMgcGxhY2Vob2xkZXJDaGFyPzogc3RyaW5nO1xuICBwdWJsaWMgcGlwZT86IChcbiAgICBjb25mb3JtZWRWYWx1ZTogc3RyaW5nLFxuICAgIGNvbmZpZzogVGV4dE1hc2tDb25maWcsXG4gICkgPT4gZmFsc2UgfCBzdHJpbmcgfCBvYmplY3Q7XG4gIHB1YmxpYyBrZWVwQ2hhclBvc2l0aW9ucz86IGJvb2xlYW47XG4gIHB1YmxpYyBzaG93TWFzaz86IGJvb2xlYW47XG59XG5cbi8vIEBkeW5hbWljXG5ARGlyZWN0aXZlKHtcbiAgZXhwb3J0QXM6ICdjbnRNYXNrUGhvbmUnLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUGhvbmVNYXNrRGlyZWN0aXZlKSxcbiAgICB9LFxuICBdLFxuICBzZWxlY3RvcjogJ1tjbnRNYXNrUGhvbmVdJyxcbn0pXG5leHBvcnQgY2xhc3MgUGhvbmVNYXNrRGlyZWN0aXZlXG4gIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uQ2hhbmdlcywgT25Jbml0IHtcbiAgQElucHV0KCkgcHVibGljIGNsZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgcHVibGljIG1heE51bWJlckxlbmd0aCA9IDEzO1xuXG4gIHB1YmxpYyB0ZXh0TWFza0NvbmZpZzogVGV4dE1hc2tDb25maWc7XG5cbiAgcHJpdmF0ZSB0ZXh0TWFza0lucHV0RWxlbWVudDogYW55O1xuICBwcml2YXRlIGlucHV0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcblxuICAvKiogV2hldGhlciB0aGUgdXNlciBpcyBjcmVhdGluZyBhIGNvbXBvc2l0aW9uIHN0cmluZyAoSU1FIGV2ZW50cykuICovXG4gIHByaXZhdGUgY29tcG9zaW5nID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IG9iamVjdCxcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoQ09NUE9TSVRJT05fQlVGRkVSX01PREUpXG4gICAgcHJpdmF0ZSBjb21wb3NpdGlvbk1vZGU6IGJvb2xlYW4sXG4gICkge1xuICAgIGlmICh0aGlzLmNvbXBvc2l0aW9uTW9kZSA9PSBudWxsKSB7XG4gICAgICB0aGlzLmNvbXBvc2l0aW9uTW9kZSA9ICF0aGlzLmlzQW5kcm9pZCgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHtcbiAgICAvLyBpbXBsZW1lbnRcbiAgfTtcblxuICBwdWJsaWMgb25Ub3VjaGVkID0gKCkgPT4ge1xuICAgIC8vIGltcGxlbWVudFxuICB9O1xuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuc2V0dXBNYXNrKHRydWUpO1xuICAgIGlmICh0aGlzLnRleHRNYXNrSW5wdXRFbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMudGV4dE1hc2tJbnB1dEVsZW1lbnQudXBkYXRlKHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgdGhpcy5zZXR1cE1hc2sodHJ1ZSk7XG4gICAgaWYgKHRoaXMudGV4dE1hc2tJbnB1dEVsZW1lbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy50ZXh0TWFza0lucHV0RWxlbWVudC51cGRhdGUodGhpcy5pbnB1dEVsZW1lbnQudmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2JsdXInKVxuICBvbkJsdXIoKTogdm9pZCB7XG4gICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc2V0dXBNYXNrKCk7XG5cbiAgICAvLyBzZXQgdGhlIGluaXRpYWwgdmFsdWUgZm9yIGNhc2VzIHdoZXJlIHRoZSBtYXNrIGlzIGRpc2FibGVkXG4gICAgY29uc3Qgbm9ybWFsaXplZFZhbHVlID0gdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWU7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLmlucHV0RWxlbWVudCwgJ3ZhbHVlJywgbm9ybWFsaXplZFZhbHVlKTtcblxuICAgIGlmICh0aGlzLnRleHRNYXNrSW5wdXRFbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMudGV4dE1hc2tJbnB1dEVsZW1lbnQudXBkYXRlKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogYW55KSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eShcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgJ2Rpc2FibGVkJyxcbiAgICAgIGlzRGlzYWJsZWQsXG4gICAgKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2lucHV0JywgWyckZXZlbnQudGFyZ2V0LnZhbHVlJ10pXG4gIGhhbmRsZUlucHV0KHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuY29tcG9zaXRpb25Nb2RlIHx8ICh0aGlzLmNvbXBvc2l0aW9uTW9kZSAmJiAhdGhpcy5jb21wb3NpbmcpKSB7XG4gICAgICB0aGlzLnNldHVwTWFzaygpO1xuXG4gICAgICBpZiAodGhpcy50ZXh0TWFza0lucHV0RWxlbWVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMudGV4dE1hc2tJbnB1dEVsZW1lbnQudXBkYXRlKHZhbHVlKTtcblxuICAgICAgICAvLyBnZXQgdGhlIHVwZGF0ZWQgdmFsdWVcbiAgICAgICAgdmFsdWUgPSB0aGlzLmlucHV0RWxlbWVudC52YWx1ZTtcblxuICAgICAgICBpZiAodGhpcy5jbGVhbikge1xuICAgICAgICAgIHRoaXMub25DaGFuZ2UoY2xlYW4odmFsdWUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9uQ2hhbmdlKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldHVwTWFzayhjcmVhdGUgPSBmYWxzZSk6IHZvaWQge1xuICAgIHRoaXMudGV4dE1hc2tDb25maWcgPSB7XG4gICAgICBtYXNrOiBtYXNrKHRoaXMubWF4TnVtYmVyTGVuZ3RoKSxcbiAgICAgIGd1aWRlOiBmYWxzZSxcbiAgICAgIHBsYWNlaG9sZGVyQ2hhcjogJ18nLFxuICAgICAgcGlwZTogdW5kZWZpbmVkLFxuICAgICAga2VlcENoYXJQb3NpdGlvbnM6IGZhbHNlLFxuICAgIH07XG4gICAgaWYgKCF0aGlzLmlucHV0RWxlbWVudCkge1xuICAgICAgaWYgKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnRhZ05hbWUudG9VcHBlckNhc2UoKSA9PT0gJ0lOUFVUJykge1xuICAgICAgICAvLyBgdGV4dE1hc2tgIGRpcmVjdGl2ZSBpcyB1c2VkIGRpcmVjdGx5IG9uIGFuIGlucHV0IGVsZW1lbnRcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGB0ZXh0TWFza2AgZGlyZWN0aXZlIGlzIHVzZWQgb24gYW4gYWJzdHJhY3RlZCBpbnB1dCBlbGVtZW50LCBgbWQtaW5wdXQtY29udGFpbmVyYCwgZXRjXG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXG4gICAgICAgICAgJ0lOUFVUJyxcbiAgICAgICAgKVswXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5pbnB1dEVsZW1lbnQgJiYgY3JlYXRlKSB7XG4gICAgICB0aGlzLnRleHRNYXNrSW5wdXRFbGVtZW50ID0gY3JlYXRlVGV4dE1hc2tJbnB1dEVsZW1lbnQoXG4gICAgICAgIE9iamVjdC5hc3NpZ24oeyBpbnB1dEVsZW1lbnQ6IHRoaXMuaW5wdXRFbGVtZW50IH0sIHRoaXMudGV4dE1hc2tDb25maWcpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjb21wb3NpdGlvbnN0YXJ0JylcbiAgY29tcG9zaXRpb25TdGFydCgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbXBvc2luZyA9IHRydWU7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjb21wb3NpdGlvbmVuZCcsIFsnJGV2ZW50LnRhcmdldC52YWx1ZSddKVxuICBjb21wb3NpdGlvbkVuZCh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5jb21wb3NpbmcgPSBmYWxzZTtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVudXNlZC1leHByZXNzaW9uXG4gICAgdGhpcy5jb21wb3NpdGlvbk1vZGUgJiYgdGhpcy5oYW5kbGVJbnB1dCh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogV2UgbXVzdCBjaGVjayB3aGV0aGVyIHRoZSBhZ2VudCBpcyBBbmRyb2lkIGJlY2F1c2UgY29tcG9zaXRpb24gZXZlbnRzXG4gICAqIGJlaGF2ZSBkaWZmZXJlbnRseSBiZXR3ZWVuIGlPUyBhbmQgQW5kcm9pZC5cbiAgICovXG4gIHByaXZhdGUgaXNBbmRyb2lkKCk6IGJvb2xlYW4ge1xuICAgIGlmIChcbiAgICAgIGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkgJiZcbiAgICAgIHdpbmRvdyAmJlxuICAgICAgKHdpbmRvdyBhcyBhbnkpLm5hdmlnYXRvclxuICAgICkge1xuICAgICAgY29uc3QgdXNlckFnZW50ID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgICByZXR1cm4gL2FuZHJvaWQgKFxcZCspLy50ZXN0KHVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiJdfQ==