import { HttpClient } from '@angular/common/http';
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
}
