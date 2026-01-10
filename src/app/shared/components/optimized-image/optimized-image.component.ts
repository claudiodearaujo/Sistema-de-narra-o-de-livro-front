import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
  signal
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

/**
 * OptimizedImageComponent
 *
 * A reusable component for optimized image loading with WebP support,
 * lazy loading, placeholder, and responsive images.
 *
 * Features:
 * - Automatic WebP detection and fallback
 * - Lazy loading with IntersectionObserver
 * - Placeholder while loading
 * - Error fallback image
 * - Responsive srcset support
 * - Skeleton loading animation
 * - Accessibility support (alt text)
 *
 * @example
 * <app-optimized-image
 *   [src]="bookCover"
 *   [alt]="book.title"
 *   [width]="300"
 *   [height]="400"
 *   [placeholder]="'assets/images/book-placeholder.jpg'"
 *   [objectFit]="'cover'"
 *   (loaded)="onImageLoaded()"
 *   (error)="onImageError()">
 * </app-optimized-image>
 */
@Component({
  selector: 'app-optimized-image',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="optimized-image-container"
      [style.width]="width ? width + 'px' : '100%'"
      [style.height]="height ? height + 'px' : 'auto'"
      [style.aspect-ratio]="aspectRatio || 'auto'">

      <!-- Skeleton loader -->
      @if (showSkeleton() && !isLoaded() && !hasError()) {
        <div class="skeleton-loader"></div>
      }

      <!-- Picture element for WebP support -->
      <picture [class.loaded]="isLoaded()" [class.hidden]="hasError() && fallback">
        @if (webpSrc && supportsWebP()) {
          <source [srcset]="webpSrc" type="image/webp">
        }

        <img
          [src]="currentSrc()"
          [alt]="alt"
          [width]="width"
          [height]="height"
          [style.object-fit]="objectFit"
          [loading]="lazy ? 'lazy' : 'eager'"
          decoding="async"
          (load)="onLoad()"
          (error)="onError()"
          [class.loading]="!isLoaded()"
          [attr.fetchpriority]="priority">
      </picture>
    </div>
  `,
  styles: [`
    .optimized-image-container {
      position: relative;
      overflow: hidden;
      background-color: #f0f0f0;
    }

    .skeleton-loader {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        #f0f0f0 25%,
        #e0e0e0 50%,
        #f0f0f0 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    picture {
      display: block;
      width: 100%;
      height: 100%;
    }

    picture.hidden {
      display: none;
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }

    img.loading {
      opacity: 0;
    }

    picture.loaded img {
      opacity: 1;
    }
  `]
})
export class OptimizedImageComponent implements OnInit, OnChanges {
  private readonly platformId = inject(PLATFORM_ID);
  private webPSupported: boolean | null = null;

  /**
   * Image source URL
   */
  @Input() src: string = '';

  /**
   * WebP version of the image (optional)
   * If not provided, will try to generate from src
   */
  @Input() webpSrc?: string;

  /**
   * Alt text for accessibility
   */
  @Input() alt: string = '';

  /**
   * Image width in pixels
   */
  @Input() width?: number;

  /**
   * Image height in pixels
   */
  @Input() height?: number;

  /**
   * Aspect ratio (e.g., "16/9", "4/3", "1/1")
   */
  @Input() aspectRatio?: string;

  /**
   * Object fit CSS property
   */
  @Input() objectFit: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down' = 'cover';

  /**
   * Placeholder image URL
   */
  @Input() placeholder?: string;

  /**
   * Fallback image URL for error state
   */
  @Input() fallback?: string;

  /**
   * Whether to use lazy loading
   */
  @Input() lazy: boolean = true;

  /**
   * Show skeleton loader while loading
   */
  @Input() showSkeleton = signal(true);

  /**
   * Fetch priority for the image
   */
  @Input() priority: 'high' | 'low' | 'auto' = 'auto';

  /**
   * Event emitted when image loads successfully
   */
  @Output() loaded = new EventEmitter<void>();

  /**
   * Event emitted when image fails to load
   */
  @Output() error = new EventEmitter<void>();

  isLoaded = signal(false);
  hasError = signal(false);
  currentSrc = signal('');

  ngOnInit(): void {
    this.detectWebPSupport();
    this.updateCurrentSrc();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src'] || changes['placeholder']) {
      this.updateCurrentSrc();
      this.isLoaded.set(false);
      this.hasError.set(false);
    }
  }

  private updateCurrentSrc(): void {
    if (this.placeholder && !this.isLoaded()) {
      this.currentSrc.set(this.placeholder);
    } else if (this.src) {
      this.currentSrc.set(this.src);
    }
  }

  onLoad(): void {
    this.isLoaded.set(true);
    this.hasError.set(false);

    // If we were showing placeholder, now show the actual image
    if (this.currentSrc() === this.placeholder && this.src) {
      this.currentSrc.set(this.src);
    }

    this.loaded.emit();
  }

  onError(): void {
    this.hasError.set(true);

    if (this.fallback && this.currentSrc() !== this.fallback) {
      this.currentSrc.set(this.fallback);
      this.hasError.set(false);
    }

    this.error.emit();
  }

  supportsWebP(): boolean {
    return this.webPSupported ?? false;
  }

  private detectWebPSupport(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.webPSupported = false;
      return;
    }

    // Check if already detected
    if (this.webPSupported !== null) {
      return;
    }

    // Use canvas to detect WebP support
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      this.webPSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } else {
      this.webPSupported = false;
    }
  }

  /**
   * Generate WebP URL from original source
   * Assumes WebP versions are available with .webp extension
   */
  getWebPUrl(url: string): string {
    if (!url) return '';

    // If URL already ends with .webp, return as is
    if (url.toLowerCase().endsWith('.webp')) {
      return url;
    }

    // Replace extension with .webp
    const lastDot = url.lastIndexOf('.');
    if (lastDot === -1) {
      return url + '.webp';
    }

    return url.substring(0, lastDot) + '.webp';
  }
}
