import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { emailValidator } from '../../utils/email.validator';
import { DOMAINS } from '../../constants';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    form = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.minLength(5),]),
        email: new FormControl('', [Validators.required, emailValidator(DOMAINS)]),
        password: new FormControl('', [Validators.required]),
        rePassword: new FormControl('', [Validators.required]),
    });

    isFieldTextMissing(controlName: string) {
        return (
            this.form.get(controlName)?.touched &&
            this.form.get(controlName)?.errors?.['required']
        );
    }

    get isNotMinLength() {
        return (
            this.form.get('username')?.touched &&
            this.form.get('username')?.errors?.['minlength']
        );
    }

    get isEmailNotValid() {
        return (
            this.form.get('email')?.touched &&
            this.form.get('email')?.errors?.['emailValidator']
        );
    }

    register() {
        if (this.form.invalid) {
            return;
        }

        console.log(this.form.value);
    }
}
