import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EventService } from './service/event.service'
import { EventSearch } from './model/event';
import * as $ from 'jquery'
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpClientModule, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'hw8AngularApp';


  category = ['Music', 'Sports', 'Arts & Theatre', 'Film', 'Miscellaneous']
  userInput = {"Keyword":"", "Category": "", "Distance": 10, "Units": "","radio":"", "LatLong": ""}

  APIKey_IpInfo = "879f3cd55bf6c3"

  isCurrentLoc = true
  currentLoc = ""
  public latLongLoc: unknown

  constructor(private eventService: EventService,private httpClient: HttpClient) { }

  eventInstance = new EventSearch("", "All", 10, "Miles", "currentLoc", "")

  ngOnInit(): void {
    //Get current location of the user
    this.httpClient.get("https://ipinfo.io/json?token=" + this.APIKey_IpInfo).subscribe(data =>{
      this.getlat(data)
    })

    // this.event.getEvents().subscribe(res => {
    //   console.log(res)
    //   this.message =res;
    // });

    // var data1 = {"client":"maroon 5", "loc":"LA"}
    // this.event.getEvent(data1).subscribe(res => {
    //   console.log(res)
    //   this.message =res;
    // });

    // $.getJSON("https://ipinfo.io/json?token=" + this.APIKey_IpInfo,
    // function(data) {
    //     getLatLong(data.loc);
    // });
  }

  getlat(data:any){
    this.currentLoc = data.loc
  }

  // Search button On Click
  async onSubmit(event_:Event){
    event_.preventDefault();
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
      // this.latLongLoc = await this.httpClient
      //   .get<any>("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + this.APIKEY_GoogleAPI)
      //   .pipe(delay(1000))
      //   .toPromise();
      //   this.getlatlongFromAddr(this.latLongLoc)
    }

    // send userInput to server side for processing
    this.eventService.getEventsList(this.userInput).subscribe(res => {
        console.log(res)
      });;
  }

  // getlatlongFromAddr(data:any){
  //   var coords = data['results'][0]['geometry']['location']
  //   this.userInput['LatLong'] = coords['lat'] + ',' + coords['lng']
  // }

  // getLatLong(){
  //   var latlong = ""
  //   if (this.eventInstance.radioValue == "currentLoc"){
  //     // Use ipinfo.io latlong
  //     latlong = this.currentLoc
  //   }
  //   else if(this.eventInstance.radioValue == "location"){
  //     // Use geocoding to get latlong
  //     var address = this.eventInstance.locVal
  //     this.latLongLoc = await this.httpClient
  //       .get<any>("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + this.APIKEY_GoogleAPI)
  //       .pipe(delay(1000))
  //       .toPromise();
  //       latlong = this.getlatlongFromAddr(this.latLongLoc)
  //   }
  //   return latlong
  // }

  // callGeoCodingAPI(address: any){
  //   var latlong = ""
  //   this.httpClient.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + this.APIKEY_GoogleAPI).subscribe(data =>{
  //     latlong = this.getlatlongFromAddr(data)
  //   })
  //   return latlong
  // }

}



