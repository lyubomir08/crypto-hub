import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../api.service';
import { Crypto } from '../../types/crypto';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { RouterLink } from '@angular/router';
import { symbolToIdMap } from '../../constants';

@Component({
    selector: 'app-search-crypto',
    standalone: true,
    imports: [FormsModule, CommonModule, LoaderComponent, RouterLink],
    templateUrl: './search-crypto.component.html',
    styleUrls: ['./search-crypto.component.css'],
})
export class SearchCryptoComponent implements OnInit {
    cryptos: Crypto[] = [];
    isLoading = true;
    errorMessage: string | null = null;

    constructor(private apiService: ApiService) {}

    ngOnInit(): void {
        this.apiService.getCryptos().subscribe({
            next: (data) => {
                this.cryptos = data.map((d) => {
                    return {
                        ...d,
                        currentPrice: 'Loading...'
                    };
                }) as any;
                this.isLoading = false;

                const symbols = data.map((crypto) => crypto.symbol.toLowerCase());
                this.fetchLivePrices(symbols);
            },
            error: (error) => {
                this.errorMessage = 'Failed to load cryptos. Please try again later.';
                this.isLoading = false;
            },
        });
    }

    search(form: NgForm): void {
        if (form.invalid) {
            return;
        }

        const { name, symbol } = form.value;

        this.isLoading = true;

        this.apiService.searchCryptos(name, symbol).subscribe({
            next: (data) => {
                this.cryptos = data;

                const symbols = data.map((crypto) => crypto.symbol.toLowerCase());
                this.fetchLivePrices(symbols);

                this.isLoading = false;
            },
            error: (err) => {
                this.errorMessage = 'An error occurred while searching for cryptos. Please try again.';
                this.isLoading = false;
            },
        });

        form.reset();
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
                this.cryptos = this.cryptos.map((crypto) => {
                    const id = symbolToIdMap[crypto.symbol.toLowerCase()];
                    const priceData = livePrices[id];
                    return {
                        ...crypto,
                        currentPrice: priceData?.usd || 'Loading...',
                    };
                }) as Crypto[];
            },
            error: () => {
                this.errorMessage = 'Failed to fetch live prices.';
                setTimeout(() => (this.errorMessage = null), 2500);
            },
        });
    }
}
