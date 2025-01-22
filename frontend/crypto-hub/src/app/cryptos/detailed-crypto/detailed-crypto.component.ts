import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CryptoDetails } from '../../types/crypto';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { UserForAuth } from '../../types/user';
import { UserService } from '../../user/user.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { symbolToIdMap } from '../../constants';

import { ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

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
    originalCommentText: { [key: string]: string } = {};
    showDeleteModal: boolean = false;
    modalMessage: string = '';
    deleteTarget: { type: 'crypto' | 'comment'; id?: string } | null = null;

    @ViewChild('cryptoChart') cryptoChart!: ElementRef<HTMLCanvasElement>;
    historicalData: { date: string; price: number }[] = [];
    chart: Chart | null = null;

    constructor(
        private router: Router,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private userService: UserService
    ) { }

    get cryptoId(): string {
        return this.route.snapshot.params['cryptoId'];
    }

    get isAdmin(): boolean {
        return this.userService.isAdmin();
    }

    ngOnInit(): void {
        this.loadUserProfile();
        this.loadCryptoDetails();
    }

    private fetchHistoricalData(): void {
        if (!this.crypto?.name) {
            this.errorMessage = 'Crypto name is required to fetch historical data.';
            return;
        }
    
        this.apiService.getHistoricalPrices(this.crypto.name).subscribe({
            next: (data) => {
                this.historicalData = data;
                console.log(data);
                
                this.renderChart();
            },
            error: () => {
                this.errorMessage = 'Failed to fetch historical data.';
            },
        });
    }    

    private renderChart(): void {
        if (this.chart) this.chart.destroy();
    
        const ctx = this.cryptoChart.nativeElement.getContext('2d');
        this.chart = new Chart(ctx!, {
            type: 'line',
            data: {
                labels: this.historicalData.map((d) => d.date),
                datasets: [
                    {
                        label: 'Историческа цена (USD)',
                        data: this.historicalData.map((d) => d.price),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                        tension: 0.4,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true },
                },
                scales: {
                    x: { title: { display: true, text: 'Дата' } },
                    y: { title: { display: true, text: 'Цена (USD)' } },
                },
            },
        });
    }    

    private loadCryptoDetails(): void {
        this.isLoading = true;
        this.apiService.getOneCrypto(this.cryptoId).subscribe({
            next: (crypto: CryptoDetails) => {
                this.crypto = crypto;
                this.isLoading = false;
                this.fetchLivePrice(crypto.symbol);
                this.fetchHistoricalData();
            },
            error: (err) => {
                this.errorMessage = err?.message || 'Failed to load cryptocurrency details.';
                this.isLoading = false;
            },
        });
    }

    private fetchLivePrice(symbol: string): void {
        const id = symbolToIdMap[symbol.toLowerCase()];
        if (!id) {
            console.error('No valid CoinGecko ID to fetch price.');
            return;
        }

        this.apiService.getLivePrices([id]).subscribe({
            next: (livePrices) => {
                const priceData = livePrices[id];
                if (this.crypto) {
                    this.crypto.currentPrice = priceData?.usd || this.crypto.currentPrice;
                }
            },
            error: () => {
                this.errorMessage = 'Failed to fetch live price.';
                setTimeout(() => (this.errorMessage = null), 2500);
            },
        });
    }

    private loadUserProfile(): void {
        this.userService.getProfile().subscribe({
            next: (user) => (this.currentUser = user),
            error: () => (this.currentUser = null),
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

    showDeleteConfirmation(type: 'crypto' | 'comment', id?: string): void {
        this.deleteTarget = { type, id };
        this.modalMessage =
            type === 'crypto'
                ? 'Are you sure you want to delete this cryptocurrency?'
                : 'Are you sure you want to delete this comment?';
        this.showDeleteModal = true;
    }

    confirmDelete(): void {
        if (this.deleteTarget?.type === 'crypto') {
            this.deleteCrypto();
        } else if (this.deleteTarget?.type === 'comment' && this.deleteTarget.id) {
            this.deleteComment(this.deleteTarget.id);
        }
        this.showDeleteModal = false;
    }

    cancelDelete(): void {
        this.showDeleteModal = false;
        this.deleteTarget = null;
    }

    private deleteCrypto(): void {
        this.apiService.deleteCrypto(this.cryptoId).subscribe({
            next: () => this.router.navigate(['/cryptos']),
            error: () => (this.errorMessage = 'Failed to delete the cryptocurrency.'),
        });
    }

    private deleteComment(commentId: string): void {
        this.apiService.deleteComment(this.cryptoId, commentId).subscribe({
            next: () => this.loadCryptoDetails(),
            error: () => (this.errorMessage = 'Failed to delete the comment.'),
        });
    }
}

