import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Crypto, CryptoDetails } from './types/crypto';

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

    getOneCrypto(id: string) {
        return this.http.get<CryptoDetails>(`/api/cryptos/${id}/details`);
    }

    searchCryptos(name: string, symbol: string) {
        let params = new HttpParams();

        if (name) {
            params = params.set('name', name);
        }
        if (symbol) {
            params = params.set('symbol', symbol);
        }

        return this.http.get<Crypto[]>('/api/cryptos/search', { params });
    }

    deleteCrypto(id: string) {
        return this.http.delete(`/api/cryptos/${id}/delete`);
    }

    updateCrypto(id: string, name: string, symbol: string, currentPrice: number, description: string, imageUrl: string) {
        const payload = { name, symbol, currentPrice, description, imageUrl };
        return this.http.put<CryptoDetails>(`/api/cryptos/${id}/edit`, payload);
    }

    addComment(cryptoId: string, text: string) {
        const payload = { text };
        return this.http.post<Comment>(`/api/cryptos/${cryptoId}/comments`, payload);
    }

    updateComment(cryptoId: string, commentId: string, text: string) {
        const payload = { text };
        return this.http.put<Comment>(`/api/cryptos/${cryptoId}/comments/${commentId}`, payload);
    }

    deleteComment(cryptoId: string, commentId: string) {
        return this.http.delete(`/api/cryptos/${cryptoId}/comments/${commentId}`);
    }
}
