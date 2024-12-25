import { Component, OnInit } from '@angular/core';
import { LoaderComponent } from '../shared/loader/loader.component';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../types/user';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    imports: [LoaderComponent, CommonModule,FormsModule],
    styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
    user: UserProfile | null = null;
    isLoading: boolean = true;
    errorMessage: string | null = null;

    isEditingUsername = false;
    isEditingEmail = false;

    // Temporary variables for new values
    newUsername = '';
    newEmail = '';

    constructor() { }

    ngOnInit(): void {
        this.loadUserProfile();
    }

    private loadUserProfile(): void {
        this.isLoading = true;
        setTimeout(() => {
            this.user = {
                username: 'JohnDoe',
                email: 'john.doe@example.com',
                createdAt: new Date(),
            };
            this.isLoading = false;
        }, 500);
    }

    editUsername(): void {
        if (!this.user) return;
        this.isEditingUsername = true;
        this.newUsername = this.user.username;
    }

    saveUsername(): void {
        if (!this.newUsername.trim() || !this.user) return;

        this.user.username = this.newUsername;
        this.isEditingUsername = false;
        console.log('Username updated locally:', this.newUsername);
    }

    editEmail(): void {
        if (!this.user) return;
        this.isEditingEmail = true;
        this.newEmail = this.user.email;
    }

    saveEmail(): void {
        if (!this.newEmail.trim() || !this.user) return;

        this.user.email = this.newEmail;
        this.isEditingEmail = false;
        console.log('Email updated locally:', this.newEmail);
    }
}
