import { Component, OnInit } from '@angular/core';
import { EventService } from './service/event.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hw8AngularApp';
  message = {}

  constructor(private event: EventService) { }

  ngOnInit(): void {
    // this.event.getEvents().subscribe(res => {
    //   console.log(res)
    //   this.message =res;
    // });

    this.event.getEvent("Maroon 5").subscribe(res => {
      console.log(res)
      this.message =res;
    });
  }

}
