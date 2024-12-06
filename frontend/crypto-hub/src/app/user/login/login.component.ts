import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { FormsModule, NgForm } from '@angular/forms';
import { EmailDirective } from '../../directives/email.directive';
import { DOMAINS } from '../../constants';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink, FormsModule, EmailDirective],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {
    domains = DOMAINS;
    errorMessage: string | null = null;

    constructor(private userService: UserService, private router: Router) { }

    login(form: NgForm) {
        if (form.invalid) {
            console.error("Invalid login form");
            return;
        }

        const { email, password } = form.value;

        this.userService.login(email, password).subscribe({
            next: () => {
                this.router.navigate(['/home']);
            },
            error: (err) => {
                this.errorMessage = err?.message || 'An error occurred. Please try again.';
            }
        });
    }
}
