import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Crypto } from '../../types/crypto';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-catalog',
    standalone: true,
    imports: [CommonModule, LoaderComponent, RouterLink],
    templateUrl: './catalog.component.html',
    styleUrl: './catalog.component.css',
})
export class CatalogComponent implements OnInit {
    cryptos: Crypto[] = [];
    isLoading: boolean = true;
    errorMessage: string | null = null;

    private symbolToIdMap: { [key: string]: string } = {
        btc: 'bitcoin',         
        eth: 'ethereum',        
        bnb: 'binancecoin',     
        xrp: 'ripple',          
        ada: 'cardano',         
        sol: 'solana',          
        doge: 'dogecoin',       
        matic: 'polygon',       
        dot: 'polkadot',        
        ltc: 'litecoin',
        asd: 'asd'
    };

    constructor(private apiService: ApiService) {}

    ngOnInit(): void {
        this.fetchStaticCryptos();
    }

    private fetchStaticCryptos(): void {
        this.apiService.getCryptos().subscribe({
            next: (cryptos) => {
                this.cryptos = cryptos;
                this.isLoading = false;

                const symbols = cryptos.map((crypto) => crypto.symbol.toLowerCase());
                this.fetchLivePrices(symbols);
            },
            error: () => {
                this.isLoading = false;
                this.errorMessage = 'Failed to load cryptocurrencies.';
                setTimeout(() => (this.errorMessage = null), 2500);
            },
        });
    }

    private fetchLivePrices(symbols: string[]): void {
        const ids = symbols
            .map((symbol) => this.symbolToIdMap[symbol])
            .filter((id) => id);

        if (ids.length === 0) {
            console.error('No valid CoinGecko IDs to fetch prices.');
            return;
        }
        
        this.apiService.getLivePrices(ids).subscribe({
            next: (livePrices) => {
                this.cryptos = this.cryptos.map((crypto) => {
                    const id = this.symbolToIdMap[crypto.symbol.toLowerCase()];
                    const priceData = livePrices[id];
                    return {
                        ...crypto,
                        currentPrice: priceData?.usd || crypto.currentPrice,
                    };
                });
            },
            error: () => {
                this.errorMessage = 'Failed to fetch live prices.';
                setTimeout(() => (this.errorMessage = null), 2500);
            },
        });
    }
}
