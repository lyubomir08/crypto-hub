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
    isLoading = true;
    errorMessage: string | null = null;

    editingField: 'username' | 'email' | null = null;
    updatedField: { username?: string; email?: string } = {};

    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.loadUserProfile();
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

    editField(field: 'username' | 'email'): void {
        if (!this.user) return;
        this.editingField = field;
        this.updatedField[field] = this.user[field] || '';
    }

    saveField(): void {
        if (!this.user || !this.updatedField[this.editingField!]?.trim()) return;
    
        const updatedValue = this.updatedField[this.editingField!]?.trim();
    
        this.userService.updateProfile(
            this.editingField === 'username' ? updatedValue! : this.user.username!,
            this.editingField === 'email' ? updatedValue! : this.user.email!
        ).subscribe({
            next: (updatedUser) => {
                this.user = updatedUser;
                this.editingField = null;
            },
            error: (err) => {
                this.errorMessage = err?.message || 'Failed to update profile.';
            }
        });
    }    

    cancelEdit(): void {
        this.editingField = null;
    }
}
