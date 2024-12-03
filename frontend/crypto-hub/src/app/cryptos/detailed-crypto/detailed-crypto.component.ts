import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { ActivatedRoute } from '@angular/router';
import { CryptoDetails } from '../../types/crypto';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { UserForAuth } from '../../types/user';
import { UserService } from '../../user/user.service';

@Component({
    selector: 'app-detailed-crypto',
    standalone: true,
    imports: [LoaderComponent],
    templateUrl: './detailed-crypto.component.html',
    styleUrl: './detailed-crypto.component.css'
})
export class DetailedCryptoComponent implements OnInit {
    crypto: CryptoDetails | null = null;
    isLoading: boolean = true;
    currentUser: UserForAuth | null = null;

    isOwner: boolean = false;

    constructor(private apiService: ApiService, private route: ActivatedRoute, private userService: UserService) { }

    ngOnInit(): void {
        const id = this.route.snapshot.params['cryptoId'];
        
        // if(this.userService.user) {
        //     this.currentUser = this.userService.user?._id as any;
        // }
        this.userService.getProfile().subscribe({
            next: (user) => {
                this.currentUser = user;
            },
            error: (err) => {
                console.error('Error fetching user profile:', err.message);
                this.currentUser = null;
            },
        });

        this.apiService.getOneCrypto(id).subscribe({
            next: (crypto: CryptoDetails) => {
                this.crypto = crypto;
                this.isLoading = false;

                this.checkOwnership(crypto);
            },
            error: (err) => {
                console.error('Error fetching crypto details:', err.message);
                this.isLoading = false;
            },
        });
    }

    private checkOwnership(crypto: CryptoDetails): void {
        this.isOwner = crypto.owner?._id == this.currentUser?._id;
    }
}
