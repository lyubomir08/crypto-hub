import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../user/user.service';
import { CommonModule } from '@angular/common';
import { UserForAuth } from '../../types/user';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
    currentUser: UserForAuth | null = null;

    constructor(private userService: UserService, private router: Router) {}

    ngOnInit(): void {
        if (this.isLoggedIn) {
            this.userService.getProfile().subscribe({
                next: (user) => {
                    console.log(user);
                    
                    this.currentUser = user;
                },
                error: (err) => {
                    console.error('Error fetching current user:', err);
                },
            });
        }
    }

    get isLoggedIn(): boolean {
        return this.userService.isLogged;
    }

    get isAdmin(): boolean {
        return this.userService.isAdmin();
    }

    logout(): void {
        this.userService.logout().subscribe(() => {
            this.router.navigate(['/home']);
        });
    }

    redirectToProfile(): void {
        this.router.navigate(['/profile']);
    }
}
