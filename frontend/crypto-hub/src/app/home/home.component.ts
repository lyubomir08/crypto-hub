import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Crypto } from '../types/crypto';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../shared/loader/loader.component';
import { CommonModule } from '@angular/common';
import { symbolToIdMap } from '../constants';
import { CryptoNewsItem } from '../types/crypto';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink, LoaderComponent, CommonModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
    lastThreeCryptos: Crypto[] = [];
    allCryptos: Crypto[] = [];
    cryptoNews: CryptoNewsItem[] = [];
    isLoading: boolean = false;
    errorMessage: string | null = null;

    constructor(private apiService: ApiService) {}

    ngOnInit() {
        this.fetchAllCryptos();
        this.fetchCryptoNews();
        setTimeout(() => (this.errorMessage = null), 2500);
    }

    fetchAllCryptos() {
        this.isLoading = true;

        this.apiService.getCryptos().subscribe({
            next: (data) => {
                this.allCryptos = data;

                this.lastThreeCryptos = [...data]
                    .sort((a, b) => new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime())
                    .slice(0, 3);

                const symbols = this.lastThreeCryptos.map((crypto) => crypto.symbol.toLowerCase());
                this.fetchLivePrices(symbols);

                this.isLoading = false;
            },
            error: () => {
                this.errorMessage = 'Failed to load cryptocurrencies.';
                this.isLoading = false;
            },
        });
    }

    private fetchLivePrices(symbols: string[]): void {
        const ids = symbols
            .map((symbol) => symbolToIdMap[symbol])
            .filter((id) => id);

        if (ids.length === 0) {
            console.error('No valid CoinGecko IDs to fetch prices.');
            return;
        }

        this.apiService.getLivePrices(ids).subscribe({
            next: (livePrices) => {
                this.lastThreeCryptos = this.lastThreeCryptos.map((crypto) => {
                    const id = symbolToIdMap[crypto.symbol.toLowerCase()];
                    const priceData = livePrices[id];
                    return {
                        ...crypto,
                        currentPrice: priceData?.usd || crypto.currentPrice,
                    };
                });
            },
            error: () => {
                this.errorMessage = 'Failed to fetch live prices.';
            },
        });
    }

    private fetchCryptoNews(): void {
        this.apiService.getRandomCryptoNews().subscribe({
            next: (news: any) => {
                console.log(news);
                
                this.cryptoNews = news.slice(0, 8);
            }, error: () => {
                this.errorMessage = 'Failed to load crypto news.';
            }
        });
    }
}
