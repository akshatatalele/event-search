import { Component, OnInit } from '@angular/core';
import { EventDetails } from 'src/app/model/eventDetails';
import { ArtistDetails } from 'src/app/model/artistDetails';
import { VenueDetails } from 'src/app/model/venueDetails';
import { EventService } from 'src/app/service/event.service';
import { trigger, state, style, animate, transition } from '@angular/animations';


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
  displayEventDetails_ = false
  detailType = 'eventInfo'
  twitter_href = ""

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
  }

  parseResponseForEventDetails(response:any){

    console.log("Details component: ", response)

    // Store Event information
    if (response['Event Info']){
      if ("error" in response['Event Info']){
        if (response['Event Info']['error'] == "Failed to get event details results"){
          console.log("Failed to get event details results")
        }
      }
      else{
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
      // console.log("Artist Info: ", response['Artists Info'])
      if ("error" in response['Artists Info']){
        if (response['Artists Info']['error'] == "Failed to get artist details results"){
          // If api fails
          console.log("Failed to get artist details results")
        }else if (response['Artists Info']['error'] == "No details available"){
          // If there is no information about any fields
          console.log("No details available")
        }
      }
      else if("NoArtist" in response['Artists Info']){
        console.log("No artists")
      }else{
        this.artistsDetailsList = []
        for(var key in response['Artists Info']){
          if("error" in response['Artists Info'][key]){
            console.log(key, "No details available")
          }
          else{

            var artistDetails = new ArtistDetails()
            artistDetails.Name = response['Artists Info'][key]['Name']
            artistDetails.Followers = response['Artists Info'][key]['Followers']
            artistDetails.Popularity = response['Artists Info'][key]['Popularity']
            artistDetails.CheckAt = response['Artists Info'][key]['CheckAt']
            this.artistsDetailsList.push(artistDetails)
          }
        }
      }
    }

    // Store Venue information
    if (response['Venue Info']){
      if ("error" in response['Venue Info']){
        if (response['Venue Info']['error'] == "Failed to get venue details results"){
          // If api fails
          console.log("Failed to get venue details results")
        }else if (response['Venue Info']['error'] == "No details available"){
          // If there is no information about any fields
          console.log("No details available")
        }
      }
      else{
        this.venueDetails.Address =  response['Venue Info']['Address']
        this.venueDetails.City = response['Venue Info']['City']
        this.venueDetails.PhoneNumber = response['Venue Info']['PhoneNumber']
        this.venueDetails.OpenHours = response['Venue Info']['OpenHours']
        this.venueDetails.GeneralRule = response['Venue Info']['GeneralRule']
        this.venueDetails.ChildRule = response['Venue Info']['ChildRule']
        // var latlong = response['Venue Info']['LatLong'].split(",")
        this.venueDetails.Latitude = response['Venue Info']['Latitude']
        this.venueDetails.Longitude = response['Venue Info']['Longitude']
      }
    }

  }

  changeDisplayEventDetails_(value:any){
    this.displayEventDetails_ = value
  }

  showEventList(){
    this.eventService.changeDisplayEventDetails(false)
    this.eventService.changeIsSearchClicked(true)
  }

}
