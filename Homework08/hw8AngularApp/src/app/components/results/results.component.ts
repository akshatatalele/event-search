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
  favTableList: EventTable[] = []
  favIDList:string[] = []
  clickedEvent = new EventTable("", "", "", "", "", false)

  isSearchClicked: boolean = false
  isFavClicked: boolean = false
  animate = true
  disableDetailsButton = true
  isDetailsButtonClicked = false
  alertClass = ""
  alertText = ""


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

    this.eventService._favouritesDataObservable$.subscribe(
      message =>{
        this.parseFavListForTable(message)
      }
    )

    this.eventService.favoriteEvent$.subscribe(
      msg => {
        this.getClickedEvent(msg)
      }
    )
  }

  getClickedEvent(value:any){
    this.clickedEvent = value
  }

  parseFavListForTable(response:any){
    console.log("Parse new fav list - clicked event:", this.clickedEvent)
    this.favTableList = []
    for (var key in response) {
      this.favTableList.push(new EventTable(response[key]['ID'], response[key]['Date'], response[key]['Name'] , response[key]['Category'], response[key]['Venue'], true))

      if(!this.favIDList.includes(response[key]['ID'])){
        this.favIDList.push(response[key]['ID'])
      }

      for (var key1 in this.eventTableList){
        if(response[key]["ID"] == this.eventTableList[key1]["ID"]){
          this.eventTableList[key1]["isFavorite"] = true
        }else{
          this.eventTableList[key1]["isFavorite"] = false
        }

        if(this.eventTableList[key1]["ID"] == this.clickedEvent.ID){
          this.eventTableList[key1]["isFavorite"] = this.clickedEvent.isFavorite
        }
      }
    }
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
    this.callFavouritesData()

    if ("error" in response){
      if(response['error'] == "Failed to get event details"){
        this.alertClass = "alert alert-danger"
        this.alertText = response['error']
      }else if(response['error'] == "No records"){
        this.alertClass = "alert alert-warning"
        this.alertText = "No Records"
      }else if(response['error'] == "API call failed"){
        this.alertClass = "alert alert-danger"
        this.alertText = response['error']
      }

    }else{
      for (var key in response) {
        if (this.favIDList.includes(response[key]['ID'])){
          this.eventTableList.push(new EventTable(response[key]['ID'], response[key]['Date'], response[key]['Event'] , response[key]['Category'], response[key]['Venue'], true))
        }else{
          this.eventTableList.push(new EventTable(response[key]['ID'], response[key]['Date'], response[key]['Event'] , response[key]['Category'], response[key]['Venue'], false))
        }

      }
      this.eventService.changeIsSearchClicked(true);
    }


    if(this.isDetailsButtonClicked != true){
      this.disableDetailsButton = true
    }
  }

  clickedEventDetails(instance:EventTable){
    console.log("clickedEventDetails: ", instance)
    this.eventService.changeFavoriteEvent(instance)
    this.eventService.getEventsDetails({"id":instance.ID}).subscribe(res => {
      console.log(res)
      // ===================Changed=================
      this.eventService.updateEventDetails(res)
      this.eventService.changeIsFavClicked(false);
      this.disableDetailsButton = false
    }, error => {
      this.eventService.updateEventDetails(JSON.parse('{"error":"API call failed"}'))
      this.eventService.changeIsFavClicked(false);
      this.disableDetailsButton = false
    })
  }

  AddToFavorites(instance:any){
    console.log("Added to Favourite", instance);
    instance.isFavorite = !instance.isFavorite
    if (instance.isFavorite){
      this.eventService.addEventToFavourites(instance)
    }else{
      this.eventService.removeEventFromfavourites(instance)
    }
  }

  deleteFromFavorites(instance:any){
    console.log("Deleted from Favourite", instance);
    instance.isFavorite = !instance.isFavorite

    //New
    if(instance.ID == this.clickedEvent.ID){
      this.clickedEvent.isFavorite = instance.isFavorite
      this.eventService.changeFavoriteEvent(this.clickedEvent)
    }
    //-

    var newFavIDList = []
    for (var i=0;i< this.favIDList.length;i++){
      if(this.favIDList[i] != instance.ID){
        newFavIDList.push(this.favIDList[i])
      }
    }
    this.favIDList = newFavIDList

    if (instance.isFavorite){
      this.eventService.addEventToFavourites(instance)
    }else{
      this.eventService.removeEventFromfavourites(instance)
    }
    this.callFavouritesData()
  }

  callFavouritesData(){
    this.eventService.getAllFavoriteEvents()
  }

  clickOnDetails(){
    this.isDetailsButtonClicked = true
      this.eventService.changeIsSearchClicked(false);
      this.eventService.changeDisplayEventDetails(true)
      this.eventService.changeIsFavClicked(false);

  }

}
