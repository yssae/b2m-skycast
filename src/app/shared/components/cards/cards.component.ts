import { Component, Input } from '@angular/core';

@Component({
  selector: 'sc-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent {
  @Input() width: number = 17;
  @Input() height: number = 17;

  @Input() icon: string = 'thermometer';
  @Input() subtext: string = ''
  @Input() units: string = '';
  @Input() value: string = 'value';

}
