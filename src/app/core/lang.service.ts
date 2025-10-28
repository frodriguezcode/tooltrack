import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


type Lang = 'es' | 'en';
const KEY = 'tooltrack_lang';

function isLang(v: any): v is Lang {
  return v === 'es' || v === 'en';
}

@Injectable({ providedIn: 'root' })
export class LangService {
  private t = inject(TranslateService);

  init() {
   const saved = localStorage.getItem(KEY);
    const browser = (navigator.language ?? 'es').slice(0, 2).toLowerCase();

    // Normaliza y decide el idioma final como 'es' | 'en'
    const candidate = saved && isLang(saved) ? saved : (isLang(browser) ? (browser as Lang) : 'es');
    const lang: Lang = candidate;                 // <-- ya es del tipo correcto

    this.use(lang);
  }

  use(lang: 'es' | 'en') {
    this.t.use(lang);
    localStorage.setItem(KEY, lang);
    // Actualiza el atributo lang de <html> para accesibilidad/SEO
    document.documentElement.lang = lang;
  }

  current(): 'es' | 'en' {
    return (this.t.currentLang as any) || 'es';
  }
}
