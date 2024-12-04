import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CryptoDetails } from '../../types/crypto';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { UserForAuth } from '../../types/user';
import { UserService } from '../../user/user.service';

@Component({
    selector: 'app-detailed-crypto',
    standalone: true,
    imports: [LoaderComponent, RouterLink],
    templateUrl: './detailed-crypto.component.html',
    styleUrl: './detailed-crypto.component.css'
})
export class DetailedCryptoComponent implements OnInit {
    crypto: CryptoDetails | null = null;
    isLoading: boolean = true;
    currentUser: UserForAuth | null = null;

    isOwner: boolean = false;

    constructor(private router: Router, private apiService: ApiService, private route: ActivatedRoute, private userService: UserService) { }

    get cryptoId(): string {
        return this.route.snapshot.params['cryptoId'];
    }
    
    ngOnInit(): void {
        const cryptoId = this.cryptoId;
        
        this.userService.getProfile().subscribe({
            next: (user) => {
                this.currentUser = user;
            },
            error: (err) => {
                this.currentUser = null;
            },
        });

        this.apiService.getOneCrypto(cryptoId).subscribe({
            next: (crypto: CryptoDetails) => {
                this.crypto = crypto;
                this.isLoading = false;

                this.checkOwnership(crypto);
            },
            error: (err) => {
                this.isLoading = false;
            },
        });
    }

    deleteCrypto() {
        const cryptoId = this.cryptoId;

        this.apiService.deleteCrypto(cryptoId).subscribe(() => {
            this.router.navigate(['/cryptos']);
        });
    }

    private checkOwnership(crypto: CryptoDetails): void {
        this.isOwner = crypto.owner?._id == this.currentUser?._id;
    }
}
