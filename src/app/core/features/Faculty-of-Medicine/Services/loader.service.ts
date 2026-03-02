import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private messageSubject = new BehaviorSubject<string>('جارٍ التحميل...');

  public loading$: Observable<boolean> = this.loadingSubject.asObservable();
  public message$: Observable<string> = this.messageSubject.asObservable();

  constructor() {}

  /**
   * Show the loader with optional custom message
   */
  show(message?: string): void {
    if (message) {
      this.messageSubject.next(message);
    }
    this.loadingSubject.next(true);
  }

  /**
   * Hide the loader
   */
  hide(): void {
    this.loadingSubject.next(false);
  }

  /**
   * Update the loading message
   */
  updateMessage(message: string): void {
    this.messageSubject.next(message);
  }

  /**
   * Show loader for a specific duration
   */
  showForDuration(duration: number, message?: string): Promise<void> {
    return new Promise((resolve) => {
      this.show(message);
      setTimeout(() => {
        this.hide();
        resolve();
      }, duration);
    });
  }

  /**
   * Check if loader is currently visible
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }
}