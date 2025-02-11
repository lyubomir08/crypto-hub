import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private currentLang = new BehaviorSubject<string>(localStorage.getItem('language') || 'en');
    private translations: any = {};

    constructor(private http: HttpClient) {
        this.loadTranslations(this.currentLang.value);
    }

    get currentLanguage() {
        return this.currentLang.asObservable();
    }

    changeLanguage(lang: string) {
        if (lang !== this.currentLang.value) {
            localStorage.setItem('language', lang);
            this.loadTranslations(lang);
            this.currentLang.next(lang);
        }
    }

    private loadTranslations(lang: string) {
        this.http.get(`/assets/i18n/${lang}.json`).pipe(
            tap(translations => {
                this.translations = translations;
                this.currentLang.next(lang);
            })
        ).subscribe();
    }

    translate(key: string): string {
        return key.split('.').reduce((acc, part) => acc?.[part] ?? key, this.translations);
    }
}
