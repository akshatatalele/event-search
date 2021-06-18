import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/service/event.service';
import { EventTable } from 'src/app/model/eventTable';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  animations: [
    trigger('Leave', [
      transition('void => false', [
        style({ transform: 'translateX(100%)' }),
        animate('0.3s')
      ])
    ])
  ]
})
export class ResultsComponent implements OnInit {

  eventTableList: EventTable[] = []
  isSearchClicked: boolean = false
  isFavClicked: boolean = false
  animate = true
  disableDetailsButton = true
  isDetailsButtonClicked = false
  alertClass = "alert alert-danger"
  alertText = "A simple danger alert—check it out!"


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

    this.eventService.displayEventDetails$.subscribe(
      message => {
        this.displayDetails(message)
      }
    )

  }


  displayDetails(value:any){
      this.animate = value
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
    this.eventService.changeIsSearchClicked(true);
    if(this.isDetailsButtonClicked != true){
      this.disableDetailsButton = true
    }
  }

  clickedEventDetails(id:any){
    console.log("clickedEventDetails: ", id)
    this.eventService.getEventsDetails({"id":id}).subscribe(res => {
      console.log(res)
      // ===================Changed=================
      this.eventService.updateEventDetails(res)
      this.disableDetailsButton = false
    })
  }

  AddToFavorites(instance:any){
    console.log("Added to Favourite", instance);
    instance.isFavorite = !instance.isFavorite

  }

  clickOnDetails(){
    this.isDetailsButtonClicked = true
    this.eventService.changeIsSearchClicked(false);
    this.eventService.changeDisplayEventDetails(true)
  }

}
