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
    isLoadingLastThree: boolean = false;
    errorMessageLastThree: string | null = null;

    constructor(private apiService: ApiService) { }

    ngOnInit() {
        this.fetchLastThreeCryptos();
    }

    fetchLastThreeCryptos() {
        this.isLoadingLastThree = true;
        this.apiService.getLastThreeCryptos().subscribe({
            next: (data) => {
                this.lastThreeCryptos = data;
                this.isLoadingLastThree = false;
            },
            error: (err) => {
                console.error(err);
                this.errorMessageLastThree = 'Failed to load the latest cryptocurrencies.';
                this.isLoadingLastThree = false;
            },
        });
    }
}
