import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../user/user.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink, CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
    get isLoggedIn(): boolean {
        return this.userService.isLogged;
    }

    get isAdmin(): boolean {
        return this.userService.isAdmin();
    }

    constructor(private userService: UserService, private router: Router) {}

    logout() {
        this.userService.logout().subscribe(() => {
            this.router.navigate(['/home']);
        });
    }
}
