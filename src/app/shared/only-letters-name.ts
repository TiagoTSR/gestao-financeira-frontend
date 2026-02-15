import { Directive, ElementRef, HostListener, Input, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOnlyLettersName]',
  standalone: true
})
export class OnlyLettersName {
  @Input() maxLength: number = 100;

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
      key === 'Delete' || key === 'ArrowLeft' || key === 'ArrowRight' ||
      event.ctrlKey || event.metaKey
    ) {
      return;
    }

    if (input.value.length >= this.maxLength && input.selectionStart === input.selectionEnd) {
      event.preventDefault();
      return;
    }
 
    const allowedRegex = /^[\p{L}\s\-']$/u;
    if (!allowedRegex.test(key)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.el.nativeElement;
    let value = input.value;

    let newValue = value
      .replace(/[^\p{L}\s\-']/gu, '') 
      .replace(/^\s+/, '')            
      .replace(/\s{2,}/g, ' ')        
      .slice(0, this.maxLength);      

    newValue = newValue.replace(
      /(^|[\s\-'])(\p{L})/gu,
      (match, sep, char) => sep + char.toUpperCase()
    );

    if (value !== newValue) {
      input.value = newValue;

      if (this.control && this.control.control) {
        this.control.control.setValue(newValue);
      }
    }
  }
}