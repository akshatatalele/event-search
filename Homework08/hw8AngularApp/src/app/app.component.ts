import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EventService } from './service/event.service'
import { EventSearch } from './model/event';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hw8AngularApp';
  message = {}
  category = ['Music', 'Sports', 'Arts & Theatre', 'Film', 'Miscellaneous']
  isCurrentLoc = true

  constructor(private event: EventService) { }

  event1 = new EventSearch("", "All", 10, "Miles", "currentLoc", "")

  ngOnInit(): void {


    // this.event.getEvents().subscribe(res => {
    //   console.log(res)
    //   this.message =res;
    // });

    var data1 = {"client":"maroon 5"}
    this.event.getEvent(data1).subscribe(res => {
      console.log(res)
      this.message =res;
    });
  }

  onSubmit(eventSearch:NgForm, event_:Event){
    // event_.preventDefault();
    event_.preventDefault();
    console.log(this.event1.keyword)
    console.log(this.event1.radioValue)
    // console.log(eventSearch.controls['keyword'].value)
    // console.log(eventSearch.controls['category'].value)
    // console.log(eventSearch.controls['distance'].value)
    // console.log(eventSearch.controls['units'].value)
    // console.log(eventSearch.controls['locationRadio'].setValue('location'));
    // console.log(eventSearch.controls['locationRadio'].value)
    // console.log(eventSearch.controls['locationInput'].value)
  }
}
