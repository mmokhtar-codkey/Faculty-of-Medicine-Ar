import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutService } from '../../Services/about.service';
import { AboutUniversity, Member } from '../../model/about.model';
import { CleanHtmlPipe } from '../../../../pipes/clean-html.pipe'; // ✅ استدعاء الـ Pipe


@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, CleanHtmlPipe],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  about?: AboutUniversity;
  president?: Member;
  members: Member[] = [];

  activeTab = 'about';
  activeAboutSection = 'overview';

  constructor(
    private aboutService: AboutService
  ) {}

  ngOnInit(): void {
    this.loadAboutData();
  }

  private loadAboutData(): void {
    // بيانات عن الكلية
    this.aboutService.getAboutUniversity().subscribe(aboutList => {
      this.about = aboutList[0]; // Load the first about entry
    });

    // عميد الكلية
    this.aboutService.getPresident().subscribe(president => {
      this.president = president;
    });

    // باقي أعضاء الكلية
    this.aboutService.getMembersByType('President').subscribe(allMembers => {
      // نستبعد الرئيس ونجيب باقي الأعضاء
      this.members = allMembers.filter(m => !m.isPresident);
    });

    // أو لو عايز كل الأعضاء من غير فلترة
    this.aboutService.getAllMembers().subscribe(allMembers => {
      this.members = allMembers.filter(m => !m.isPresident);
    });
  }

  switchTab(tabName: string): void {
    this.activeTab = tabName;
  }

  switchAboutSection(sectionName: string): void {
    this.activeAboutSection = sectionName;
  }
}
