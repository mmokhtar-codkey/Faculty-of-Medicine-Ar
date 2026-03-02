import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroService } from '../../../Services/hero.service';
import { HeroSlide } from '../../../model/hero-slide.model';

@Component({
  selector: 'app-medicine-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './medicine-hero.component.html',
  styleUrls: ['./medicine-hero.component.css']
})
export class MedicineHeroComponent implements OnInit, OnDestroy {
  @Input() autoPlay = true;
  @Input() autoPlayInterval = 5000;
  @Input() buttonText = 'اكتشف المزيد';
  @Input() buttonRoute = '/about';

  slides: HeroSlide[] = [];
  currentSlideIndex = 0;
  isHovered = false;
  isLoading = true;
  private autoPlayTimer: any;
  private preloadImages: HTMLImageElement[] = [];

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.loadSlides();
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
    this.cancelPreload();
  }

  private loadSlides(): void {
    this.heroService.getAll().subscribe(slides => {
      this.slides = slides;
      this.preloadImagesOnScreen();
    });
  }

  private preloadImagesOnScreen(): void {
    // Preload images to avoid lazy loading delay
    this.slides.forEach((slide, index) => {
      if (slide.imageUrl) {
        const img = new Image();
        img.onload = () => {
          // Check if all images are loaded
          this.checkAllImagesLoaded();
        };
        img.onerror = () => {
          // Continue even if some images fail to load
          this.checkAllImagesLoaded();
        };
        img.src = slide.imageUrl;
        this.preloadImages.push(img);
      }
    });
    
    // Fallback timeout in case onload doesn't fire
    setTimeout(() => this.isLoading = false, 2000);
  }

  private checkAllImagesLoaded(): void {
    const loadedCount = this.preloadImages.filter(img => img.complete).length;
    if (loadedCount === this.preloadImages.length && this.preloadImages.length > 0) {
      this.isLoading = false;
    }
  }

  private cancelPreload(): void {
    this.preloadImages.forEach(img => {
      img.onload = null;
      img.onerror = null;
    });
    this.preloadImages = [];
  }

  private startAutoPlay(): void {
    this.autoPlayTimer = setInterval(() => {
      if (!this.isHovered) {
        this.nextSlide();
      }
    }, this.autoPlayInterval);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlideIndex = this.currentSlideIndex === 0 
      ? this.slides.length - 1 
      : this.currentSlideIndex - 1;
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
  }

  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }
}