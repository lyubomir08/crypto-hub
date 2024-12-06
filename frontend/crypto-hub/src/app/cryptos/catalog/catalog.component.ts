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

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.apiService.getCryptos().subscribe({
            next: (cryptos) => {
                this.cryptos = cryptos;
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = err?.message || 'Failed to load cryptocurrencies. Please try again later.';
            }
        });
    }

}