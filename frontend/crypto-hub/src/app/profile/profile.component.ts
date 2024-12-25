import { Component, OnInit } from '@angular/core';
import { UserService } from '.././user/user.service';
import { LoaderComponent } from '../shared/loader/loader.component';
import { CommonModule } from '@angular/common';
import { UserForAuth } from '.././types/user';

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    imports: [LoaderComponent, CommonModule],
    styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
    user: UserForAuth | null = null;
    isLoading: boolean = true;
    errorMessage: string | null = null;

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.loadUserProfile();
    }

    private loadUserProfile(): void {
        this.isLoading = true;
        this.userService.getProfile().subscribe({
            next: (user) => {
                console.log(user);
                
                this.user = user;
                this.isLoading = false;
            },
            error: (err) => {
                this.errorMessage = err?.message || 'Failed to load profile.';
                this.isLoading = false;
            },
        });
    }
}
