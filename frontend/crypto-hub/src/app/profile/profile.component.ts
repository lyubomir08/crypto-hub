import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../shared/loader/loader.component';
import { UserProfile } from '../types/user';
import { UserService } from '../user/user.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, LoaderComponent],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
    user: UserProfile | null = null;
    allUsers: UserProfile[] | null = null;
    isLoading = true;
    errorMessage: string | null = null;

    editingField: 'username' | 'email' | 'profileImage' | null = null;
    updatedField: { username?: string; email?: string; profileImage?: string } = {};
    showAllUsers: boolean = false;

    constructor(private userService: UserService) {}

    get isAdmin(): boolean {
        return this.userService.isAdmin();
    }

    ngOnInit(): void {
        this.loadUserProfile();

        setTimeout(() => (this.errorMessage = null), 2000);
    }

    private loadUserProfile(): void {
        this.userService.getProfile().subscribe({
            next: (user) => {
                this.user = user;
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = error?.message || 'Failed to load user profile.';
                this.isLoading = false;
            },
        });
    }

    toggleAllUsers(): void {
        this.showAllUsers = !this.showAllUsers;
        if (this.showAllUsers && !this.allUsers) {
            this.loadAllUsers();
        }
    }

    private loadAllUsers(): void {
        this.isLoading = true;
        this.userService.getAllUsers().subscribe({
            next: (users) => {
                this.allUsers = users as UserProfile[];
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
                if (error.status !== 403) {
                    this.errorMessage = error?.message || 'Failed to load users.';
                }
            },
        });
    }

    editField(field: 'username' | 'email' | 'profileImage'): void {
        if (!this.user) return;
        this.editingField = field;
        this.updatedField[field] = this.user[field] || '';
    }

    saveField(): void {
        if (!this.user || !this.updatedField[this.editingField!]?.trim()) return;

        const updatedValue = this.updatedField[this.editingField!]?.trim();

        this.userService
            .updateProfile(
                this.editingField === 'username' ? updatedValue! : this.user.username!,
                this.editingField === 'email' ? updatedValue! : this.user.email!,
                this.editingField === 'profileImage' ? updatedValue! : this.user.profileImage!
            )
            .subscribe({
                next: (updatedUser) => {
                    this.user = updatedUser;
                    this.editingField = null;
                },
                error: (err) => {
                    this.errorMessage = err?.message || 'Failed to update profile.';
                },
            });
    }

    cancelEdit(): void {
        this.editingField = null;
    }
}
