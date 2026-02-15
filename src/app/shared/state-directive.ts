import { Directive, ElementRef, HostListener, Input, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appState]',
  standalone: true
})
export class StateDirective {

  @Input() maxLength = 2;

  constructor(
    private el: ElementRef<HTMLInputElement>,
    @Optional() private control: NgControl
  ) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const input = this.el.nativeElement;
    const key = event.key;

    if (
      key === 'Backspace' || key === 'Tab' || key === 'Enter' || 
      key === 'Delete' || key.includes('Arrow') ||
      event.ctrlKey || event.metaKey
    ) {
      return;
    }

    if (input.value.length >= this.maxLength && input.selectionStart === input.selectionEnd) {
      event.preventDefault();
      return;
    }

    const allowedRegex = /^[a-zA-Z\u00C0-\u00FF]$/; 
    if (!allowedRegex.test(key)) {
      event.preventDefault();
    }
  }

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;
    let value = input.value;

    let newValue = value
      .replace(/[^a-zA-Z\u00C0-\u00FF]/g, '')
      .slice(0, this.maxLength)
      .toUpperCase();

    if (value !== newValue) {
      input.value = newValue;
      
      if (this.control?.control) {
        this.control.control.setValue(newValue);
      }
    }
  }
}