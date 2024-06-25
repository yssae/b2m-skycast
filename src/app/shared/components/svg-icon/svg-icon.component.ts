import { Component, Input } from '@angular/core';

@Component({
  selector: 'sc-svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.css']
})
export class SvgIconComponent {
  @Input() icon: string = 'search';
  @Input() width: number = 20;
  @Input() height: number = 20;
  @Input() alt: string = 'icon';

  getIconPath(): string {
    return `assets/icons/${this.icon}.svg`;
  }
}
