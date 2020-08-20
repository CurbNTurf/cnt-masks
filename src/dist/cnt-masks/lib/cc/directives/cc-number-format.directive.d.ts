import { ElementRef, Renderer2 } from '@angular/core';
import * as i0 from "@angular/core";
export declare class CCNumberFormatDirective {
    private renderer;
    private el;
    cardType: string | null;
    constructor(renderer: Renderer2, el: ElementRef);
    onKeypress(e: Event): void;
    static ɵfac: i0.ɵɵFactoryDef<CCNumberFormatDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<CCNumberFormatDirective, "[cntMaskCCNum]", never, {}, {}, never>;
}
