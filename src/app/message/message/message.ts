import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (temErro()) {
      <div class="app-message-error">
        {{ text }}
      </div>
    }
  `,
  styles: [`
    app-message {
      display: contents;
    }
    
    .app-message-error {
      display: block;
      position: absolute;
      bottom: 2px;
      color: #d32f2f;
      font-size: 0.75rem;
      line-height: 1.2;
      padding-left: 0.5rem
    }
  `]
})
export class MessageComponent {

  @Input() error = '';
  @Input() control: FormControl | null = null;
  @Input() text = '';

  temErro(): boolean {
    if (!this.control) {
      return false;
    }
    
    return this.control.hasError(this.error) && (this.control.dirty || this.control.touched);
  }
}