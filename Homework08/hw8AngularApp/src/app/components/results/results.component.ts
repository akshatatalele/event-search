import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/service/event.service';
import { EventTable } from 'src/app/model/eventTable';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  eventTableList: EventTable[] = []
  isSearchClicked: boolean = false
  isFavClicked: boolean = false
  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.eventService.messageSource$.subscribe(
      message => {
        this.parseResponseForTable(message)
      }
    )

    this.eventService.isSearchClicked$.subscribe(
      message => {
        this.searchClicked(message)
      }
    )

    this.eventService.isFavClicked$.subscribe(
      message => {
        this.favClicked(message)
      }
    )
  }

  searchClicked(value:any){
    this.isSearchClicked = value
  }

  favClicked(value:any){
    this.isFavClicked = value
  }

  parseResponseForTable(response:any){
    this.eventTableList = []
    for (var key in response) {
      this.eventTableList.push(new EventTable(response[key]['ID'], response[key]['Date'], response[key]['Event'] , response[key]['Category'], response[key]['Venue'], false))
    }
  }

  clickedEventDetails(id:any){
    console.log("clickedEventDetails: ", id)
    this.eventService.getEventsDetails({"id":id}).subscribe(res => {
      console.log(res)

      // ===================Changed=================
      // this.eventService.updateEventDetails(res)
    })
  }

}
