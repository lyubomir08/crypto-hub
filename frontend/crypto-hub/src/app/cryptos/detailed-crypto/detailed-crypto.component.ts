import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CryptoDetails } from '../../types/crypto';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { UserForAuth } from '../../types/user';
import { UserService } from '../../user/user.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-detailed-crypto',
    standalone: true,
    imports: [LoaderComponent, RouterLink, DatePipe],
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
        const choice = confirm("Are you sure you want to delete that crypto?");
        if (!choice) {
            return;
        }

        const cryptoId = this.cryptoId;

        this.apiService.deleteCrypto(cryptoId).subscribe(() => {
            this.router.navigate(['/cryptos']);
        });
    }

    addComment(inputText: HTMLTextAreaElement) {
        const text = inputText.value.trim();
    
        if (!text) {
            return;
        }
    
        if (!this.crypto) {
            return;
        }
    
        this.apiService.addComment(this.cryptoId, text).subscribe({
            next: (newComment) => {
                if (!this.crypto!.comments) {
                    this.crypto!.comments = [];
                }

                this.crypto!.comments.push(newComment);
    
                inputText.value = '';
    
                console.log(newComment);
            },
            error: (err) => {
                console.error('Failed to add comment:', err);
            },
        });
    }
    

    private checkOwnership(crypto: CryptoDetails): void {
        this.isOwner = crypto.owner?._id == this.currentUser?._id;
    }
}
