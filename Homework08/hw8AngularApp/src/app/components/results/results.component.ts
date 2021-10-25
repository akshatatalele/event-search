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
  clickedEvent = new EventTable("", "", "", "", "", false, "")

  isSearchClicked: boolean = false
  isFavClicked: boolean = false
  animate = true
  disableDetailsButton = true
  isDetailsButtonClicked = false
  alertClass = ""
  alertText = ""
  whichList = ""


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
    var newFavList = []
    console.log("Subscriber response: ", response)
    console.log("subscriber fav id list before: ", this.favIDList)
    console.log("Subscriber eventTableList after: ", this.eventTableList)
    for (var key in response) {
      console.log("response.key", response[key])
      var newName = "", tooltip = ""
        if(response[key]['Name'].length >= 30){
          newName = response[key]['Name'].substring(0, 27) + "..."
          tooltip = response[key]['Name']
        }else{
          newName = response[key]['Name']
        }
      this.favTableList.push(new EventTable(response[key]['ID'], response[key]['Date'], newName , response[key]['Category'], response[key]['Venue'], true, tooltip))

      // console.log("List empty or not: ", this.favIDList.length)
      if (this.favIDList.length != 0){
        for(var favid in this.favIDList){
          if(this.favIDList[favid] == response[key]['ID']){
            //if favidlist id is in fav
            newFavList.push(this.favIDList[favid])
          }
        }
        if(response[key]["ID"] == this.clickedEvent.ID){
          newFavList.push(response[key]["ID"])
        }
      }else{
        newFavList.push(response[key]["ID"])
      }

      // if(!this.favIDList.includes(response[key]['ID'])){
      //   //new favid not in fav id list
      //   this.favIDList.push(response[key]['ID'])
      // }else{
      //   if(this.clickedEvent.ID == response[key]['ID']){
      //     var newFavIDList = []
      //     for (var i=0;i< this.favIDList.length;i++){
      //       if(this.favIDList[i] != response[key]['ID']){
      //         newFavIDList.push(this.favIDList[i])
      //       }
      //     }
      //     this.favIDList = newFavIDList
      //   }
      // }
// && this.clickedEvent.ID == response[key]['ID']
      // for (var key1 in this.eventTableList){
      //   if(response[key]["ID"] == this.eventTableList[key1]["ID"]){
      //     this.eventTableList[key1].isFavorite = true
      //   }
      //   if(this.eventTableList[key1]["ID"] == this.clickedEvent.ID){
      //     this.eventTableList[key1]["isFavorite"] = this.clickedEvent.isFavorite
      //   }
      // }

    }
    this.favIDList = newFavList
    console.log("subscriber fav id list after: ", this.favIDList)

    for(var key in this.eventTableList){
      console.log(this.favIDList.includes(this.eventTableList[key]["ID"]))
      if(!this.favIDList.includes(this.eventTableList[key]["ID"])){
        this.eventTableList[key]['isFavorite'] = false
      }

      // for(var key1 in this.favIDList){
      //   if(this.eventTableList[key]['ID'] == this.favIDList[key1]){
      //     this.eventTableList[key]['isFavorite'] = true
      //   }
      // }
    }
    console.log("Subscriber eventTableList after: ", this.eventTableList)
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
    // this.callFavouritesData() // ----------------------------------------------------22:21

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
        var newName = "", tooltip = ""
        if(response[key]['Event'].length >= 30){
          newName = response[key]['Event'].substring(0, 27) + "..."
          tooltip = response[key]['Event']
        }else{
          newName = response[key]['Event']
        }

        if (this.favIDList.includes(response[key]['ID'])){

          this.eventTableList.push(new EventTable(response[key]['ID'], response[key]['Date'], newName , response[key]['Category'], response[key]['Venue'], true, tooltip))
        }else{
          this.eventTableList.push(new EventTable(response[key]['ID'], response[key]['Date'], newName , response[key]['Category'], response[key]['Venue'], false, tooltip))
        }

      }
      console.log("Populating eventTableList: ", this.eventTableList)
      this.eventService.changeIsSearchClicked(true);
    }


    if(this.isDetailsButtonClicked != true){
      this.disableDetailsButton = true
    }
  }

  clickedEventDetails(instance:EventTable, list:any){
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
    this.eventService.changeWhichList(list)
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

    // var newFavIDList = []
    // for (var i=0;i< this.favIDList.length;i++){
    //   if(this.favIDList[i] != instance.ID){
    //     newFavIDList.push(this.favIDList[i])
    //   }
    // }
    // this.favIDList = newFavIDList
    // console.log("Delete")
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

  clickOnDetails(list:any){
    this.eventService.changeWhichList(list)
    this.isDetailsButtonClicked = true
      this.eventService.changeIsSearchClicked(false);
      this.eventService.changeDisplayEventDetails(true)
      this.eventService.changeIsFavClicked(false);

  }

}
