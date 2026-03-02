import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ServiceService } from '../../../Services/service.service';
import { ServiceDetail } from '../../../model/service.model';
import { slugify } from '../../../../../../utils/slugify';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  @Input() sectionTitle = 'خدمات الكلية';
  @Input() showTitle = true;
  @Input() showAllServicesButton = true;
  @Input() allServicesText = 'جميع الخدمات';
  @Input() allServicesUrl = '/services';
  
  @Output() serviceClicked = new EventEmitter<ServiceDetail>();
  @Output() allServicesClicked = new EventEmitter<void>();

  services: ServiceDetail[] = [];

  constructor(
    private serviceService: ServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.serviceService.getById(id).subscribe(service => {
          if (service) {
            this.services = [service];
          }
        });
      } else {
        this.loadServices();
      }
    });
  }

  trackByFn(index: number, item: ServiceDetail): any {
    return item.id;
  }

 private loadServices(): void {
  this.serviceService.getAll().subscribe(services => {
    // نعرض فقط الخدمات الفعالة
    this.services = services.filter(s => s.isActive);

    // لو عايز تخلي زرار "جميع الخدمات" يوجّه لأول خدمة مثلاً
    if (this.services.length > 0) {
      this.allServicesUrl = '/services/' + slugify(this.services[0].title);
    } else {
      this.allServicesUrl = '/services'; // fallback لو مفيش خدمات
    }
  });
}


  onServiceClick(service: ServiceDetail): void {
    this.serviceClicked.emit(service);
    if (service && service.title != null && service.title !== '') {
      this.router.navigate(['/services', slugify(service.title)]);
    }
  }

  onAllServicesClick(): void {
    this.allServicesClicked.emit();
  }
}

