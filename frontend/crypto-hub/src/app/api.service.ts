import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Crypto } from './types/crypto';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  getCryptos() {
    const { apiUrl } = environment;
    return this.http.get<Crypto[]>(`${apiUrl}/cryptos`);
  }
}
