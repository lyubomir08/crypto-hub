import { Component, NgModule, OnInit } from '@angular/core';
import { Article } from '../types/article';
import { BlogService } from './blog.service';
import { UserService } from '../user/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../shared/loader/loader.component';

@Component({
    selector: 'app-blog',
    standalone: true,
    imports: [FormsModule, CommonModule, LoaderComponent],
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
    articles: Article[] = [];
    pendingArticles: Article[] = [];
    showModal = false;
    newArticle = { title: '', content: '' };
    isSubmitting = false;
    isLoading = false;
    toastMessage: string | null = null;
    errorMessage: string | null = null;

    constructor(private blogService: BlogService, private userService: UserService) { }

    ngOnInit(): void {
        this.loadApprovedArticles();
        if (this.isAdmin) {
            this.loadPendingArticles();
        }
    }

    get isLoggedIn(): boolean {
        return this.userService.isLogged;
    }

    get isAdmin(): boolean {
        return this.userService.isAdmin();
    }

    loadApprovedArticles(): void {
        this.isLoading = true;
        this.blogService.getApprovedArticles().subscribe({
            next: (articles) => {
                this.articles = articles;
                this.errorMessage = null;
            },
            error: (err) => this.errorMessage = 'Error loading articles: ' + err.message,
            complete: () => this.isLoading = false
        });
    }

    loadPendingArticles(): void {
        this.isLoading = true;
        this.blogService.getPendingArticles().subscribe({
            next: (articles) => {
                this.pendingArticles = articles;
                this.errorMessage = null;
            },
            error: (err) => this.errorMessage = 'Error loading pending articles: ' + err.message,
            complete: () => this.isLoading = false
        });
    }

    approveArticle(id: string): void {
        this.isLoading = true;
        this.blogService.approveOrRejectArticle(id, 'approved').subscribe({
            next: () => {
                this.showToast('Article approved');
                this.loadPendingArticles();
                this.loadApprovedArticles();
            },
            error: (err) => this.errorMessage = 'Error approving article: ' + err.message,
            complete: () => this.isLoading = false
        });
    }

    rejectArticle(id: string): void {
        this.isLoading = true;
        this.blogService.approveOrRejectArticle(id, 'rejected').subscribe({
            next: () => {
                this.showToast('Article rejected');
                this.loadPendingArticles();
            },
            error: (err) => this.errorMessage = 'Error rejecting article: ' + err.message,
            complete: () => this.isLoading = false
        });
    }

    openModal(): void {
        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
        this.newArticle = { title: '', content: '' };
    }

    submitArticle(): void {
        if (!this.newArticle.title || !this.newArticle.content) return;

        this.isSubmitting = true;
        this.isLoading = true;

        this.blogService.createArticle(this.newArticle.title, this.newArticle.content).subscribe({
            next: () => {
                this.showToast('Article submitted for review');
                this.closeModal();
                this.errorMessage = null;
            },
            error: (err) => this.errorMessage = 'Error adding article: ' + err.message,
            complete: () => {
                this.isSubmitting = false;
                this.isLoading = false;
            }
        });
    }

    showToast(message: string): void {
        this.toastMessage = message;
        setTimeout(() => {
            this.toastMessage = null;
        }, 3000);
    }
}
