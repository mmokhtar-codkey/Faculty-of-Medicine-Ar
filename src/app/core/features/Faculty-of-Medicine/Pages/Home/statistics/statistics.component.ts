import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../../Services/statistics.service';
import { Statistic } from '../../../model/statistics.model';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  @Input() sectionTitle = 'إحصائيات الكلية';

  statistics: Statistic[] = [];

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  trackByFn(index: number, item: Statistic): any {
    return item.id;
  }

  private loadStatistics(): void {
    this.statisticsService.getAll().subscribe(res => {
      this.statistics = res.filter(stat => stat.isActive); // نعرض بس الـ active
    });
  }
}
