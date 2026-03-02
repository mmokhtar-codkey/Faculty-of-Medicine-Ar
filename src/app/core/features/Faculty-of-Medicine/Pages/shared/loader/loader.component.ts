import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit, OnDestroy {
  @Input() isVisible: boolean = false;
  @Input() message: string = 'جارٍ التحميل...';
  @Input() duration: number = 10000; // 3 seconds default

  private animationTimeout?: number;

  ngOnInit() {
    // Start animation cycle when component initializes
    if (this.isVisible) {
      this.startAnimationCycle();
    }
  }

  ngOnDestroy() {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }

  private startAnimationCycle() {
    // Reset and restart animation cycle
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
    
    this.animationTimeout = setTimeout(() => {
      if (this.isVisible) {
        this.startAnimationCycle();
      }
    }, this.duration) as unknown as number;
  }

  onVisibilityChange() {
    if (this.isVisible) {
      this.startAnimationCycle();
    } else {
      if (this.animationTimeout) {
        clearTimeout(this.animationTimeout);
      }
    }
  }
}