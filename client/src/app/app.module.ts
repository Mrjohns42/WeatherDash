import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import {AngularFittextModule} from 'angular-fittext';

import { AppComponent } from './app.component';
import { WeatherdashComponent } from './weatherdash/weatherdash.component';
import { APIService } from './api.service';

@NgModule({
  declarations: [
    AppComponent,
    WeatherdashComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFittextModule
  ],
  providers: [APIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
