import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { DeanSpeech } from '../model/dean-info.model';

@Injectable({
  providedIn: 'root'
})
export class DeanSpeechService {
  private apiUrl = environment.apiUrl + 'deanspeechs';

  constructor(private http: HttpClient) {}

  // GET all speeches
  getAll(): Observable<DeanSpeech[]> {
    return this.http.get<{data: DeanSpeech[]}>(`${this.apiUrl}/getall`).pipe(
      map(response => response.data)
    );
  }

  // GET by id
  getById(id: string): Observable<DeanSpeech> {
    return this.http.get<DeanSpeech>(`${this.apiUrl}/${id}`);
  }
}
