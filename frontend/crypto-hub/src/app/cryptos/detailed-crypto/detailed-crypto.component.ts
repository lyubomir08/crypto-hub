import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CryptoDetails } from '../../types/crypto';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { UserForAuth } from '../../types/user';
import { UserService } from '../../user/user.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-detailed-crypto',
    standalone: true,
    imports: [LoaderComponent, RouterLink, DatePipe, CommonModule, FormsModule],
    templateUrl: './detailed-crypto.component.html',
    styleUrls: ['./detailed-crypto.component.css'],
})
export class DetailedCryptoComponent implements OnInit {
    crypto: CryptoDetails | null = null;
    isLoading: boolean = true;
    currentUser: UserForAuth | null = null;
    errorMessage: string | null = null;
    isEditing: string | null = null;
    isOwner: boolean = false;
    originalCommentText: { [key: string]: string } = {};

    constructor(
        private router: Router,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private userService: UserService
    ) { }

    get cryptoId(): string {
        return this.route.snapshot.params['cryptoId'];
    }

    ngOnInit(): void {
        this.loadUserProfile();
        this.loadCryptoDetails();
    }

    private loadCryptoDetails(): void {
        this.isLoading = true;
        this.apiService.getOneCrypto(this.cryptoId).subscribe({
            next: (crypto: CryptoDetails) => {
                this.crypto = crypto;
                this.isLoading = false;
                this.checkOwnership(crypto);
            },
            error: (err) => {
                this.errorMessage = err?.message || 'Failed to load cryptocurrency details.';
                this.isLoading = false;
            },
        });
    }

    private loadUserProfile(): void {
        this.userService.getProfile().subscribe({
            next: (user) => (this.currentUser = user),
            error: () => (this.currentUser = null),
        });
    }

    private checkOwnership(crypto: CryptoDetails): void {
        this.isOwner = crypto.owner?._id === this.currentUser?._id;
    }

    deleteCrypto(): void {
        if (!confirm('Are you sure you want to delete this crypto?')) return;

        this.apiService.deleteCrypto(this.cryptoId).subscribe({
            next: () => this.router.navigate(['/cryptos']),
            error: () => (this.errorMessage = 'Failed to delete the cryptocurrency.'),
        });
    }

    addComment(inputText: HTMLTextAreaElement): void {
        const text = inputText.value.trim();
        if (!text) return;

        this.apiService.addComment(this.cryptoId, text).subscribe({
            next: () => {
                inputText.value = '';
                this.loadCryptoDetails();
            },
            error: () => (this.errorMessage = 'Failed to add the comment.'),
        });
    }

    deleteComment(commentId: string): void {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        this.apiService.deleteComment(this.cryptoId, commentId).subscribe({
            next: () => this.loadCryptoDetails(),
            error: () => (this.errorMessage = 'Failed to delete the comment.'),
        });
    }

    editComment(comment: any): void {
        this.isEditing = comment._id;
        this.originalCommentText[comment._id] = comment.text;
    }

    cancelEdit(comment: any): void {
        if (this.originalCommentText[comment._id]) {
            comment.text = this.originalCommentText[comment._id];
        }
        this.isEditing = null;
    }

    updateComment(commentId: string): void {
        const comment = this.crypto?.comments.find((c) => c._id === commentId);
        if (!comment || !comment.text.trim()) {
            this.errorMessage = 'Comment text cannot be empty.';
            return;
        }

        this.apiService.updateComment(this.cryptoId, commentId, comment.text).subscribe({
            next: () => {
                this.isEditing = null;
                delete this.originalCommentText[commentId];
                this.loadCryptoDetails();
            },
            error: () => (this.errorMessage = 'Failed to update the comment.'),
        });
    }
}
