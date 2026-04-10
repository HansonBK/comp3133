import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
  standalone: true
})
export class AutofocusDirective implements AfterViewInit {
  private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);

  ngAfterViewInit() {
    queueMicrotask(() => this.elementRef.nativeElement.focus());
  }
}
