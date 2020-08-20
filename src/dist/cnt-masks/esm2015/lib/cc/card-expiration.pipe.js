import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class CardExpirationPipe {
    transform(value) {
        if (typeof value !== 'number') {
            value = value + '';
        }
        if (typeof value !== 'string') {
            return value;
        }
        if (value.length === 3) {
            value = `0${value}`;
        }
        return `${value.substring(0, 2)}/${value.substring(2)}`;
    }
}
CardExpirationPipe.ɵfac = function CardExpirationPipe_Factory(t) { return new (t || CardExpirationPipe)(); };
CardExpirationPipe.ɵpipe = i0.ɵɵdefinePipe({ name: "cardExpiration", type: CardExpirationPipe, pure: true });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(CardExpirationPipe, [{
        type: Pipe,
        args: [{
                name: 'cardExpiration',
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC1leHBpcmF0aW9uLnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jbnQtbWFza3Mvc3JjL2xpYi9jYy9jYXJkLWV4cGlyYXRpb24ucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQzs7QUFLcEQsTUFBTSxPQUFPLGtCQUFrQjtJQUM3QixTQUFTLENBQUMsS0FBYTtRQUNyQixJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUM3QixLQUFLLEdBQUcsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUNwQjtRQUVELElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQzdCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3RCLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1NBQ3JCO1FBRUQsT0FBTyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUMxRCxDQUFDOztvRkFmVSxrQkFBa0I7MkVBQWxCLGtCQUFrQjtrREFBbEIsa0JBQWtCO2NBSDlCLElBQUk7ZUFBQztnQkFDSixJQUFJLEVBQUUsZ0JBQWdCO2FBQ3ZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AUGlwZSh7XG4gIG5hbWU6ICdjYXJkRXhwaXJhdGlvbicsXG59KVxuZXhwb3J0IGNsYXNzIENhcmRFeHBpcmF0aW9uUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0odmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUgKyAnJztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDMpIHtcbiAgICAgIHZhbHVlID0gYDAke3ZhbHVlfWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGAke3ZhbHVlLnN1YnN0cmluZygwLCAyKX0vJHt2YWx1ZS5zdWJzdHJpbmcoMil9YDtcbiAgfVxufVxuIl19