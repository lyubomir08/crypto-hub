import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Crypto } from './types/crypto';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private http: HttpClient) { }

    getCryptos() {
        return this.http.get<Crypto[]>(`/api/cryptos`);
    }

    addCrypto(name: string, symbol: string, currentPrice: number, description: string, imageUrl: string) {
        const payload = { name, symbol, currentPrice, description, imageUrl };
        return this.http.post<Crypto>('/api/cryptos/create', payload);
    }

    searchCryptos(name?: string, symbol?: string) {
        let params = new HttpParams();
        
        if (name) {
            params = params.set('name', name);
        }
        if (symbol) {
            params = params.set('symbol', symbol);
        }

        return this.http.get<Crypto[]>('/api/cryptos/search', { params });
    }
}
