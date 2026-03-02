import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { LoaderComponent } from './core/features/Faculty-of-Medicine/Pages/shared/loader/loader.component';
import { LoaderService } from './core/features/Faculty-of-Medicine/Services/loader.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {

  protected title = 'كلية الطب - جامعة الاقصر';
  showScrollButton = false;

  isLoading = false;
  loadingMessage = 'جارٍ التحميل...';
  private destroy$ = new Subject<void>();
  
  constructor(private loaderService: LoaderService) {}

  ngOnInit() {
    // Show loader automatically on page load
    this.loaderService.showForDuration(3000, 'جاري تحميل الموقع...');

    // Subscribe to loader service
    this.loaderService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });

    this.loaderService.message$
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => {
        this.loadingMessage = message;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.pageYOffset > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showLoader() {
    this.loaderService.showForDuration(4000, 'جارٍ التحميل...');
  }

  showLoaderWithMessage() {
    this.loaderService.showForDuration(5000, 'جارٍ تحميل بيانات الطلاب...');
  }
}
