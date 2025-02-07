import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = new BehaviorSubject<string>('en');
  private translations: any = {};

  constructor(private http: HttpClient) {
    this.loadLanguage(this.currentLang.value);
  }

  get currentLanguage(): Observable<string> {
    return this.currentLang.asObservable();
  }

  changeLanguage(lang: string): void {
    if (lang !== this.currentLang.value) {
      this.loadLanguage(lang);
    }
  }

  private loadLanguage(lang: string): void {
    this.http.get(`/assets/i18n/${lang}.json`).pipe(
      tap((translations) => {
        this.translations = translations;
        this.currentLang.next(lang);
      })
    ).subscribe();
  }

  translate(key: string): string {
    return key.split('.').reduce((acc, part) => acc?.[part] ?? key, this.translations);
  }
}
