import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { ActivatedRoute } from '@angular/router';
import { CryptoDetails } from '../../types/crypto';

@Component({
    selector: 'app-detailed-crypto',
    standalone: true,
    imports: [],
    templateUrl: './detailed-crypto.component.html',
    styleUrl: './detailed-crypto.component.css'
})
export class DetailedCryptoComponent implements OnInit {
    crypto: CryptoDetails | null = null;

    constructor(private apiService: ApiService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        const id = this.route.snapshot.params['cryptoId'];

        this.apiService.getOneCrypto(id).subscribe((crypto: CryptoDetails) => {
            this.crypto = crypto;
        });
    }
}
