import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EditDetails } from '../../types/crypto';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { symbolToIdMap } from '../../constants';

@Component({
    selector: 'app-edit-crypto',
    standalone: true,
    imports: [FormsModule, LoaderComponent],
    templateUrl: './edit-crypto.component.html',
    styleUrls: ['./edit-crypto.component.css']
})
export class EditCryptoComponent implements OnInit {
    @ViewChild('editForm') editForm: NgForm | undefined;
    crypto: EditDetails = {
        _id: '',
        name: '',
        symbol: '',
        currentPrice: 0,
        description: '',
        imageUrl: ''
    };
    isLoading: boolean = true;
    errorMessage: string | null = null;

    constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        const cryptoId = this.route.snapshot.params['cryptoId'];

        this.apiService.getOneCrypto(cryptoId).subscribe({
            next: (data) => {
                this.crypto = data;
                this.isLoading = false;
            },
            error: (err) => {
                this.errorMessage = err?.message;
                this.isLoading = false;
            }
        });
    }

    editCrypto(): void {
        if (!this.crypto) return;
    
        const cryptoId = symbolToIdMap[this.crypto.symbol.toLowerCase()];
        if (!cryptoId) {
            this.errorMessage = 'No valid CoinGecko ID to fetch price.';
            return;
        }
    
        this.apiService.getLivePrices([cryptoId]).subscribe({
            next: (livePrices) => {             
                const livePrice = livePrices[cryptoId]?.usd;
                if (!livePrice) {
                    this.errorMessage = 'Live price could not be fetched.';
                    return;
                }
    
                const updatedCrypto = {
                    ...this.crypto,
                    currentPrice: livePrice,
                };
    
                this.apiService.updateCrypto(
                    updatedCrypto._id,
                    updatedCrypto.name,
                    updatedCrypto.symbol,
                    updatedCrypto.currentPrice,
                    updatedCrypto.description,
                    updatedCrypto.imageUrl
                ).subscribe({
                    next: () => this.router.navigate(['/cryptos', updatedCrypto._id, 'details']),
                    error: (err) => {
                        this.errorMessage = err?.message || 'Failed to update cryptocurrency details.';
                    },
                });
            },
            error: (err) => {
                this.errorMessage = `Failed to fetch live price: ${err.message}`;
            },
        });
    }
    
    onCancel(event: Event): void {
        event.preventDefault();
        history.back();
    }
}
