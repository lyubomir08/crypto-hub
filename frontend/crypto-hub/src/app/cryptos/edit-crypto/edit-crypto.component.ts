import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoDetails, EditDetails } from '../../types/crypto';
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

    constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        const cryptoId = this.route.snapshot.params['cryptoId'];

        this.apiService.getOneCrypto(cryptoId).subscribe((crypto) => {
            this.crypto = crypto;
            this.isLoading = false;
        });
    }

    editCrypto(): void {
        if (!this.crypto._id) return;

        this.apiService.updateCrypto(
            this.crypto._id,
            this.crypto.name,
            this.crypto.symbol,
            this.crypto.currentPrice,
            this.crypto.description,
            this.crypto.imageUrl
        ).subscribe(() => this.router.navigate(['/cryptos', this.crypto?._id, 'details']));
    }

    onCancel(event: Event): void {
        event.preventDefault();
        history.back();
    }
}
