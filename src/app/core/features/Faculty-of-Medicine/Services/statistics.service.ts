import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Statistic } from '../model/statistics.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = environment.apiUrl + 'statistics';

  constructor(private http: HttpClient) {}

  // GET all statistics
  getAll(): Observable<Statistic[]> {
    return this.http.get<{data: Statistic[]}>(`${this.apiUrl}/getall`).pipe(
      map(response => response.data)
    );
  }

  // GET by id
  getById(id: string): Observable<Statistic> {
    return this.http.get<Statistic>(`${this.apiUrl}/${id}`);
  }
}
