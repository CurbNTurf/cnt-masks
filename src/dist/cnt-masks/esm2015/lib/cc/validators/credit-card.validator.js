import { Payment } from '../payment';
export class CreditCardValidator {
    /**
     * Validates a cc number
     */
    static validateCardNumber(control) {
        if (control) {
            const isValid = Payment.fns.validateCardNumber(control.value);
            if (!isValid) {
                return {
                    cardNumber: true,
                };
            }
        }
        return null;
    }
    /**
     * Validates the expiry date.
     * Breaks exp by "/" string and assumes that first array entry is month and second year
     * Also removes any spaces
     */
    static validateCardExpiry(control) {
        if (control) {
            const controlValue = control.value.split('/');
            let isValid = false;
            if (controlValue.length > 1) {
                const month = controlValue[0].replace(/^\s+|\s+$/g, '');
                const year = controlValue[1].replace(/^\s+|\s+$/g, '');
                isValid = Payment.fns.validateCardExpiry(month, year);
            }
            if (!isValid) {
                return {
                    cardExpiry: true,
                };
            }
        }
        return null;
    }
    /**
     * Validates cards CVC
     * Also removes any spaces
     */
    static validateCardCvc(control) {
        if (control) {
            const isValid = Payment.fns.validateCardCVC(control.value);
            if (!isValid) {
                return {
                    cardCvc: true,
                };
            }
        }
        return null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlZGl0LWNhcmQudmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY250LW1hc2tzL3NyYy9saWIvY2MvdmFsaWRhdG9ycy9jcmVkaXQtY2FyZC52YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUVyQyxNQUFNLE9BQU8sbUJBQW1CO0lBQzlCOztPQUVHO0lBQ0gsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQW9CO1FBQzVDLElBQUksT0FBTyxFQUFFO1lBQ1gsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFOUQsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDWixPQUFPO29CQUNMLFVBQVUsRUFBRSxJQUFJO2lCQUNqQixDQUFDO2FBQ0g7U0FDRjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBb0I7UUFDNUMsSUFBSSxPQUFPLEVBQUU7WUFDWCxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM5QyxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFFcEIsSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDM0IsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ3hELE1BQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUV2RCxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDdkQ7WUFFRCxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNaLE9BQU87b0JBQ0wsVUFBVSxFQUFFLElBQUk7aUJBQ2pCLENBQUM7YUFDSDtTQUNGO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFvQjtRQUN6QyxJQUFJLE9BQU8sRUFBRTtZQUNYLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUUzRCxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNaLE9BQU87b0JBQ0wsT0FBTyxFQUFFLElBQUk7aUJBQ2QsQ0FBQzthQUNIO1NBQ0Y7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZvcm1Db250cm9sLCBWYWxpZGF0aW9uRXJyb3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgUGF5bWVudCB9IGZyb20gJy4uL3BheW1lbnQnO1xuXG5leHBvcnQgY2xhc3MgQ3JlZGl0Q2FyZFZhbGlkYXRvciB7XG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgYSBjYyBudW1iZXJcbiAgICovXG4gIHN0YXRpYyB2YWxpZGF0ZUNhcmROdW1iZXIoY29udHJvbDogRm9ybUNvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHtcbiAgICBpZiAoY29udHJvbCkge1xuICAgICAgY29uc3QgaXNWYWxpZCA9IFBheW1lbnQuZm5zLnZhbGlkYXRlQ2FyZE51bWJlcihjb250cm9sLnZhbHVlKTtcblxuICAgICAgaWYgKCFpc1ZhbGlkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY2FyZE51bWJlcjogdHJ1ZSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgdGhlIGV4cGlyeSBkYXRlLlxuICAgKiBCcmVha3MgZXhwIGJ5IFwiL1wiIHN0cmluZyBhbmQgYXNzdW1lcyB0aGF0IGZpcnN0IGFycmF5IGVudHJ5IGlzIG1vbnRoIGFuZCBzZWNvbmQgeWVhclxuICAgKiBBbHNvIHJlbW92ZXMgYW55IHNwYWNlc1xuICAgKi9cbiAgc3RhdGljIHZhbGlkYXRlQ2FyZEV4cGlyeShjb250cm9sOiBGb3JtQ29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMge1xuICAgIGlmIChjb250cm9sKSB7XG4gICAgICBjb25zdCBjb250cm9sVmFsdWUgPSBjb250cm9sLnZhbHVlLnNwbGl0KCcvJyk7XG4gICAgICBsZXQgaXNWYWxpZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoY29udHJvbFZhbHVlLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgY29uc3QgbW9udGggPSBjb250cm9sVmFsdWVbMF0ucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xuICAgICAgICBjb25zdCB5ZWFyID0gY29udHJvbFZhbHVlWzFdLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcblxuICAgICAgICBpc1ZhbGlkID0gUGF5bWVudC5mbnMudmFsaWRhdGVDYXJkRXhwaXJ5KG1vbnRoLCB5ZWFyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc1ZhbGlkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY2FyZEV4cGlyeTogdHJ1ZSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgY2FyZHMgQ1ZDXG4gICAqIEFsc28gcmVtb3ZlcyBhbnkgc3BhY2VzXG4gICAqL1xuICBzdGF0aWMgdmFsaWRhdGVDYXJkQ3ZjKGNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB7XG4gICAgaWYgKGNvbnRyb2wpIHtcbiAgICAgIGNvbnN0IGlzVmFsaWQgPSBQYXltZW50LmZucy52YWxpZGF0ZUNhcmRDVkMoY29udHJvbC52YWx1ZSk7XG5cbiAgICAgIGlmICghaXNWYWxpZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNhcmRDdmM6IHRydWUsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiJdfQ==