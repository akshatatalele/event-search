import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { EventService } from './service/event.service'
import { EventSearch } from './model/event';
import * as $ from 'jquery'
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpClientModule, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'hw8AngularApp';


  category = ['Music', 'Sports', 'Arts & Theatre', 'Film', 'Miscellaneous']
  userInput = {"Keyword":"", "Category": "All", "Distance": 10, "Units": "miles","radio":"", "LatLong": ""}

  APIKey_IpInfo = "879f3cd55bf6c3"

  isCurrentLoc = true
  isSearchClicked = false
  currentLoc = ""
  isProgressVisible = false
  dataAvailable = 10
  public latLongLoc: unknown
  autocompleteList: string[] = []

  constructor(private eventService: EventService,private httpClient: HttpClient) { }

  eventInstance = new EventSearch("", "All", 10, "miles", "currentLoc", "")

  ngOnInit(): void {
    //Get current location of the user
    this.httpClient.get("https://ipinfo.io/json?token=" + this.APIKey_IpInfo).subscribe(data =>{
      this.getlat(data)
    })


    // this.eventService.getEventArtistDetails("Maroon5").subscribe(res => {
    //   console.log(res)
    // });;

    // this.event.getEvents().subscribe(res => {
    //   console.log(res)
    //   this.message =res;
    // });

    // var data1 = {"client":"maroon 5", "loc":"LA"}
    // this.event.getEvent(data1).subscribe(res => {
    //   console.log(res)
    //   this.message =res;
    // });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.autocompleteList.filter(option => option.toLowerCase().includes(filterValue));
  }

  getlat(data:any){
    this.currentLoc = data.loc
  }

  // Search button On Click
  async onSubmit(event_:Event){
    // event_.preventDefault();
    this.eventService.changeIsSearchClicked(false);
    this.eventService.changeDisplayEventDetails(false)
    this.isProgressVisible = true
    this.dataAvailable = 30
    if (this.eventInstance.distance == null){
      this.eventInstance.distance=10
    }

    if(this.eventInstance.category == null){
      this.eventInstance.category="All"
    }

    if(this.eventInstance.units == null){
      this.eventInstance.units="miles"
    }
    if(this.eventInstance.radioValue == null){
      this.eventInstance.radioValue="currentLoc"
    }

    console.log("Search click: ",this.eventInstance)
    this.userInput['Keyword'] = this.eventInstance.keyword;
    this.userInput['Category'] = this.eventInstance.category;
    this.userInput['Distance'] = this.eventInstance.distance;
    this.userInput['Units'] = this.eventInstance.units;

    if (this.eventInstance.radioValue == "currentLoc"){
      // Use ipinfo.io latlong
      this.userInput['LatLong'] = this.currentLoc
      this.userInput['radio'] = ""
    }
    else if(this.eventInstance.radioValue == "location"){
      // Use geocoding to get latlong
      this.userInput['LatLong'] = this.eventInstance.locVal
      this.userInput['radio'] = "location"
    }

    // send userInput to server side for processing
    this.eventService.getEventsList(this.userInput).subscribe(res => {
        console.log(res)
        this.dataAvailable=50
        this.isProgressVisible = false
        this.eventService.sendMessage(res);

    });;3
  }

  callAutocomplete(word:any){
    this.eventService.getSuggestions(word).subscribe(res => {
      console.log(res)
      this.populateAutocompleteList(res)
    });;
  }

  populateAutocompleteList(value:any){
    this.autocompleteList = value
  }

  clearAll(){
    // this.isSearchClicked = false
    this.autocompleteList = []
    this.eventService.changeIsSearchClicked(false);
    this.eventService.changeIsFavClicked(false);
    this.eventService.changeDisplayEventDetails(false)
  }

  clickOnResults(){
    this.eventService.changeIsSearchClicked(true);
    this.eventService.changeIsFavClicked(false);
  }

  clickOnFavorite(){
    this.eventService.changeIsFavClicked(true);
    this.eventService.changeIsSearchClicked(false);
  }
  // getlatlongFromAddr(data:any){
  //   var coords = data['results'][0]['geometry']['location']
  //   this.userInput['LatLong'] = coords['lat'] + ',' + coords['lng']
  // }

}



