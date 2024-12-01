import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../api.service';
import { Crypto } from '../../types/crypto';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
    selector: 'app-search-crypto',
    standalone: true,
    imports: [FormsModule, CommonModule, LoaderComponent],
    templateUrl: './search-crypto.component.html',
    styleUrls: ['./search-crypto.component.css'],
})
export class SearchCryptoComponent {
    cryptos: Crypto[] = [];
    isLoading = false;

    constructor(private apiService: ApiService) { }

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
