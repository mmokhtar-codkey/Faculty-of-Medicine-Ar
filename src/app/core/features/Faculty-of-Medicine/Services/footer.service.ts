import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Footer } from '../model/footer.model';

@Injectable({
  providedIn: 'root'
})
export class FooterService {
  private apiUrl = environment.apiUrl + 'footer';

  constructor(private http: HttpClient) {}

  getFooter(): Observable<Footer> {
    return this.http.get<{data: Footer}>(`${this.apiUrl}/get`).pipe(
      map(response => response.data)
    );
  }
}
