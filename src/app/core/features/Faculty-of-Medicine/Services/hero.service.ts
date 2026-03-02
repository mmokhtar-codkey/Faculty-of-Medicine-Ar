import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { HeroSlide } from '../model/hero-slide.model';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // جلب كل الشرائح من الـ API وتحويلها لموديل HeroSlide
  getAll(): Observable<HeroSlide[]> {
    return this.http.get<{data: any[]}>(`${this.apiUrl}herosections/getall`).pipe(
      map(response => {
        return response.data.map(item => {
          const imageUrl = item.heroAttachments && item.heroAttachments.length > 0
            ? item.heroAttachments[0].url
            : '';

          return {
            id: item.id,
            title: item.title,
            subtitle: item.subTitle,
            description: item.description,
            imageUrl: imageUrl,
            buttonText: 'اكتشف المزيد',   // ممكن نخليها ثابتة أو نجيبها من الـ API لو موجودة
            buttonUrl: '/about',          // نفس الشيء
            position: 'center'            // ثابتة لأن الكومبونانت بيعرضها في المنتصف
          } as HeroSlide;
        });
      })
    );
  }
}
