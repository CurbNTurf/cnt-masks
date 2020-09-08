import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, forwardRef, HostListener, Inject, Input, Optional, PLATFORM_ID, Renderer2, } from '@angular/core';
import { COMPOSITION_BUFFER_MODE, NG_VALUE_ACCESSOR, } from '@angular/forms';
import { createTextMaskInputElement } from '../mask/create-text-mask-input-element.function';
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
                exportAs: 'cntMaskPhone',
                providers: [
                    {
                        multi: true,
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => PhoneMaskDirective),
                    },
                ],
                selector: '[cntMaskPhone]',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhvbmUtbWFzay5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jbnQtbWFza3Mvc3JjL2xpYi9waG9uZS9waG9uZS1tYXNrLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBR0wsUUFBUSxFQUNSLFdBQVcsRUFDWCxTQUFTLEdBRVYsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLHVCQUF1QixFQUV2QixpQkFBaUIsR0FDbEIsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUM3RixPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUV0QyxNQUFNLE9BQU8sY0FBYztDQWExQjtBQUVELFdBQVc7QUFZWCxNQUFNLE9BQU8sa0JBQWtCO0lBYTdCLFlBQ1UsUUFBbUIsRUFDbkIsVUFBc0IsRUFDRCxVQUFrQixFQUd2QyxlQUF3QjtRQUx4QixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDRCxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBR3ZDLG9CQUFlLEdBQWYsZUFBZSxDQUFTO1FBakJsQixVQUFLLEdBQVksSUFBSSxDQUFDO1FBQ3RCLG9CQUFlLEdBQVcsRUFBRSxDQUFDO1FBTzdDLHNFQUFzRTtRQUM5RCxjQUFTLEdBQVksS0FBSyxDQUFDO1FBZTVCLGFBQVEsR0FBRyxDQUFDLENBQU0sRUFBRSxFQUFFO1lBQzNCLFlBQVk7UUFDZCxDQUFDLENBQUM7UUFFSyxjQUFTLEdBQUcsR0FBRyxFQUFFO1lBQ3RCLFlBQVk7UUFD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LFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1NBQ3REO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDOzs7WUF0S0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUN4QixTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsS0FBSyxFQUFFLElBQUk7d0JBQ1gsT0FBTyxFQUFFLGlCQUFpQjt3QkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztxQkFDbEQ7aUJBQ0Y7Z0JBQ0QsUUFBUSxFQUFFLGdCQUFnQjthQUMzQjs7O1lBckNDLFNBQVM7WUFUVCxVQUFVO3lDQStEUCxNQUFNLFNBQUMsV0FBVzswQ0FDbEIsUUFBUSxZQUNSLE1BQU0sU0FBQyx1QkFBdUI7OztvQkFoQmhDLEtBQUs7OEJBQ0wsS0FBSztxQkE2Q0wsWUFBWSxTQUFDLE1BQU07MEJBaUNuQixZQUFZLFNBQUMsT0FBTyxFQUFFLENBQUMscUJBQXFCLENBQUM7K0JBK0M3QyxZQUFZLFNBQUMsa0JBQWtCOzZCQUsvQixZQUFZLFNBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgZm9yd2FyZFJlZixcbiAgSG9zdExpc3RlbmVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFBMQVRGT1JNX0lELFxuICBSZW5kZXJlcjIsXG4gIFNpbXBsZUNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ09NUE9TSVRJT05fQlVGRkVSX01PREUsXG4gIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICBOR19WQUxVRV9BQ0NFU1NPUixcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgY3JlYXRlVGV4dE1hc2tJbnB1dEVsZW1lbnQgfSBmcm9tICcuLi9tYXNrL2NyZWF0ZS10ZXh0LW1hc2staW5wdXQtZWxlbWVudC5mdW5jdGlvbic7XG5pbXBvcnQgeyBjbGVhbiwgbWFzayB9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgY2xhc3MgVGV4dE1hc2tDb25maWcge1xuICBwdWJsaWMgbWFzazpcbiAgICB8IEFycmF5PHN0cmluZyB8IFJlZ0V4cD5cbiAgICB8ICgocmF3OiBzdHJpbmcpID0+IEFycmF5PHN0cmluZyB8IFJlZ0V4cD4pXG4gICAgfCBmYWxzZTtcbiAgcHVibGljIGd1aWRlPzogYm9vbGVhbjtcbiAgcHVibGljIHBsYWNlaG9sZGVyQ2hhcj86IHN0cmluZztcbiAgcHVibGljIHBpcGU/OiAoXG4gICAgY29uZm9ybWVkVmFsdWU6IHN0cmluZyxcbiAgICBjb25maWc6IFRleHRNYXNrQ29uZmlnLFxuICApID0+IGZhbHNlIHwgc3RyaW5nIHwgb2JqZWN0O1xuICBwdWJsaWMga2VlcENoYXJQb3NpdGlvbnM/OiBib29sZWFuO1xuICBwdWJsaWMgc2hvd01hc2s/OiBib29sZWFuO1xufVxuXG4vLyBAZHluYW1pY1xuQERpcmVjdGl2ZSh7XG4gIGV4cG9ydEFzOiAnY250TWFza1Bob25lJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgbXVsdGk6IHRydWUsXG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFBob25lTWFza0RpcmVjdGl2ZSksXG4gICAgfSxcbiAgXSxcbiAgc2VsZWN0b3I6ICdbY250TWFza1Bob25lXScsXG59KVxuZXhwb3J0IGNsYXNzIFBob25lTWFza0RpcmVjdGl2ZVxuICBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkNoYW5nZXMsIE9uSW5pdCB7XG4gIEBJbnB1dCgpIHB1YmxpYyBjbGVhbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIHB1YmxpYyBtYXhOdW1iZXJMZW5ndGg6IG51bWJlciA9IDEzO1xuXG4gIHB1YmxpYyB0ZXh0TWFza0NvbmZpZzogVGV4dE1hc2tDb25maWc7XG5cbiAgcHJpdmF0ZSB0ZXh0TWFza0lucHV0RWxlbWVudDogYW55O1xuICBwcml2YXRlIGlucHV0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcblxuICAvKiogV2hldGhlciB0aGUgdXNlciBpcyBjcmVhdGluZyBhIGNvbXBvc2l0aW9uIHN0cmluZyAoSU1FIGV2ZW50cykuICovXG4gIHByaXZhdGUgY29tcG9zaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IG9iamVjdCxcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoQ09NUE9TSVRJT05fQlVGRkVSX01PREUpXG4gICAgcHJpdmF0ZSBjb21wb3NpdGlvbk1vZGU6IGJvb2xlYW4sXG4gICkge1xuICAgIGlmICh0aGlzLmNvbXBvc2l0aW9uTW9kZSA9PSBudWxsKSB7XG4gICAgICB0aGlzLmNvbXBvc2l0aW9uTW9kZSA9ICF0aGlzLmlzQW5kcm9pZCgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHtcbiAgICAvLyBpbXBsZW1lbnRcbiAgfTtcblxuICBwdWJsaWMgb25Ub3VjaGVkID0gKCkgPT4ge1xuICAgIC8vIGltcGxlbWVudFxuICB9O1xuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuc2V0dXBNYXNrKHRydWUpO1xuICAgIGlmICh0aGlzLnRleHRNYXNrSW5wdXRFbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMudGV4dE1hc2tJbnB1dEVsZW1lbnQudXBkYXRlKHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgdGhpcy5zZXR1cE1hc2sodHJ1ZSk7XG4gICAgaWYgKHRoaXMudGV4dE1hc2tJbnB1dEVsZW1lbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy50ZXh0TWFza0lucHV0RWxlbWVudC51cGRhdGUodGhpcy5pbnB1dEVsZW1lbnQudmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2JsdXInKVxuICBvbkJsdXIoKTogdm9pZCB7XG4gICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc2V0dXBNYXNrKCk7XG5cbiAgICAvLyBzZXQgdGhlIGluaXRpYWwgdmFsdWUgZm9yIGNhc2VzIHdoZXJlIHRoZSBtYXNrIGlzIGRpc2FibGVkXG4gICAgY29uc3Qgbm9ybWFsaXplZFZhbHVlID0gdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWU7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLmlucHV0RWxlbWVudCwgJ3ZhbHVlJywgbm9ybWFsaXplZFZhbHVlKTtcblxuICAgIGlmICh0aGlzLnRleHRNYXNrSW5wdXRFbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMudGV4dE1hc2tJbnB1dEVsZW1lbnQudXBkYXRlKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogYW55KSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eShcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgJ2Rpc2FibGVkJyxcbiAgICAgIGlzRGlzYWJsZWQsXG4gICAgKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2lucHV0JywgWyckZXZlbnQudGFyZ2V0LnZhbHVlJ10pXG4gIGhhbmRsZUlucHV0KHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuY29tcG9zaXRpb25Nb2RlIHx8ICh0aGlzLmNvbXBvc2l0aW9uTW9kZSAmJiAhdGhpcy5jb21wb3NpbmcpKSB7XG4gICAgICB0aGlzLnNldHVwTWFzaygpO1xuXG4gICAgICBpZiAodGhpcy50ZXh0TWFza0lucHV0RWxlbWVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMudGV4dE1hc2tJbnB1dEVsZW1lbnQudXBkYXRlKHZhbHVlKTtcblxuICAgICAgICAvLyBnZXQgdGhlIHVwZGF0ZWQgdmFsdWVcbiAgICAgICAgdmFsdWUgPSB0aGlzLmlucHV0RWxlbWVudC52YWx1ZTtcblxuICAgICAgICBpZiAodGhpcy5jbGVhbikge1xuICAgICAgICAgIHRoaXMub25DaGFuZ2UoY2xlYW4odmFsdWUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9uQ2hhbmdlKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldHVwTWFzayhjcmVhdGU6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuICAgIHRoaXMudGV4dE1hc2tDb25maWcgPSB7XG4gICAgICBtYXNrOiBtYXNrKHRoaXMubWF4TnVtYmVyTGVuZ3RoKSxcbiAgICAgIGd1aWRlOiBmYWxzZSxcbiAgICAgIHBsYWNlaG9sZGVyQ2hhcjogJ18nLFxuICAgICAgcGlwZTogdW5kZWZpbmVkLFxuICAgICAga2VlcENoYXJQb3NpdGlvbnM6IGZhbHNlLFxuICAgIH07XG4gICAgaWYgKCF0aGlzLmlucHV0RWxlbWVudCkge1xuICAgICAgaWYgKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnRhZ05hbWUudG9VcHBlckNhc2UoKSA9PT0gJ0lOUFVUJykge1xuICAgICAgICAvLyBgdGV4dE1hc2tgIGRpcmVjdGl2ZSBpcyB1c2VkIGRpcmVjdGx5IG9uIGFuIGlucHV0IGVsZW1lbnRcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGB0ZXh0TWFza2AgZGlyZWN0aXZlIGlzIHVzZWQgb24gYW4gYWJzdHJhY3RlZCBpbnB1dCBlbGVtZW50LCBgbWQtaW5wdXQtY29udGFpbmVyYCwgZXRjXG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXG4gICAgICAgICAgJ0lOUFVUJyxcbiAgICAgICAgKVswXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5pbnB1dEVsZW1lbnQgJiYgY3JlYXRlKSB7XG4gICAgICB0aGlzLnRleHRNYXNrSW5wdXRFbGVtZW50ID0gY3JlYXRlVGV4dE1hc2tJbnB1dEVsZW1lbnQoXG4gICAgICAgIE9iamVjdC5hc3NpZ24oeyBpbnB1dEVsZW1lbnQ6IHRoaXMuaW5wdXRFbGVtZW50IH0sIHRoaXMudGV4dE1hc2tDb25maWcpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjb21wb3NpdGlvbnN0YXJ0JylcbiAgY29tcG9zaXRpb25TdGFydCgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbXBvc2luZyA9IHRydWU7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjb21wb3NpdGlvbmVuZCcsIFsnJGV2ZW50LnRhcmdldC52YWx1ZSddKVxuICBjb21wb3NpdGlvbkVuZCh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5jb21wb3NpbmcgPSBmYWxzZTtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVudXNlZC1leHByZXNzaW9uXG4gICAgdGhpcy5jb21wb3NpdGlvbk1vZGUgJiYgdGhpcy5oYW5kbGVJbnB1dCh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogV2UgbXVzdCBjaGVjayB3aGV0aGVyIHRoZSBhZ2VudCBpcyBBbmRyb2lkIGJlY2F1c2UgY29tcG9zaXRpb24gZXZlbnRzXG4gICAqIGJlaGF2ZSBkaWZmZXJlbnRseSBiZXR3ZWVuIGlPUyBhbmQgQW5kcm9pZC5cbiAgICovXG4gIHByaXZhdGUgaXNBbmRyb2lkKCk6IGJvb2xlYW4ge1xuICAgIGlmIChcbiAgICAgIGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkgJiZcbiAgICAgIHdpbmRvdyAmJlxuICAgICAgKHdpbmRvdyBhcyBhbnkpLm5hdmlnYXRvclxuICAgICkge1xuICAgICAgY29uc3QgdXNlckFnZW50ID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgICByZXR1cm4gL2FuZHJvaWQgKFxcZCspLy50ZXN0KHVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiJdfQ==