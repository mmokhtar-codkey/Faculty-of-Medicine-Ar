import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceDetail } from '../../model/service.model';
import { ServiceService } from '../../Services/service.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  service?: ServiceDetail;
  services: ServiceDetail[] = [];
  isListView: boolean = false;
  activeTab: string = 'departments';
  activeAboutSection: string = 'overview';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug']; // نقرأ الـ slug بدل الـ id
      if (slug) {
        this.isListView = false;
        this.loadServiceData(slug);
      } else {
        this.isListView = true;
        this.loadServices();
      }
    });
  }

  private loadServiceData(slug: string): void {
    this.serviceService.getBySlug(slug).subscribe({
      next: (serviceDetail) => {
        this.service = serviceDetail;
      },
      error: (error) => {
        console.error('Error loading service:', error);
        this.service = undefined;
      }
    });
  }

  private loadServices(): void {
    this.serviceService.getAll().subscribe({
      next: (services) => {
        this.services = services.filter(s => s.isActive);
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.services = [];
      }
    });
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  trackByFn(index: number, item: ServiceDetail): any {
    return item.id;
  }

  onServiceClick(service: ServiceDetail): void {
    if (service && service.title) {
      this.router.navigate(['/services', service.title]); // نوجّه بالـ slug
    }
  }
  
  formatDescription(description: string): string {
  if (!description) return '';

  // لو فيه جدول العيادات الخارجية
  if (description.includes('جدول العيادات الخارجية')) {
    const parts = description.split('جدول العيادات الخارجية');
    const tableText = parts[1].trim();
    const lines = tableText.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split('\t');
    const rows = lines.slice(1).map(line => line.split('\t'));

    let tableHtml = '<table class="table table-bordered table-striped">';
    tableHtml += '<thead><tr>';
    headers.forEach(h => tableHtml += `<th>${h}</th>`);
    tableHtml += '</tr></thead><tbody>';
    rows.forEach(row => {
      tableHtml += '<tr>';
      row.forEach(cell => tableHtml += `<td>${cell}</td>`);
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table>';

    return parts[0] + '<br><br><strong>جدول العيادات الخارجية</strong><br>' + tableHtml;
  }

  // لو فيه كلمة "التحاليل الطبية المتوفرة" أو "الأشعات التشخيصية المتوفرة"
  if (description.includes('التحاليل الطبية المتوفرة') || description.includes('الأشعات التشخيصية المتوفرة')) {
    const lines = description.split('\n').filter(line => line.trim() !== '');
    let listHtml = '<ul class="styled-list">';
    lines.forEach(line => {
      if (!line.includes('المتوفرة') && !line.includes('خدمات')) {
        listHtml += `<li>${line}</li>`;
      }
    });
    listHtml += '</ul>';
    return description.split('\n')[0] + '<br><br>' + listHtml;
  }

  return description;
}


}
