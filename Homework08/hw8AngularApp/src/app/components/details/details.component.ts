import { Component, OnInit } from '@angular/core';
import { EventDetails } from 'src/app/model/eventDetails';
import { ArtistDetails } from 'src/app/model/artistDetails';
import { VenueDetails } from 'src/app/model/venueDetails';
import { EventService } from 'src/app/service/event.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { EventTable } from 'src/app/model/eventTable';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  animations: [
    trigger('EnterLeave', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.3s')
      ])
    ])
  ]
})

export class DetailsComponent implements OnInit {

  eventDetails = new EventDetails()
  artistsDetailsList: ArtistDetails[] = []
  venueDetails = new VenueDetails()
  clickedEvent = new EventTable("", "", "", "", "", false) //new
  isFavEvent: boolean = false
  displayEventDetails_ = false
  detailType = 'eventInfo'
  twitter_href = ""
  showAlert = false
  showVenueAlert = false
  alertClass = ""
  alertText = ""
  showArtistAlert = false
  isArtistButNoDetails = false
  ifLatLongPresent = false

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.eventService.eventDetails$.subscribe(
      message => {
        //==================Changed=============
        this.parseResponseForEventDetails(message)
      }
    )

    this.eventService.displayEventDetails$.subscribe(
      message => {
        this.changeDisplayEventDetails_(message)
      }
    )

    //-new
    this.eventService.favoriteEvent$.subscribe(
      msg => {
        this.getClickedEvent(msg)
      }
    )
    //-

    // this.eventService._favouritesDataObservable$.subscribe(
    //   message =>{
    //     this.parseFavList(message)
    //   }
    // )
  }

  // parseFavList(value:any){
  //   console.log("Fav list subscriber, clicked event: ",this.clickedEvent)
  //   if (this.clickedEvent.isFavorite == true){
  //     this.isFavEvent = true
  //   }else{
  //     this.isFavEvent = false
  //   }
  // }

  //-new
  getClickedEvent(value:any){
    this.clickedEvent = value
    if (this.clickedEvent.isFavorite == true){
      this.isFavEvent = true
    }else{
      this.isFavEvent = false
    }
  }
  //-

  parseResponseForEventDetails(response:any){

    console.log("Details component: ", response)

    if("error" in response){
      this.alertClass = "alert alert-danger"
      this.alertText = response['error']
      this.showAlert = true
      this.eventService.changeDisplayEventDetails(true)
      this.eventService.changeIsSearchClicked(false)
    }else{
      // Store Event information
      if (response['Event Info']){
        if ("error" in response['Event Info']){
          if (response['Event Info']['error'] == "Failed to get event details results"){
            console.log("Failed to get event details results")
            this.alertClass = "alert alert-danger"
            this.alertText = response['Event Info']['error']
            this.showAlert = true
            this.eventService.changeDisplayEventDetails(true)
            this.eventService.changeIsSearchClicked(false)
          }
        }
        else{
          this.showAlert = false
          this.eventDetails.ID = response['Event Info']['ID']
          this.eventDetails.Name = response['Event Info']['Name']
          this.eventDetails.Artists = response['Event Info']['Artist / Team']
          this.eventDetails.Venue = response['Event Info']['Venue']
          this.eventDetails.Date = response['Event Info']['Date']
          this.eventDetails.Category = response['Event Info']['Genres']
          this.eventDetails.PriceRange = response['Event Info']['Price Ranges']
          this.eventDetails.TicketStatus = response['Event Info']['Ticket Status']
          this.eventDetails.BuyTicketAt = response['Event Info']['Buy Ticket At']
          this.eventDetails.SeatMap = response['Event Info']['Seatmap']
          this.twitter_href = "https://twitter.com/intent/tweet?text=" + this.eventDetails.Name + " located at " + this.eventDetails.Venue + ". #CSCI571EventSearch"
          this.eventService.changeDisplayEventDetails(true)
          this.eventService.changeIsSearchClicked(false)
        }
      }

      // Store Artists information
      if (response['Artists Info']){
        this.artistsDetailsList = []
        // console.log("Artist Info: ", response['Artists Info'])
        if ("error" in response['Artists Info']){
          if (response['Artists Info']['error'] == "Failed to get artist details results"){
            // If api fails
            console.log("Failed to get artist details results")
            this.alertClass = "alert alert-danger"
            this.alertText = response['Artists Info']['error']
            this.showArtistAlert = true
          }else if (response['Artists Info']['error'] == "No details available"){
            // If there is no information about any fields
            console.log("No details available")
          }
        }
        else if("NoArtist" in response['Artists Info']){
          console.log("No artists")
          this.alertClass = "alert alert-warning"
          this.alertText = "No Artists"
          this.showArtistAlert = true
        }else{
          for(var key in response['Artists Info']){
            var artistDetails = new ArtistDetails()
            if("error" in response['Artists Info'][key]){
              console.log(key, "No details available")
              artistDetails.Name = key
              artistDetails.ifDetailsPresent = false
            }
            else{
              artistDetails.Name = response['Artists Info'][key]['Name']
              artistDetails.Followers = response['Artists Info'][key]['Followers']
              artistDetails.Popularity = response['Artists Info'][key]['Popularity']
              artistDetails.CheckAt = response['Artists Info'][key]['CheckAt']
              artistDetails.ifDetailsPresent = true
            }
            this.artistsDetailsList.push(artistDetails)
          }
        }
      }

      // Store Venue information
      if (response['Venue Info']){
        this.venueDetails = new VenueDetails()
        if ("error" in response['Venue Info']){
          if (response['Venue Info']['error'] == "Failed to get venue details results"){
            // If api fails
            console.log("Failed to get venue details results")
            this.alertClass = "alert alert-danger"
            this.alertText = response['Venue Info']['error']
            this.showVenueAlert = true
          }else if (response['Venue Info']['error'] == "No details available"){
            // If there is no information about any fields
            console.log("No details available")
            this.alertClass = "alert alert-warning"
            this.alertText = response['Venue Info']['error']
            this.showVenueAlert = true
          }
        }
        else{
          this.showVenueAlert = false
          this.venueDetails.Address =  response['Venue Info']['Address']
          this.venueDetails.City = response['Venue Info']['City']
          this.venueDetails.PhoneNumber = response['Venue Info']['PhoneNumber']
          this.venueDetails.OpenHours = response['Venue Info']['OpenHours']
          this.venueDetails.GeneralRule = response['Venue Info']['GeneralRule']
          this.venueDetails.ChildRule = response['Venue Info']['ChildRule']
          // var latlong = response['Venue Info']['LatLong'].split(",")
          if (response['Venue Info']['Latitude'] == 0 || response['Venue Info']['Latitude'] == 0){
            this.ifLatLongPresent = false
          }else{
            this.venueDetails.Latitude = response['Venue Info']['Latitude']
            this.venueDetails.Longitude = response['Venue Info']['Longitude']
            this.ifLatLongPresent = true
          }
        }
      }
    }
  }

  changeDisplayEventDetails_(value:any){
    this.displayEventDetails_ = value
  }

  showEventList(){
    this.eventService.changeDisplayEventDetails(false)
    //Check if Search button is clicked or not, if not then do not display the table
    this.eventService.changeIsSearchClicked(true)
  }

  clickOnStar(){
    console.log("Clicked on star before toggle: ", this.isFavEvent)
    this.isFavEvent = !this.isFavEvent
    this.clickedEvent['isFavorite'] = this.isFavEvent
    console.log("Clicked on star after toggle: ", this.isFavEvent)
    console.log("Clicked on star after toggle: ", this.clickedEvent)
    this.eventService.changeFavoriteEvent(this.clickedEvent)
    if (this.isFavEvent){
      this.eventService.addEventToFavourites(this.clickedEvent)
    }else{
      this.eventService.removeEventFromfavourites(this.clickedEvent)
    }
    this.eventService.getAllFavoriteEvents()
  }
}
