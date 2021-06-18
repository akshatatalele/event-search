import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EventService {

  REST_API: string = 'http://localhost:8000/api'
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  private messageSource = new Subject();
  messageSource$ = this.messageSource.asObservable();

  private eventDetails = new Subject();
  eventDetails$ = this.eventDetails.asObservable();

  private isSearchClicked = new Subject();
  isSearchClicked$ = this.isSearchClicked.asObservable();

  private isFavClicked = new Subject();
  isFavClicked$ = this.isFavClicked.asObservable();

  private displayEventDetails = new Subject();
  displayEventDetails$ = this.displayEventDetails.asObservable();

  private progress = new Subject();
  progress$ = this.progress.asObservable();

  constructor(private httpClient: HttpClient) { }

  // getEvents() {
  //   return this.httpClient.get(`${this.REST_API}`);
  // }

  changeProgress(value:number){
    this.progress.next(value)
  }

  changeIsSearchClicked(value:boolean){
    this.isSearchClicked.next(value)
  }

  changeDisplayEventDetails(value:boolean){
    this.displayEventDetails.next(value)
  }

  changeIsFavClicked(value:boolean){
    this.isFavClicked.next(value)
  }

  sendMessage(message:JSON){
    this.messageSource.next(message);
  }

  updateEventDetails(message:JSON){
    this.eventDetails.next(message);
  }

  getEventsList(userInput:any): Observable<any> {

    let API_URL = `${this.REST_API}/get-event-list/${JSON.stringify(userInput)}`;
    console.log(API_URL)
    return this.httpClient.get(API_URL, { headers: this.httpHeaders})
      // .pipe(map((res: any) => {
      //     return res || {}
      //   }),
      //   catchError(this.handleError)
      // )
  }

  getEventsDetails(eventID:any): Observable<any> {
    // {"id":"ID of event"}
    let API_URL = `${this.REST_API}/get-event-details/${JSON.stringify(eventID)}`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders})
  }

  getEventVenueDetails(venue:any): Observable<any> {
    // venue
    let API_URL = `${this.REST_API}/get-venue-details/${JSON.stringify(venue)}`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders})
  }

  getEventArtistDetails(artist:any): Observable<any> {
    // artist
    let API_URL = `${this.REST_API}/get-artists-details/${JSON.stringify(artist)}`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders})
  }

  getSuggestions(word:any): Observable<any> {
    // word
    let API_URL = `${this.REST_API}/get-event-suggestions/${JSON.stringify(word)}`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders})
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Handle client error
      errorMessage = error.error.message;
    } else {
      // Handle server error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
