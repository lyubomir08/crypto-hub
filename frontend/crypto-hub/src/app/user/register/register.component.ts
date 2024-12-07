import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { emailValidator } from '../../utils/email.validator';
import { DOMAINS } from '../../constants';
import { matchPasswordsValidator } from '../../utils/match-passwords.validator';
import { UserService } from '../user.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    form = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.minLength(5)]),
        email: new FormControl('', [Validators.required, emailValidator(DOMAINS)]),
        passGroup: new FormGroup(
            {
                password: new FormControl('', [Validators.required, Validators.minLength(5)]),
                rePassword: new FormControl('', [Validators.required]),
            },
            {
                validators: [matchPasswordsValidator('password', 'rePassword')],
            }
        ),
    });

    errorMessage: string | null = null;

    constructor(private userService: UserService, private router: Router) { }

    isFieldTextMissing(controlName: string): boolean {
        return (
            this.form.get(controlName)?.touched &&
            this.form.get(controlName)?.errors?.['required']
        );
    }

    get isNotMinLength(): boolean {
        return (
            this.form.get('username')?.touched &&
            this.form.get('username')?.errors?.['minlength']
        );
    }

    get isEmailNotValid(): boolean {
        return (
            this.form.get('email')?.touched &&
            this.form.get('email')?.errors?.['emailValidator']
        );
    }

    get passGroup() {
        return this.form.get('passGroup');
    }

    register(): void {
        if (this.form.invalid) {
            return;
        }

        const { username, email, passGroup: { password, rePassword } = {} } = this.form.value;

        this.userService.register(username!, email!, password!, rePassword!).subscribe({
            next: () => {
                this.router.navigate(['/home']);
            },
            error: (err) => {
                this.errorMessage =
                    err?.error?.message || 'Registration failed. Please try again.';
            },
        });

        setTimeout(() => {
            this.errorMessage = null;
        }, 3000);
    }
}
