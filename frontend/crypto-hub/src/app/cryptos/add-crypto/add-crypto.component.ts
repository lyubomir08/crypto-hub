import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { symbolToIdMap } from '../../constants'; // Импортирайте вашия map със символите

@Component({
    selector: 'app-add-crypto',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './add-crypto.component.html',
    styleUrl: './add-crypto.component.css'
})
export class AddCryptoComponent {
    errorMessage: string | null = null;

    constructor(private apiService: ApiService, private router: Router) {}

    create(form: NgForm) {
        if (form.invalid) {
            console.error("Invalid create form");
            return;
        }

        const name = form.value.name;
        const symbol = form.value.symbol.toLowerCase(); // Уверете се, че символът е малки букви
        const description = form.value.description;
        const imageUrl = form.value.imageUrl;

        // Извличане на текущата цена чрез API
        const id = symbolToIdMap[symbol];
        if (!id) {
            this.errorMessage = `Symbol ${symbol} is not supported.`;
            setTimeout(() => (this.errorMessage = null), 3000);
            return;
        }

        this.apiService.getLivePrices([id]).subscribe({
            next: (prices) => {
                const currentPrice = prices[id]?.usd;

                if (!currentPrice) {
                    this.errorMessage = `Failed to fetch the price for ${symbol}.`;
                    setTimeout(() => (this.errorMessage = null), 3000);
                    return;
                }

                // Изпращане на криптовалутата със зададената текуща цена
                this.apiService
                    .addCrypto(name, symbol, currentPrice, description, imageUrl)
                    .subscribe({
                        next: () => {
                            this.router.navigate(['/cryptos']);
                        },
                        error: (err) => {
                            this.errorMessage = err?.message;
                            setTimeout(() => (this.errorMessage = null), 3000);
                        },
                    });
            },
            error: (err) => {
                this.errorMessage = `Error fetching price: ${err?.message}`;
                setTimeout(() => (this.errorMessage = null), 3000);
            },
        });
    }
}
