import { FormGroup, FormControl } from '@angular/forms'

// validation : Allow Alphanumeric char and space only
export class TextFieldValidator {
    static validTextField(fc: FormControl) {    
        if (fc.value != undefined && fc.value != '') {        
            const regex = /^[a-zA-Z0-9 ]+$/;
            if (regex.test(fc.value)) {
                return null;
            } else {
                return { validTextField: true }
            }

        } else {
            return null;
        }
    }
}


// validation : Allow Numeric only
export class NumericFieldValidator {
    static validNumericField(fc: FormControl) {
        if (fc.value != undefined && fc.value != '') {
            const regex = /[0-9]+/;
            if (regex.test(fc.value)) {
                return null
            } else {
                return { validNumericField: true }
            }
        } else {
            return null
        }
    }
}

// validation : Allow char and space only
export class OnlyCharFieldValidator {

    static validOnlyCharField(fc: FormControl) {
        if (fc.value != undefined && fc.value != '') {
            const regex = /^[a-zA-Z ]+$/
            if (regex.test(fc.value)) {
                return null
            } else {
                return { validOnlyCharField: true }
            }
        } else {
            return null
        }
    }

}

// validation : Allow email only
export class EmailValidator {
    static validEmail(fc: FormControl) {
        if (fc.value != undefined && fc.value != '') {
            const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/
            if (regex.test(fc.value)) {
                return null;
            } else {
                return { validEmail: true }
            }
        } else {
            return null
        }
    }
}


// validation : Not White Allow Spac

export class NoWhiteSpaceValidator {
    static noWhiteSpaceValidator(fc: FormControl) {
        if (fc.value != undefined && fc.value != '' && fc.value != null) {
            const isWhiteSpace = (fc.value.toString()).trim().length === 0
            if (!isWhiteSpace) {
                return null
            } else {
                return { noWhiteSpaceValidator: true }
            }
        } else {
            return null
        }
    }
}

// validation : Check Two Field Match
export function MustMatchValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return;
        }

        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}