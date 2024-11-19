import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Crypto } from '../../types/crypto';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
})
export class CatalogComponent implements OnInit {
  cryptos: Crypto[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getCryptos().subscribe((c) => {
      this.cryptos = c;
    });
  };
}