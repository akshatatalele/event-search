import { Component, OnInit } from '@angular/core';
import { EventDetails } from 'src/app/model/eventDetails';
import { ArtistDetails } from 'src/app/model/artistDetails';
import { VenueDetails } from 'src/app/model/venueDetails';
import { EventService } from 'src/app/service/event.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  eventDetails = new EventDetails()
  artistDetails = new ArtistDetails()
  venueDetails = new VenueDetails()
  displayEventDetails_ = false
  detailType = 'eventInfo'

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.eventService.eventDetails$.subscribe(
      message => {
        //==================Changed=============
        // this.parseResponseForEventDetails(message)
      }
    )

    this.eventService.displayEventDetails$.subscribe(
      message => {
        this.changeDisplayEventDetails_(message)
      }
    )
  }

  parseResponseForEventDetails(response:any){

    if(response != {}){
      this.eventDetails.Name = response['Name']
      this.eventDetails.Artists = response['Artist / Team']
      this.eventDetails.Venue = response['Venue']
      this.eventDetails.Date = response['Date']
      this.eventDetails.Category = response['Genres']
      this.eventDetails.PriceRange = response['Price Ranges']
      this.eventDetails.TicketStatus = response['Ticket Status']
      this.eventDetails.BuyTicketAt = response['Buy Ticket At']
      this.eventDetails.SeatMap = response['Seatmap']
      this.eventService.changeDisplayEventDetails(true)
      this.eventService.changeIsSearchClicked(false)
    }
  }

  changeDisplayEventDetails_(value:any){
    this.displayEventDetails_ = value
  }

}
