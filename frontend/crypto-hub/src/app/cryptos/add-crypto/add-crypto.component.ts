import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';

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
        const symbol = form.value.symbol;
        const currentPrice = form.value.currentPrice;
        const description = form.value.description;
        const imageUrl = form.value.imageUrl;

        this.apiService.addCrypto(name, symbol, currentPrice, description, imageUrl).subscribe({
            next: () => {
                this.router.navigate(['/cryptos']);
            },
            error: (err) => {
                this.errorMessage = err?.message;
            }
        });
        
        setTimeout(() => this.errorMessage = null, 3000);
    }
}
