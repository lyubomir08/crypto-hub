import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../types/article';

@Injectable({
    providedIn: 'root'
})
export class BlogService {

    private apiUrl = '/api/articles';
    private adminApiUrl = '/api/admin/articles';

    constructor(private http: HttpClient) { }

    createArticle(title: string, content: string) {
        return this.http.post<{ message: string, article: Article }>(this.apiUrl, { title, content });
    }

    deleteArticle(id: string) {
        return this.http.delete<{ message: string }>(`${this.adminApiUrl}/${id}`);
    }
    
    getApprovedArticles(): Observable<Article[]> {
        return this.http.get<Article[]>(this.apiUrl);
    }

    getPendingArticles(): Observable<Article[]> {
        return this.http.get<Article[]>(`${this.adminApiUrl}/pending`);
    }

    approveOrRejectArticle(id: string, status: 'approved' | 'rejected') {
        return this.http.patch<{ message: string, article: Article }>(`${this.adminApiUrl}/${id}`, { status });
    }
}
