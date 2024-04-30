import { AbstractControl } from '@angular/forms';
export class PasswordValidation {

    static MatchPassword(AC: AbstractControl) {
        const password = AC.get('password').value;
        if (AC.get('password_confirmation').touched || AC.get('password_confirmation').dirty) {
            const verifyPassword = AC.get('password_confirmation').value;

            if (password != verifyPassword) {
                AC.get('password_confirmation').setErrors({ MatchPassword: true });
            } else {
                return null;
            }
        }
    }

    static MatchConfirmPassword(AC: AbstractControl) {
        const password = AC.get('password').value;
        if (AC.get('confirm_password').touched || AC.get('confirm_password').dirty) {
            const verifyPassword = AC.get('confirm_password').value;

            if (password != verifyPassword) {
                AC.get('confirm_password').setErrors({ MatchPassword: true });
            } else {
                return null;
            }
        }
    }
}