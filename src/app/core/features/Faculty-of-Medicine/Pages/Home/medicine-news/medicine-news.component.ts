import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NewsService } from '../../../Services/news.service';
import { News } from '../../../model/news.model';
import { slugify } from '../../../../../../utils/slugify';

@Component({
  selector: 'app-medicine-news',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './medicine-news.component.html',
  styleUrls: ['./medicine-news.component.css']
})
export class MedicineNewsComponent implements OnInit {
  @Input() showTitle = true;
  @Input() sectionTitle = 'أحدث الأخبار';
  @Input() itemsPerView = 3;
  @Input() isRTL = true;

  newsItems: News[] = [];
  visibleItems: News[] = [];

  constructor(private newsService: NewsService, private router: Router) {}

  ngOnInit(): void {
    this.loadNews();
  }

  trackByFn(index: number, item: News): any {
    return item.id;
  }

  private loadNews(): void {
    this.newsService.getAllNews().subscribe(news => {
      // ترتيب الأخبار حسب التاريخ واختيار آخر N حسب itemsPerView
      this.newsItems = [...news].sort((a, b) =>
        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      ).slice(0, this.itemsPerView);

      this.visibleItems = this.newsItems;
    });
  }

  getDateParts(dateString: string): { day: string; month: string } {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString(),
      month: date.toLocaleString('ar-EG', { month: 'short' })
    };
  }

  goToNewsDetails(news: News): void {
    // التوجيه بالـ slug بدل الـ id
    this.router.navigate(['/news', slugify(news.title)]);
  }
}
