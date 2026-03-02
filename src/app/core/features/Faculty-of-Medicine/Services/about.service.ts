import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { AboutUniversity, Member } from '../model/about.model';

@Injectable({
  providedIn: 'root'
})
export class AboutService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // جلب بيانات "عن الكلية"
  getAboutUniversity(): Observable<AboutUniversity[]> {
    return this.http.get<{data: AboutUniversity[]}>(`${this.apiUrl}about/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب عضو هيئة تدريس واحد بالـ id
  getMemberById(id: string): Observable<Member | undefined> {
    return this.getAllMembers().pipe(
      map(members => members.find(m => m.id === id))
    );
  }

  // جلب كل أعضاء هيئة التدريس
  getAllMembers(): Observable<Member[]> {
    return this.http.get<{data: Member[]}>(`${this.apiUrl}member/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب أعضاء حسب نوعهم (عميد، قطاع، قسم …)
  getMembersByType(type: string): Observable<Member[]> {
    return this.getAllMembers().pipe(
      map(members => members.filter(m => m.memberType === type))
    );
  }

  // جلب عميد الكلية
  getPresident(): Observable<Member | undefined> {
    return this.getAllMembers().pipe(
      map(members => members.find(m => m.isPresident))
    );
  }
}
