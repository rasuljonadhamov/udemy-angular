import {
  Directive,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appLazyLoad]',
  standalone: true,
})
export class LazyLoadDirective implements OnInit {
  @Output() lazyLoad = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.lazyLoad.emit();
          observer.unobserve(this.el.nativeElement);
        }
      });
    }, options);

    observer.observe(this.el.nativeElement);
  }
}
