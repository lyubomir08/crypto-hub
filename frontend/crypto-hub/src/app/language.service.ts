import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private availableLanguages = ['en', 'bg'];
    private defaultLanguage = 'en';

    constructor(private translate: TranslateService) {
        this.initLanguage();
    }

    private initLanguage(): void {
        this.translate.addLangs(this.availableLanguages);
        this.translate.setDefaultLang(this.defaultLanguage);

        const savedLang = localStorage.getItem('language');
        const browserLang = this.translate.getBrowserLang();

        const languageToUse = savedLang ?? (browserLang?.match(/en|bg/) ? browserLang : this.defaultLanguage);
        this.setLanguage(languageToUse);
    }

    setLanguage(lang: string): void {
        if (this.availableLanguages.includes(lang)) {
            this.translate.use(lang);
            localStorage.setItem('language', lang);
        }
    }

    getCurrentLanguage(): string {
        return this.translate.currentLang;
    }
}
