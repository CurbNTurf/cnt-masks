import { Pipe } from '@angular/core';
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
CardExpirationPipe.decorators = [
    { type: Pipe, args: [{
                name: 'cardExpiration',
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC1leHBpcmF0aW9uLnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jbnQtbWFza3Mvc3JjL2xpYi9jYy9jYXJkLWV4cGlyYXRpb24ucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUtwRCxNQUFNLE9BQU8sa0JBQWtCO0lBQzdCLFNBQVMsQ0FBQyxLQUFhO1FBQ3JCLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQzdCLEtBQUssR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFDO1NBQ3BCO1FBRUQsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDdEIsS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7U0FDckI7UUFFRCxPQUFPLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzFELENBQUM7OztZQWxCRixJQUFJLFNBQUM7Z0JBQ0osSUFBSSxFQUFFLGdCQUFnQjthQUN2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQFBpcGUoe1xuICBuYW1lOiAnY2FyZEV4cGlyYXRpb24nLFxufSlcbmV4cG9ydCBjbGFzcyBDYXJkRXhwaXJhdGlvblBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgdHJhbnNmb3JtKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlICsgJyc7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUubGVuZ3RoID09PSAzKSB7XG4gICAgICB2YWx1ZSA9IGAwJHt2YWx1ZX1gO1xuICAgIH1cblxuICAgIHJldHVybiBgJHt2YWx1ZS5zdWJzdHJpbmcoMCwgMil9LyR7dmFsdWUuc3Vic3RyaW5nKDIpfWA7XG4gIH1cbn1cbiJdfQ==