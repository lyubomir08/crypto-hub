import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../api.service';
import { Crypto } from '../../types/crypto';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { RouterLink } from '@angular/router';

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

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.apiService.getCryptos().subscribe({
            next: (data) => {
                this.cryptos = data;
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Failed to load cryptos. Please try again later.';
                this.isLoading = false;
            }
        });
    }

    search(form: NgForm) {
        if (form.invalid) {
            return;
        }

        const { name, symbol } = form.value;

        this.isLoading = true;

        this.apiService.searchCryptos(name, symbol).subscribe(
            (data) => {
                this.cryptos = data;
                this.isLoading = false;
            },
            (err) => {
                this.errorMessage = 'An error occurred while searching for cryptos. Please try again.';
                this.isLoading = false;
            }
        );
        form.reset();
    }
}
