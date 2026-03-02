import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../../../Services/news.service';
import { News } from '../../../model/news.model';
import { slugify } from '../../../../../../utils/slugify';
import { CleanHtmlPipe } from '../../../../../pipes/clean-html.pipe'; // ✅ استدعاء الـ Pipe


@Component({
  selector: 'app-news-details',
  standalone: true,
  imports: [CommonModule, CleanHtmlPipe],
  templateUrl: './news-details.component.html',
  styleUrls: ['./news-details.component.css']
})
export class NewsDetailsComponent implements OnInit {
  news?: News;
  relatedNews: News[] = [];
  previousNews?: News;
  nextNews?: News;
  newsNotFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug']; // نقرأ الـ slug بدل الـ id
      if (slug) {
        this.loadNewsDetails(slug);
      }
    });
  }

  private loadNewsDetails(slug: string): void {
    this.newsService.getNewsBySlug(slug).subscribe(news => {
      if (news) {
        this.news = news;
        this.newsNotFound = false;
        this.loadRelatedData(news.id); // نستخدم الـ id الداخلي لجلب الأخبار المرتبطة
      } else {
        this.newsNotFound = true;
      }
    });
  }

  private loadRelatedData(newsId: string): void {
    this.newsService.getAllNews().subscribe(allNews => {
      // أخبار ذات صلة بنفس التصنيف
      if (this.news?.postCategories?.length) {
        const category = this.news.postCategories[0].categoryName;
        this.relatedNews = allNews.filter(n =>
          n.id !== newsId &&
          n.postCategories.some(c => c.categoryName === category)
        ).slice(0, 5);
      }

      // ترتيب الأخبار حسب التاريخ
      const sorted = [...allNews].sort((a, b) =>
        new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
      );
      const index = sorted.findIndex(n => n.id === newsId);

      this.previousNews = index > 0 ? sorted[index - 1] : undefined;
      this.nextNews = index < sorted.length - 1 ? sorted[index + 1] : undefined;
    });
  }

  getCategoryBadgeClass(categoryName: string): string {
    if (categoryName === 'الأخبار') return 'badge-primary';
    if (categoryName.includes('مؤتمرات')) return 'badge-success';
    if (categoryName.includes('فعاليات') || categoryName.includes('احداث')) return 'badge-warning';
    return 'badge-secondary';
  }

  goToNewsDetails(news: News): void {
    this.router.navigate(['/news', slugify(news.title)]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  goToNewsList(): void {
    this.router.navigate(['/news']);
  }
}
