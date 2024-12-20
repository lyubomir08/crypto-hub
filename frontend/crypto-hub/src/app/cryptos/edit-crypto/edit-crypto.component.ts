import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EditDetails } from '../../types/crypto';
import { LoaderComponent } from '../../shared/loader/loader.component';

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

        this.apiService.updateCrypto(
            this.crypto._id,
            this.crypto.name,
            this.crypto.symbol,
            this.crypto.currentPrice,
            this.crypto.description,
            this.crypto.imageUrl
        ).subscribe({
            next: () => {
                this.router.navigate(['/cryptos', this.crypto?._id, 'details']);
            },
            error: (err) => {
                this.errorMessage = err?.message;
            }
        });
    }

    onCancel(event: Event): void {
        event.preventDefault();
        history.back();
    }
}
