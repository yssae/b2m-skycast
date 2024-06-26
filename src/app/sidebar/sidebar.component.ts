import { Component, OnInit, Input } from '@angular/core';
import { WeatherService } from '../shared/services/weather.service';
import { WeatherData } from '../shared/models/weather';
import { Subject, debounceTime, distinctUntilChanged, startWith, switchMap, takeUntil } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sc-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  private ngUnsubscribe = new Subject<void>();  
  @Input() searchControl: FormControl = new FormControl('');

  constructor(public weatherService: WeatherService) {}

  public ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.ngUnsubscribe),
      switchMap((value) => this.weatherService.setNewLocation(value))
    ).subscribe()
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }

  public toggleToCelsius() {
    this.weatherService.isInCelsius$.next(true);
  }

  public toggleToFahrenheit() {
    this.weatherService.isInCelsius$.next(false);
  }


}
