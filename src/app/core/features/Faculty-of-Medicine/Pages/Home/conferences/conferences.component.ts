import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NewsService } from '../../../Services/news.service';
import { News } from '../../../model/news.model';
import { slugify } from '../../../../../../utils/slugify';

@Component({
  selector: 'app-conference-upcoming',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './conferences.component.html',
  styleUrls: ['./conferences.component.css']
})
export class ConferenceUpcomingComponent implements OnInit {
  @Input() sectionTitle = 'المؤتمرات القادمة';

  conferences: News[] = [];

  constructor(private newsService: NewsService, private router: Router) {}

  ngOnInit(): void {
    this.loadUpcomingConferences();
  }

  private loadUpcomingConferences(): void {
    this.newsService.getAllNews().subscribe(allNews => {
      // فلترة الأخبار حسب الكاتيجوري "مؤتمرات"
      const conferencesOnly = allNews.filter(n =>
        n.postCategories.some(c => c.categoryName.includes('مؤتمرات'))
      );

      // ترتيب حسب التاريخ واختيار آخر 3
      this.conferences = [...conferencesOnly].sort((a, b) =>
        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      ).slice(0, 3);
    });
  }

  goToConferenceDetails(conference: News): void {
    // التوجيه بالـ slug بدل الـ id
    this.router.navigate(['/news', slugify(conference.title)]);
  }
}
