import { Directive, ElementRef, forwardRef, Inject, Input, NgModule, Optional, Renderer2, } from '@angular/core';
import { COMPOSITION_BUFFER_MODE, NG_VALUE_ACCESSOR, } from '@angular/forms';
import { ɵgetDOM as getDOM } from '@angular/platform-browser';
import { createTextMaskInputElement } from './mask/create-text-mask-input-element.function';
export class TextMaskConfig {
}
export const MASKEDINPUT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MaskedInputDirective),
    multi: true,
};
/**
 * We must check whether the agent is Android because composition events
 * behave differently between iOS and Android.
 */
function _isAndroid() {
    const userAgent = getDOM() ? getDOM().getUserAgent() : '';
    return /android (\d+)/.test(userAgent.toLowerCase());
}
export class MaskedInputDirective {
    constructor(_renderer, _elementRef, _compositionMode) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._compositionMode = _compositionMode;
        this.textMaskConfig = {
            mask: [],
            guide: true,
            placeholderChar: '_',
            pipe: undefined,
            keepCharPositions: false,
        };
        /** Whether the user is creating a composition string (IME events). */
        this._composing = false;
        this.onChange = (_) => {
            // noop
        };
        this.onTouched = () => {
            // noop
        };
        if (this._compositionMode == null) {
            this._compositionMode = !_isAndroid();
        }
    }
    ngOnChanges(changes) {
        this._setupMask(true);
        if (this.textMaskInputElement !== undefined) {
            this.textMaskInputElement.update(this.inputElement.value);
        }
    }
    writeValue(value) {
        this._setupMask();
        // set the initial value for cases where the mask is disabled
        const normalizedValue = value == null ? '' : value;
        this._renderer.setProperty(this.inputElement, 'value', normalizedValue);
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
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
    _handleInput(value) {
        if (!this._compositionMode || (this._compositionMode && !this._composing)) {
            this._setupMask();
            if (this.textMaskInputElement !== undefined) {
                this.textMaskInputElement.update(value);
                // get the updated value
                value = this.inputElement.value;
                this.onChange(value);
            }
        }
    }
    _setupMask(create = false) {
        if (!this.inputElement) {
            if (this._elementRef.nativeElement.tagName.toUpperCase() === 'INPUT') {
                // `textMask` directive is used directly on an input element
                this.inputElement = this._elementRef.nativeElement;
            }
            else {
                // `textMask` directive is used on an abstracted input element, `md-input-container`, etc
                this.inputElement = this._elementRef.nativeElement.getElementsByTagName('INPUT')[0];
            }
        }
        if (this.inputElement && create) {
            this.textMaskInputElement = createTextMaskInputElement(Object.assign({ inputElement: this.inputElement }, this.textMaskConfig));
        }
    }
    _compositionStart() {
        this._composing = true;
    }
    _compositionEnd(value) {
        this._composing = false;
        if (this._compositionMode) {
            this._handleInput(value);
        }
    }
}
MaskedInputDirective.decorators = [
    { type: Directive, args: [{
                host: {
                    '(input)': '_handleInput($event.target.value)',
                    '(blur)': 'onTouched()',
                    '(compositionstart)': '_compositionStart()',
                    '(compositionend)': '_compositionEnd($event.target.value)',
                },
                selector: '[textMask]',
                exportAs: 'textMask',
                providers: [MASKEDINPUT_VALUE_ACCESSOR],
            },] }
];
MaskedInputDirective.ctorParameters = () => [
    { type: Renderer2 },
    { type: ElementRef },
    { type: Boolean, decorators: [{ type: Optional }, { type: Inject, args: [COMPOSITION_BUFFER_MODE,] }] }
];
MaskedInputDirective.propDecorators = {
    textMaskConfig: [{ type: Input, args: ['textMask',] }]
};
export class TextMaskModule {
}
TextMaskModule.decorators = [
    { type: NgModule, args: [{
                declarations: [MaskedInputDirective],
                exports: [MaskedInputDirective],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci0yLXRleHQtbWFzay5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9jbnQtbWFza3Mvc3JjL2xpYi9hbmd1bGFyLTItdGV4dC1tYXNrLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxRQUFRLEVBRVIsUUFBUSxFQUVSLFNBQVMsR0FFVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsdUJBQXVCLEVBRXZCLGlCQUFpQixHQUNsQixNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFBRSxPQUFPLElBQUksTUFBTSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDOUQsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFFNUYsTUFBTSxPQUFPLGNBQWM7Q0FhMUI7QUFFRCxNQUFNLENBQUMsTUFBTSwwQkFBMEIsR0FBYTtJQUNsRCxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsb0JBQW9CLENBQUM7SUFDbkQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUY7OztHQUdHO0FBQ0gsU0FBUyxVQUFVO0lBQ2pCLE1BQU0sU0FBUyxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzFELE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBYUQsTUFBTSxPQUFPLG9CQUFvQjtJQWUvQixZQUNVLFNBQW9CLEVBQ3BCLFdBQXVCLEVBR3ZCLGdCQUF5QjtRQUp6QixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3BCLGdC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QUFDLG9CQUFvQixDQUFDO2dCQUNwQyxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQzthQUNoQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdNb2R1bGUsXG4gIE9uQ2hhbmdlcyxcbiAgT3B0aW9uYWwsXG4gIFByb3ZpZGVyLFxuICBSZW5kZXJlcjIsXG4gIFNpbXBsZUNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ09NUE9TSVRJT05fQlVGRkVSX01PREUsXG4gIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICBOR19WQUxVRV9BQ0NFU1NPUixcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgybVnZXRET00gYXMgZ2V0RE9NIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBjcmVhdGVUZXh0TWFza0lucHV0RWxlbWVudCB9IGZyb20gJy4vbWFzay9jcmVhdGUtdGV4dC1tYXNrLWlucHV0LWVsZW1lbnQuZnVuY3Rpb24nO1xuXG5leHBvcnQgY2xhc3MgVGV4dE1hc2tDb25maWcge1xuICBtYXNrOlxuICAgIHwgQXJyYXk8c3RyaW5nIHwgUmVnRXhwPlxuICAgIHwgKChyYXc6IHN0cmluZykgPT4gQXJyYXk8c3RyaW5nIHwgUmVnRXhwPilcbiAgICB8IGZhbHNlO1xuICBndWlkZT86IGJvb2xlYW47XG4gIHBsYWNlaG9sZGVyQ2hhcj86IHN0cmluZztcbiAgcGlwZT86IChcbiAgICBjb25mb3JtZWRWYWx1ZTogc3RyaW5nLFxuICAgIGNvbmZpZzogVGV4dE1hc2tDb25maWcsXG4gICkgPT4gZmFsc2UgfCBzdHJpbmcgfCBvYmplY3Q7XG4gIGtlZXBDaGFyUG9zaXRpb25zPzogYm9vbGVhbjtcbiAgc2hvd01hc2s/OiBib29sZWFuO1xufVxuXG5leHBvcnQgY29uc3QgTUFTS0VESU5QVVRfVkFMVUVfQUNDRVNTT1I6IFByb3ZpZGVyID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWFza2VkSW5wdXREaXJlY3RpdmUpLFxuICBtdWx0aTogdHJ1ZSxcbn07XG5cbi8qKlxuICogV2UgbXVzdCBjaGVjayB3aGV0aGVyIHRoZSBhZ2VudCBpcyBBbmRyb2lkIGJlY2F1c2UgY29tcG9zaXRpb24gZXZlbnRzXG4gKiBiZWhhdmUgZGlmZmVyZW50bHkgYmV0d2VlbiBpT1MgYW5kIEFuZHJvaWQuXG4gKi9cbmZ1bmN0aW9uIF9pc0FuZHJvaWQoKTogYm9vbGVhbiB7XG4gIGNvbnN0IHVzZXJBZ2VudCA9IGdldERPTSgpID8gZ2V0RE9NKCkuZ2V0VXNlckFnZW50KCkgOiAnJztcbiAgcmV0dXJuIC9hbmRyb2lkIChcXGQrKS8udGVzdCh1c2VyQWdlbnQudG9Mb3dlckNhc2UoKSk7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBob3N0OiB7XG4gICAgJyhpbnB1dCknOiAnX2hhbmRsZUlucHV0KCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGJsdXIpJzogJ29uVG91Y2hlZCgpJyxcbiAgICAnKGNvbXBvc2l0aW9uc3RhcnQpJzogJ19jb21wb3NpdGlvblN0YXJ0KCknLFxuICAgICcoY29tcG9zaXRpb25lbmQpJzogJ19jb21wb3NpdGlvbkVuZCgkZXZlbnQudGFyZ2V0LnZhbHVlKScsXG4gIH0sXG4gIHNlbGVjdG9yOiAnW3RleHRNYXNrXScsXG4gIGV4cG9ydEFzOiAndGV4dE1hc2snLFxuICBwcm92aWRlcnM6IFtNQVNLRURJTlBVVF9WQUxVRV9BQ0NFU1NPUl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hc2tlZElucHV0RGlyZWN0aXZlIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgndGV4dE1hc2snKSB0ZXh0TWFza0NvbmZpZzogVGV4dE1hc2tDb25maWcgPSB7XG4gICAgbWFzazogW10sXG4gICAgZ3VpZGU6IHRydWUsXG4gICAgcGxhY2Vob2xkZXJDaGFyOiAnXycsXG4gICAgcGlwZTogdW5kZWZpbmVkLFxuICAgIGtlZXBDaGFyUG9zaXRpb25zOiBmYWxzZSxcbiAgfTtcblxuICBwcml2YXRlIHRleHRNYXNrSW5wdXRFbGVtZW50OiBhbnk7XG4gIHByaXZhdGUgaW5wdXRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB1c2VyIGlzIGNyZWF0aW5nIGEgY29tcG9zaXRpb24gc3RyaW5nIChJTUUgZXZlbnRzKS4gKi9cbiAgcHJpdmF0ZSBfY29tcG9zaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChDT01QT1NJVElPTl9CVUZGRVJfTU9ERSlcbiAgICBwcml2YXRlIF9jb21wb3NpdGlvbk1vZGU6IGJvb2xlYW4sXG4gICkge1xuICAgIGlmICh0aGlzLl9jb21wb3NpdGlvbk1vZGUgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fY29tcG9zaXRpb25Nb2RlID0gIV9pc0FuZHJvaWQoKTtcbiAgICB9XG4gIH1cblxuICBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHtcbiAgICAvLyBub29wXG4gIH07XG4gIG9uVG91Y2hlZCA9ICgpID0+IHtcbiAgICAvLyBub29wXG4gIH07XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIHRoaXMuX3NldHVwTWFzayh0cnVlKTtcbiAgICBpZiAodGhpcy50ZXh0TWFza0lucHV0RWxlbWVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnRleHRNYXNrSW5wdXRFbGVtZW50LnVwZGF0ZSh0aGlzLmlucHV0RWxlbWVudC52YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fc2V0dXBNYXNrKCk7XG5cbiAgICAvLyBzZXQgdGhlIGluaXRpYWwgdmFsdWUgZm9yIGNhc2VzIHdoZXJlIHRoZSBtYXNrIGlzIGRpc2FibGVkXG4gICAgY29uc3Qgbm9ybWFsaXplZFZhbHVlID0gdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWU7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5pbnB1dEVsZW1lbnQsICd2YWx1ZScsIG5vcm1hbGl6ZWRWYWx1ZSk7XG5cbiAgICBpZiAodGhpcy50ZXh0TWFza0lucHV0RWxlbWVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnRleHRNYXNrSW5wdXRFbGVtZW50LnVwZGF0ZSh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKF86IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcbiAgfVxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eShcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCxcbiAgICAgICdkaXNhYmxlZCcsXG4gICAgICBpc0Rpc2FibGVkLFxuICAgICk7XG4gIH1cblxuICBfaGFuZGxlSW5wdXQodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fY29tcG9zaXRpb25Nb2RlIHx8ICh0aGlzLl9jb21wb3NpdGlvbk1vZGUgJiYgIXRoaXMuX2NvbXBvc2luZykpIHtcbiAgICAgIHRoaXMuX3NldHVwTWFzaygpO1xuXG4gICAgICBpZiAodGhpcy50ZXh0TWFza0lucHV0RWxlbWVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMudGV4dE1hc2tJbnB1dEVsZW1lbnQudXBkYXRlKHZhbHVlKTtcblxuICAgICAgICAvLyBnZXQgdGhlIHVwZGF0ZWQgdmFsdWVcbiAgICAgICAgdmFsdWUgPSB0aGlzLmlucHV0RWxlbWVudC52YWx1ZTtcbiAgICAgICAgdGhpcy5vbkNoYW5nZSh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX3NldHVwTWFzayhjcmVhdGU6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pbnB1dEVsZW1lbnQpIHtcbiAgICAgIGlmICh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudGFnTmFtZS50b1VwcGVyQ2FzZSgpID09PSAnSU5QVVQnKSB7XG4gICAgICAgIC8vIGB0ZXh0TWFza2AgZGlyZWN0aXZlIGlzIHVzZWQgZGlyZWN0bHkgb24gYW4gaW5wdXQgZWxlbWVudFxuICAgICAgICB0aGlzLmlucHV0RWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGB0ZXh0TWFza2AgZGlyZWN0aXZlIGlzIHVzZWQgb24gYW4gYWJzdHJhY3RlZCBpbnB1dCBlbGVtZW50LCBgbWQtaW5wdXQtY29udGFpbmVyYCwgZXRjXG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFxuICAgICAgICAgICdJTlBVVCcsXG4gICAgICAgIClbMF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaW5wdXRFbGVtZW50ICYmIGNyZWF0ZSkge1xuICAgICAgdGhpcy50ZXh0TWFza0lucHV0RWxlbWVudCA9IGNyZWF0ZVRleHRNYXNrSW5wdXRFbGVtZW50KFxuICAgICAgICBPYmplY3QuYXNzaWduKHsgaW5wdXRFbGVtZW50OiB0aGlzLmlucHV0RWxlbWVudCB9LCB0aGlzLnRleHRNYXNrQ29uZmlnKSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgX2NvbXBvc2l0aW9uU3RhcnQoKTogdm9pZCB7XG4gICAgdGhpcy5fY29tcG9zaW5nID0gdHJ1ZTtcbiAgfVxuXG4gIF9jb21wb3NpdGlvbkVuZCh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fY29tcG9zaW5nID0gZmFsc2U7XG4gICAgaWYgKHRoaXMuX2NvbXBvc2l0aW9uTW9kZSkge1xuICAgICAgdGhpcy5faGFuZGxlSW5wdXQodmFsdWUpO1xuICAgIH1cbiAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtNYXNrZWRJbnB1dERpcmVjdGl2ZV0sXG4gIGV4cG9ydHM6IFtNYXNrZWRJbnB1dERpcmVjdGl2ZV0sXG59KVxuZXhwb3J0IGNsYXNzIFRleHRNYXNrTW9kdWxlIHt9XG4iXX0=