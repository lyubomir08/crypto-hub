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

    usdAmount: number = 0;
    calculatedCryptoAmount: number = 0;

    @ViewChild('cryptoChart') cryptoChart!: ElementRef<HTMLCanvasElement>;
    historicalData: { date: string; price: number }[] = [];
    chart: Chart | null = null;
    showChart: boolean = false;

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

    toggleChart(): void {
        if (this.chart && this.showChart) {
            this.chart.destroy();
            this.chart = null;
        }
        this.showChart = !this.showChart;
        if (this.showChart) {
            setTimeout(() => this.renderChart(), 100);
        }
    }    

    private fetchHistoricalData(): void {
        if (!this.crypto?.name) {
            this.errorMessage = 'Crypto name is required to fetch historical data.';
            return;
        }
    
        this.apiService.getHistoricalPrices(this.crypto.name).subscribe({
            next: (data) => {
                this.historicalData = data;
                
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
                        label: 'Historical Price (USD)',
                        data: this.historicalData.map((d) => d.price),
                        borderColor: '#2E3B4E',
                        backgroundColor: 'rgba(46, 59, 78, 0.2)',
                        borderWidth: 2,
                        pointBackgroundColor: '#2E3B4E',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#2E3B4E',
                        tension: 0.3,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Cryptocurrency Price Over Time',
                        color: '#222',
                        font: {
                            size: 20,
                            weight: 'bold',
                        },
                        padding: {
                            top: 20,
                            bottom: 20,
                        },
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#444',
                            font: {
                                size: 14,
                            },
                        },
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(50, 50, 50, 0.9)',
                        titleFont: {
                            size: 14,
                            weight: 'bold',
                        },
                        bodyFont: {
                            size: 12,
                        },
                        bodySpacing: 10,
                        cornerRadius: 8,
                        caretSize: 6,
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date',
                            color: '#555',
                            font: {
                                size: 14,
                                weight: 'bold',
                            },
                        },
                        ticks: {
                            color: '#333',
                            font: {
                                size: 12,
                            },
                            autoSkip: true,
                            maxTicksLimit: 7,
                        },
                        grid: {
                            color: 'rgba(100, 100, 100, 0.1)',
                            lineWidth: 0.5,
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Price (USD)',
                            color: '#555',
                            font: {
                                size: 14,
                                weight: 'bold',
                            },
                        },
                        ticks: {
                            color: '#333',
                            font: {
                                size: 12,
                            },
                            callback: function (value) {
                                return '$' + value.toLocaleString();
                            },
                        },
                        grid: {
                            color: 'rgba(100, 100, 100, 0.1)',
                            lineWidth: 0.5,
                        },
                    },
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                elements: {
                    line: {
                        tension: 0.3,
                    },
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

    calculateCryptoAmount(): void {
        if (this.crypto?.currentPrice && this.usdAmount > 0) {
            this.calculatedCryptoAmount = this.usdAmount / this.crypto.currentPrice;
        } else {
            this.calculatedCryptoAmount = 0;
        }
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

