import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = `http://localhost:5000/api/cryptos`;

  constructor(private http: HttpClient) { }

  getCryptos() {
    return this.http.get(this.baseUrl);
  }
}
