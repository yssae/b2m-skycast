import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';

import { WeatherFormatPipe } from './pipes/weather-format.pipe'; 

import { InputComponent } from './components/input/input.component';
import { SvgIconComponent } from './components/svg-icon/svg-icon.component';
import { CardsComponent } from './components/cards/cards.component';

@NgModule({
  declarations: [
    InputComponent,
    SvgIconComponent,
    CardsComponent,
    WeatherFormatPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    InputComponent,
    SvgIconComponent,
    CardsComponent,
    WeatherFormatPipe,
    MaterialModule
  ]
})
export class SharedModule { }
