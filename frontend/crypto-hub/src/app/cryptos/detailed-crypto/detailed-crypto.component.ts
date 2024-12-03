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

    constructor(private apiService: ApiService, private route: ActivatedRoute, private userService: UserService) { }

    ngOnInit(): void {
        const id = this.route.snapshot.params['cryptoId'];

        this.userService.getProfile().subscribe((user) => {
            this.currentUser = user;       
        });

        this.apiService.getOneCrypto(id).subscribe((crypto: CryptoDetails) => {
            this.crypto = crypto;
            this.isLoading = false;
        });
    }

    isOwner(): boolean {
        return this.currentUser?._id == this.crypto?.owner;
    }
}
