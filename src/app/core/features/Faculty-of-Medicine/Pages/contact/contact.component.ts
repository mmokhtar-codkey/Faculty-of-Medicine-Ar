import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../Services/contact.service';
import { Contact } from '../../model/contact.model';
import { SafeUrlPipe } from "../../../../pipes/safe-url.pipe";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contact?: Contact;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadContactInfo();
  }

  private loadContactInfo(): void {
    this.contactService.getAllContacts().subscribe(contacts => {
      if (contacts && contacts.length > 0) {
        this.contact = contacts[0]; // أول عنصر من الـ API
      }
    });
  }
}
