import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoDetails } from '../../types/crypto';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
    selector: 'app-edit-crypto',
    standalone: true,
    imports: [FormsModule, LoaderComponent],
    templateUrl: './edit-crypto.component.html',
    styleUrl: './edit-crypto.component.css'
})
export class EditCryptoComponent implements OnInit {
    @ViewChild('form') form: NgForm | undefined;
    crypto: CryptoDetails | null = null;
    isLoading: boolean = true;

    constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        const cryptoId = this.route.snapshot.params['cryptoId'];

        this.apiService.getOneCrypto(cryptoId).subscribe((crypto) => {
            this.crypto = crypto;
            this.isLoading = false;
        });

        if (this.form) {
            this.form?.setValue({
                name: this.crypto?.name,
                symbol: this.crypto?.symbol,
                currentPrice: this.crypto?.currentPrice,
                description: this.crypto?.description,
                imageUrl: this.crypto?.imageUrl
            });
        }
    }

    editCrypto() {
        if (!this.crypto) {
            return;
        }
        const { name, symbol, currentPrice, description, imageUrl } = this.crypto;
        const id = this.crypto?._id;

        this.apiService.updateCrypto(id as any, name, symbol, currentPrice, description, imageUrl).subscribe(() => {
            this.router.navigate(['/cryptos']);
        });

    }
}
