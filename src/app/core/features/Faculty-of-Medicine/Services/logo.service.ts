import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Logo } from '../model/logo.model';

@Injectable({
  providedIn: 'root'
})
export class LogoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // جلب كل اللوجوهات
  getAllLogos(): Observable<Logo[]> {
    return this.http.get<{data: Logo[]}>(`${this.apiUrl}logos/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب لوجو واحد بالـ id
  getLogoById(id: string): Observable<Logo | undefined> {
    return this.getAllLogos().pipe(
      map(logos => logos.find(l => l.id === id))
    );
  }

  // جلب أول لوجو (الافتراضي)
  getDefaultLogo(): Observable<Logo | undefined> {
    return this.getAllLogos().pipe(
      map(logos => logos.length > 0 ? logos[0] : undefined)
    );
  }
}
