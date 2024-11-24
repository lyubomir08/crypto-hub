import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        rePassword: new FormControl('', [Validators.required]),
    });

    get isUsernameMissing() {
        return (
            this.form.get('username')?.touched &&
            this.form.get('username')?.errors?.['required']
        );
    }

    get isNotMinLength() {
        return (
            this.form.get('username')?.touched &&
            this.form.get('username')?.errors?.['minlength']
        );
    }

    register() {
        if (this.form.invalid) {
            return;
        }

        console.log(this.form.value);
    }
}
