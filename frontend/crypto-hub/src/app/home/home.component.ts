import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Crypto } from '../types/crypto';
import { LoaderComponent } from '../shared/loader/loader.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoaderComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  lastThreeCryptos: Crypto[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchLastThreeCryptos();
  }

  fetchLastThreeCryptos() {
    this.isLoading = true;
    this.apiService.getLastThreeCryptos().subscribe({
      next: (data) => {
        this.lastThreeCryptos = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load cryptocurrencies.';
        this.isLoading = false;
      },
    });
  }
}
