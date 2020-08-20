import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Optional,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import {
  COMPOSITION_BUFFER_MODE,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { createTextMaskInputElement } from 'text-mask-core/dist/textMaskCore';
import { clean, mask } from './utils';

export class TextMaskConfig {
  public mask:
    | Array<string | RegExp>
    | ((raw: string) => Array<string | RegExp>)
    | false;
  public guide?: boolean;
  public placeholderChar?: string;
  public pipe?: (
    conformedValue: string,
    config: TextMaskConfig,
  ) => false | string | object;
  public keepCharPositions?: boolean;
  public showMask?: boolean;
}

// @dynamic
@Directive({
  exportAs: 'cntMaskPhone',
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneMaskDirective),
    },
  ],
  selector: '[cntMaskPhone]',
})
export class PhoneMaskDirective
  implements ControlValueAccessor, OnChanges, OnInit {
  @Input() public clean: boolean = true;
  @Input() public maxNumberLength: number = 13;

  public textMaskConfig: TextMaskConfig;

  private textMaskInputElement: any;
  private inputElement: HTMLInputElement;

  /** Whether the user is creating a composition string (IME events). */
  private composing: boolean = false;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional()
    @Inject(COMPOSITION_BUFFER_MODE)
    private compositionMode: boolean,
  ) {
    if (this.compositionMode == null) {
      this.compositionMode = !this.isAndroid();
    }
  }

  public onChange = (_: any) => {
    // implement
  };

  public onTouched = () => {
    // implement
  };

  ngOnInit(): void {
    this.setupMask(true);
    if (this.textMaskInputElement !== undefined) {
      this.textMaskInputElement.update(this.inputElement.value);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setupMask(true);
    if (this.textMaskInputElement !== undefined) {
      this.textMaskInputElement.update(this.inputElement.value);
    }
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: any): void {
    this.setupMask();

    // set the initial value for cases where the mask is disabled
    const normalizedValue = value == null ? '' : value;
    this.renderer.setProperty(this.inputElement, 'value', normalizedValue);

    if (this.textMaskInputElement !== undefined) {
      this.textMaskInputElement.update(value);
    }
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'disabled',
      isDisabled,
    );
  }

  @HostListener('input', ['$event.target.value'])
  handleInput(value: string): void {
    if (!this.compositionMode || (this.compositionMode && !this.composing)) {
      this.setupMask();

      if (this.textMaskInputElement !== undefined) {
        this.textMaskInputElement.update(value);

        // get the updated value
        value = this.inputElement.value;

        if (this.clean) {
          this.onChange(clean(value));
        } else {
          this.onChange(value);
        }
      }
    }
  }

  setupMask(create: boolean = false): void {
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
      } else {
        // `textMask` directive is used on an abstracted input element, `md-input-container`, etc
        this.inputElement = this.elementRef.nativeElement.getElementsByTagName(
          'INPUT',
        )[0];
      }
    }

    if (this.inputElement && create) {
      this.textMaskInputElement = createTextMaskInputElement(
        Object.assign({ inputElement: this.inputElement }, this.textMaskConfig),
      );
    }
  }

  @HostListener('compositionstart')
  compositionStart(): void {
    this.composing = true;
  }

  @HostListener('compositionend', ['$event.target.value'])
  compositionEnd(value: any): void {
    this.composing = false;
    // tslint:disable-next-line: no-unused-expression
    this.compositionMode && this.handleInput(value);
  }

  /**
   * We must check whether the agent is Android because composition events
   * behave differently between iOS and Android.
   */
  private isAndroid(): boolean {
    if (
      isPlatformBrowser(this.platformId) &&
      window &&
      (window as any).navigator
    ) {
      const userAgent = window.navigator.userAgent;
      return /android (\d+)/.test(userAgent.toLowerCase());
    }

    return false;
  }
}
