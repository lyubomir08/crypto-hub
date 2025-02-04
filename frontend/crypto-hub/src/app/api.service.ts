import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Crypto, CryptoDetails, LivePrices } from './types/crypto';
import { Comment } from './types/comment';
import { map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private coingeckoUrl = 'https://api.coingecko.com/api/v3';

    constructor(private http: HttpClient) { }

    // getMessages(sender: string, recipient: string) {
    //     return this.http.get(`/api/chat/messages`, { params: { senderId: sender, recipientId: recipient } });
    // }

    // sendMessage(sender: string, recipient: string, content: string) {
    //     return this.http.post(`/api/chat/send`, { senderId: sender, recipientId: recipient, content });
    // }

    getLivePrices(ids: string[], vsCurrency: string = 'usd') {
        const idsParam = ids.join(',');
        return this.http.get<LivePrices>(`${this.coingeckoUrl}/simple/price`, {
            params: {
                ids: idsParam,
                vs_currencies: vsCurrency,
            },
        });
    }

    getHistoricalPrices(cryptoName: string, days: number = 30) {
        const formattedCryptoName = cryptoName.toLowerCase();
        const url = `${this.coingeckoUrl}/coins/${formattedCryptoName}/market_chart`;
        const params = new HttpParams().set('vs_currency', 'usd').set('days', days.toString());
        
        return this.http.get<any>(url, { params }).pipe(
            map((response: any) =>
                response.prices.map(([timestamp, price]: [number, number]) => ({
                    date: new Date(timestamp).toLocaleDateString(),
                    price,
                }))
            )
        );
    }
    
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
