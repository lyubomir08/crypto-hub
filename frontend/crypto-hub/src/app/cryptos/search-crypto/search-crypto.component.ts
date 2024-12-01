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
    isLoading = false;

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.apiService.getCryptos().subscribe((data) => {
            this.cryptos = data;
        });
    }

    search(form: NgForm) {
        if(form.invalid) {
            return;
        }

        const { name, symbol } = form.value;

        this.isLoading = true;

        this.apiService.searchCryptos(name, symbol).subscribe(
            (data) => {
                this.cryptos = data;
                this.isLoading = false;
            },
        );
    }
}
