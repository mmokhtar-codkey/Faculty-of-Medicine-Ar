import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Contact } from '../model/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // جلب كل بيانات التواصل
  getAllContacts(): Observable<Contact[]> {
    return this.http.get<{data: Contact[]}>(`${this.apiUrl}contacts/getall`).pipe(
      map(response => response.data)
    );
  }

  // جلب بيانات تواصل واحدة بالـ id
  getContactById(id: string): Observable<Contact | undefined> {
    return this.getAllContacts().pipe(
      map(contacts => contacts.find(c => c.id === id))
    );
  }
}
