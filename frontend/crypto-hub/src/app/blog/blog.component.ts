import { Component, NgModule, OnInit } from '@angular/core';
import { Article } from '../types/article';
import { BlogService } from './blog.service';
import { UserService } from '../user/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-blog',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
    articles: Article[] = [];
    showModal = false;
    newArticle = { title: '', content: '' };
    isSubmitting = false;

    constructor(private blogService: BlogService, private userService: UserService) { }

    ngOnInit(): void {
        this.loadApprovedArticles();
    }

    get isLoggedIn(): boolean {
        return this.userService.isLogged;
    }

    loadApprovedArticles(): void {
        this.blogService.getApprovedArticles().subscribe({
            next: (articles) => this.articles = articles,
            error: (err) => console.error('Error loading articles', err)
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

        this.blogService.createArticle(this.newArticle.title, this.newArticle.content).subscribe({
            next: (res) => {
                alert(res.message);
                this.closeModal();
            },
            error: (err) => {
                alert('Error adding article');
                console.error(err);
            },
            complete: () => this.isSubmitting = false
        });
    }
}
