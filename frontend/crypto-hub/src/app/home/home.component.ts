import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Crypto } from '../types/crypto';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../shared/loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink, LoaderComponent, CommonModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {
    lastThreeCryptos: Crypto[] = [];
    allCryptos: Crypto[] = [];
    isLoading: boolean = false;
    errorMessage: string | null = null;

    constructor(private apiService: ApiService) {}

    ngOnInit() {
        this.fetchAllCryptos();
    }

    fetchAllCryptos() {
        this.isLoading = true;
        this.apiService.getCryptos().subscribe({
            next: (data) => {
                this.allCryptos = data;

                this.lastThreeCryptos = [...data]
                    .sort((a, b) => new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime())
                    .slice(0, 3);

                this.isLoading = false;
            },
            error: (err) => {
                this.errorMessage = 'Failed to load cryptocurrencies.';
                this.isLoading = false;
            },
        });
    }
}
