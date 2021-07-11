import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { WeatherSearchComponent } from './weather-search/weather-search.component';

export interface Weather {

  success: boolean;
  city: string;
  country: string;
  clouds: string;
  windSpeed: string;
  temp: string;
  date: string;
  time: string;
  humidity: string;
  iconId: string;
  feelsLike: string;

}

@Injectable({
  providedIn: 'root',
})


export class GetWeatherService {
  cityToGet: string;
  private urlToSend: string;

  constructor(private http: HttpClient) {}

  public getCityToSearch(cityToGet: string) {
    this.cityToGet = cityToGet;

    this.setUrl();
  }


  setUrl() {
    this.urlToSend =
      'http://localhost:4545/api/get-weather/' +
      this.cityToGet;
  }

  

  getWeatherResponse(): Observable<HttpResponse<Weather>> {
    return this.http.get<Weather>(this.urlToSend, { observe: 'response' }).pipe(
      catchError(this.handleError) // then handle the error
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
      
    }
    // Return an observable with a user-facing error message.
    
    return throwError('Something bad happened; please try again later.');
  }

 
}
