import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ResultsComponent } from './components/results/results.component';
import { DetailsComponent } from './components/details/details.component';
import { AgmCoreModule } from '@agm/core';
import { RoundprogressModule } from 'angular-svg-round-progressbar';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations'

@NgModule({
  declarations: [
    AppComponent,
    ResultsComponent,
    DetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAf8dVq0WH0Mz0h0ef7PAbaAlncbrsRWyc'
    }),
    RoundprogressModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent, ResultsComponent, DetailsComponent]
})
export class AppModule { }
