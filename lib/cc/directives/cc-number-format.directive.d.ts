import { ElementRef, Renderer2 } from '@angular/core';
export declare class CCNumberFormatDirective {
    private renderer;
    private el;
    cardType: string | null;
    constructor(renderer: Renderer2, el: ElementRef);
    onKeypress(e: Event): void;
}
