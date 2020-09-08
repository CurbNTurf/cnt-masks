import { ElementRef, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
export declare class TextMaskConfig {
    mask: Array<string | RegExp> | ((raw: string) => Array<string | RegExp>) | false;
    guide?: boolean;
    placeholderChar?: string;
    pipe?: (conformedValue: string, config: TextMaskConfig) => false | string | object;
    keepCharPositions?: boolean;
    showMask?: boolean;
}
export declare class PhoneMaskDirective implements ControlValueAccessor, OnChanges, OnInit {
    private renderer;
    private elementRef;
    private platformId;
    private compositionMode;
    clean: boolean;
    maxNumberLength: number;
    textMaskConfig: TextMaskConfig;
    private textMaskInputElement;
    private inputElement;
    /** Whether the user is creating a composition string (IME events). */
    private composing;
    constructor(renderer: Renderer2, elementRef: ElementRef, platformId: object, compositionMode: boolean);
    onChange: (_: any) => void;
    onTouched: () => void;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    onBlur(): void;
    writeValue(value: any): void;
    registerOnChange(fn: (_: any) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    handleInput(value: string): void;
    setupMask(create?: boolean): void;
    compositionStart(): void;
    compositionEnd(value: any): void;
    /**
     * We must check whether the agent is Android because composition events
     * behave differently between iOS and Android.
     */
    private isAndroid;
}
